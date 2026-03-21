from __future__ import annotations

import json
from datetime import datetime, timezone

from app.core.redis_client import get_redis


SESSION_TTL_SECONDS = 60 * 60 * 6


def _session_key(session_id: str) -> str:
    return f"subtitle_session:{session_id}"


def create_session(
    session_id: str,
    *,
    url: str,
    source_lang: str,
    available_subtitle_languages: list[str],
    original_subtitles: list[dict],
) -> None:
    now = datetime.now(timezone.utc).isoformat()
    data = {
        "session_id": session_id,
        "url": url,
        "source_lang": source_lang,
        "target_lang": "",
        "original_subtitles": json.dumps(original_subtitles, ensure_ascii=False),
        "translated_subtitles": json.dumps([], ensure_ascii=False),
        "available_subtitle_languages": json.dumps(available_subtitle_languages, ensure_ascii=False),
        "audio_path": "",
        "created_at": now,
        "updated_at": now,
    }

    redis_client = get_redis()
    key = _session_key(session_id)
    redis_client.hset(key, mapping=data)
    redis_client.expire(key, SESSION_TTL_SECONDS)


def get_session(session_id: str) -> dict | None:
    redis_client = get_redis()
    data = redis_client.hgetall(_session_key(session_id))
    if not data:
        return None

    parsed = dict(data)
    parsed["original_subtitles"] = json.loads(parsed.get("original_subtitles", "[]"))
    parsed["translated_subtitles"] = json.loads(parsed.get("translated_subtitles", "[]"))
    parsed["available_subtitle_languages"] = json.loads(
        parsed.get("available_subtitle_languages", "[]")
    )
    return parsed


def update_session(session_id: str, **updates) -> None:
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    serialized: dict[str, str] = {}

    for key, value in updates.items():
        if isinstance(value, (list, dict)):
            serialized[key] = json.dumps(value, ensure_ascii=False)
        elif value is None:
            serialized[key] = ""
        else:
            serialized[key] = str(value)

    redis_client = get_redis()
    key = _session_key(session_id)
    redis_client.hset(key, mapping=serialized)
    redis_client.expire(key, SESSION_TTL_SECONDS)
