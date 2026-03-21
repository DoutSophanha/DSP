from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class SubtitleSegment(BaseModel):
    start: str
    end: str
    text: str


class ExtractRequest(BaseModel):
    url: HttpUrl
    source_lang: str = Field(default="en")


class ExtractResponse(BaseModel):
    session_id: str
    subtitles: list[SubtitleSegment]
    available_subtitle_languages: list[str] = Field(default_factory=list)


class TranslateRequest(BaseModel):
    target_lang: str = Field(default="km")
    source_lang: str = Field(default="en")
    session_id: Optional[str] = None
    subtitles: list[SubtitleSegment] = Field(default_factory=list)


class TranslateResponse(BaseModel):
    session_id: Optional[str] = None
    subtitles: list[SubtitleSegment]


class TTSRequest(BaseModel):
    session_id: Optional[str] = None
    text: Optional[str] = None
    subtitles: list[SubtitleSegment] = Field(default_factory=list)


class TTSResponse(BaseModel):
    session_id: Optional[str] = None
    audio_url: str
    audio_path: str
