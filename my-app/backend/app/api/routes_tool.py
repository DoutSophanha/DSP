from __future__ import annotations

import subprocess
import uuid
from pathlib import Path
from urllib.parse import quote

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from app.core.config import DOWNLOADS_DIR, TEMP_DIR, WHISPER_MODEL
from app.models.subtitle_cache import create_session, get_session, update_session
from app.schemas.tool import (
    ExtractRequest,
    ExtractResponse,
    SubtitleSegment,
    TranslateRequest,
    TranslateResponse,
    TTSRequest,
    TTSResponse,
)
from services.subtitle_service import (
    segments_to_srt,
    segments_to_txt,
    transcribe_audio_to_segments,
    vtt_to_segments,
)
from services.translation_service import translate_segments
from services.tts_service import generate_tts_audio
from services.youtube_service import (
    extract_audio,
    extract_subtitles,
    list_available_subtitle_languages,
    reencode_to_mp4,
)

router = APIRouter(tags=["dsp-tool"])


def _session_output_dir(session_id: str) -> Path:
    output_dir = DOWNLOADS_DIR / "sessions" / session_id
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir


def _encode_file_url(path: Path) -> str:
    return f"/static-file?path={quote(str(path))}"


@router.post("/extract", response_model=ExtractResponse)
def extract_subtitles_endpoint(request: ExtractRequest) -> ExtractResponse:
    session_id = str(uuid.uuid4())
    source_lang = request.source_lang.lower()
    output_dir = _session_output_dir(session_id)

    try:
        available_languages = list_available_subtitle_languages(str(request.url))

        vtt_path = extract_subtitles(str(request.url), source_lang, output_dir)
        if vtt_path:
            source_segments = vtt_to_segments(vtt_path)
        else:
            audio_path = extract_audio(str(request.url), output_dir)
            source_segments = transcribe_audio_to_segments(
                audio_path=audio_path,
                model_name=WHISPER_MODEL,
                source_lang=source_lang,
            )

        if not source_segments:
            raise HTTPException(status_code=422, detail="No subtitles were found for this video")

        create_session(
            session_id,
            url=str(request.url),
            source_lang=source_lang,
            available_subtitle_languages=available_languages,
            original_subtitles=source_segments,
        )

        return ExtractResponse(
            session_id=session_id,
            subtitles=[SubtitleSegment(**segment) for segment in source_segments],
            available_subtitle_languages=available_languages,
        )
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Failed to extract subtitles: {error}") from error


@router.post("/translate", response_model=TranslateResponse)
def translate_subtitles_endpoint(request: TranslateRequest) -> TranslateResponse:
    source_segments = [segment.model_dump() for segment in request.subtitles]
    session_id = request.session_id

    if not source_segments and session_id:
        session = get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        source_segments = session.get("original_subtitles", [])

    if not source_segments:
        raise HTTPException(status_code=422, detail="No subtitle data provided for translation")

    try:
        translated = translate_segments(
            source_segments,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
        )

        if session_id:
            update_session(
                session_id,
                translated_subtitles=translated,
                target_lang=request.target_lang.lower(),
            )

        return TranslateResponse(
            session_id=session_id,
            subtitles=[SubtitleSegment(**segment) for segment in translated],
        )
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Failed to translate subtitles: {error}") from error


@router.post("/tts", response_model=TTSResponse)
def generate_tts_endpoint(request: TTSRequest) -> TTSResponse:
    session_id = request.session_id or str(uuid.uuid4())
    output_dir = _session_output_dir(session_id)

    subtitles = [segment.model_dump() for segment in request.subtitles]
    if not subtitles and request.session_id:
        session = get_session(request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        subtitles = session.get("translated_subtitles") or session.get("original_subtitles", [])

    if request.text:
        subtitles = [{"start": "00:00:00,000", "end": "00:00:00,000", "text": request.text}]

    if not subtitles:
        raise HTTPException(status_code=422, detail="No subtitle text available for TTS")

    wav_path = output_dir / "tts.wav"
    mp3_path = output_dir / "tts.mp3"

    try:
        generated_wav = generate_tts_audio(subtitles, wav_path)
        subprocess.run(
            ["ffmpeg", "-y", "-i", str(generated_wav), str(mp3_path)],
            check=True,
            capture_output=True,
            text=True,
        )
        update_session(session_id, audio_path=str(mp3_path))

        return TTSResponse(
            session_id=session_id,
            audio_url=_encode_file_url(mp3_path),
            audio_path=str(mp3_path),
        )
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Failed to generate TTS: {error}") from error


@router.get("/download/srt")
def download_srt(session_id: str = Query(...), subtitle_type: str = Query("translated")):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    subtitle_key = "translated_subtitles" if subtitle_type == "translated" else "original_subtitles"
    segments = session.get(subtitle_key, [])
    if subtitle_type == "translated" and not segments:
        segments = session.get("original_subtitles", [])

    if not segments:
        raise HTTPException(status_code=422, detail="No subtitle data available")

    output_path = _session_output_dir(session_id) / f"subtitles_{subtitle_type}.srt"
    file_path = segments_to_srt(segments, output_path)
    return FileResponse(path=file_path, filename=file_path.name, media_type="application/x-subrip")


@router.get("/download/txt")
def download_txt(session_id: str = Query(...), subtitle_type: str = Query("translated")):
    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    subtitle_key = "translated_subtitles" if subtitle_type == "translated" else "original_subtitles"
    segments = session.get(subtitle_key, [])
    if subtitle_type == "translated" and not segments:
        segments = session.get("original_subtitles", [])

    if not segments:
        raise HTTPException(status_code=422, detail="No subtitle data available")

    output_path = _session_output_dir(session_id) / f"subtitles_{subtitle_type}.txt"
    file_path = segments_to_txt(segments, output_path)
    return FileResponse(path=file_path, filename=file_path.name, media_type="text/plain")


@router.get("/download/video")
def download_video(url: str = Query(..., min_length=1)):
    output_dir = TEMP_DIR / "video-downloads" / str(uuid.uuid4())
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        video_path = reencode_to_mp4(url, output_dir)
        return FileResponse(path=video_path, filename=video_path.name, media_type="video/mp4")
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Video download unavailable: {error}") from error
