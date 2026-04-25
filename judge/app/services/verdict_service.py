def get_verdict_for_code(language: str, source_code: str) -> str:
    language = language.lower()
    code = source_code.lower()

    if language not in {"python", "cpp", "java"}:
        return "Compilation Error"

    if not source_code.strip():
        return "Compilation Error"

    if "syntaxerror" in code or "compile_error" in code:
        return "Compilation Error"

    if "runtime_error" in code:
        return "Runtime Error"

    if "time_limit" in code:
        return "Time Limit Exceeded"

    if "wrong_answer" in code:
        return "Wrong Answer"

    return "Accepted"