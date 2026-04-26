import json
import urllib.error
import urllib.request

from app.core.config import settings
from app.core.constants import (
    VERDICT_COMPILATION_ERROR,
    VERDICT_JUDGE_ERROR,
)

SUPPORTED_LANGUAGES = {"python", "cpp", "java"}


def validate_language(language: str) -> bool:
    return language.lower() in SUPPORTED_LANGUAGES


def judge_submission_service(
    language: str,
    source_code: str,
    testcases: list,
    time_limit: int = 2,
) -> dict:
    normalized_language = language.lower()

    if not validate_language(normalized_language):
        return {
            "success": False,
            "verdict": VERDICT_COMPILATION_ERROR,
            "message": "Unsupported programming language",
        }

    if not source_code.strip():
        return {
            "success": False,
            "verdict": VERDICT_COMPILATION_ERROR,
            "message": "Source code cannot be empty",
        }

    if not testcases:
        return {
            "success": False,
            "verdict": VERDICT_COMPILATION_ERROR,
            "message": "No testcases configured for this problem",
        }

    payload = {
        "language": normalized_language,
        "source_code": source_code,
        "time_limit": max(1, int(time_limit or 2)),
        "testcases": [
            {
                "input_data": testcase.input_data,
                "expected_output": testcase.expected_output,
            }
            for testcase in testcases
        ],
    }

    request = urllib.request.Request(
        settings.JUDGE_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=_request_timeout(payload)) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError as error:
        return {
            "success": False,
            "verdict": VERDICT_JUDGE_ERROR,
            "message": f"Judge server is unavailable: {error.reason}",
        }
    except TimeoutError:
        return {
            "success": False,
            "verdict": VERDICT_JUDGE_ERROR,
            "message": "Judge server request timed out",
        }
    except json.JSONDecodeError:
        return {
            "success": False,
            "verdict": VERDICT_JUDGE_ERROR,
            "message": "Judge server returned an invalid response",
        }


def _request_timeout(payload: dict) -> int:
    testcase_count = max(1, len(payload["testcases"]))
    time_limit = max(1, int(payload["time_limit"]))
    return max(10, testcase_count * time_limit + 10)
