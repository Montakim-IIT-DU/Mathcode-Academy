from app.core.constants import (
    VERDICT_ACCEPTED,
    VERDICT_COMPILATION_ERROR,
    VERDICT_PENDING,
    VERDICT_RUNTIME_ERROR,
    VERDICT_TIME_LIMIT_EXCEEDED,
    VERDICT_WRONG_ANSWER,
)


SUPPORTED_LANGUAGES = {"python", "cpp", "java"}


def validate_language(language: str) -> bool:
    return language.lower() in SUPPORTED_LANGUAGES


def judge_submission_service(language: str, source_code: str) -> dict:
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

    return {
        "success": True,
        "verdict": VERDICT_PENDING,
        "message": "Submission queued for judging",
    }


def simulate_judge_result(source_code: str) -> str:
    code = source_code.lower()

    if "syntaxerror" in code or "compile_error" in code:
        return VERDICT_COMPILATION_ERROR
    if "runtime_error" in code:
        return VERDICT_RUNTIME_ERROR
    if "time_limit" in code:
        return VERDICT_TIME_LIMIT_EXCEEDED
    if "wrong_answer" in code:
        return VERDICT_WRONG_ANSWER

    return VERDICT_ACCEPTED