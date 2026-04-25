from datetime import datetime
from typing import Any

from app.core.constants import (
    CONTEST_FINISHED,
    CONTEST_RUNNING,
    CONTEST_UPCOMING,
)


def success_response(message: str, data: Any = None) -> dict:
    return {
        "success": True,
        "message": message,
        "data": data,
    }


def error_response(message: str, errors: Any = None) -> dict:
    return {
        "success": False,
        "message": message,
        "errors": errors,
    }


def tags_list_to_string(tags: list[str] | None) -> str:
    if not tags:
        return ""
    return ",".join(tag.strip() for tag in tags if tag.strip())


def tags_string_to_list(tags: str | None) -> list[str]:
    if not tags:
        return []
    return [tag.strip() for tag in tags.split(",") if tag.strip()]


def get_contest_status(start_time: str, end_time: str) -> str:
    now = datetime.now()
    start = datetime.fromisoformat(start_time)
    end = datetime.fromisoformat(end_time)

    if now < start:
        return CONTEST_UPCOMING
    if start <= now <= end:
        return CONTEST_RUNNING
    return CONTEST_FINISHED