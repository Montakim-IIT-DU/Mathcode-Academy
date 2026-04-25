def compile_code(language: str, source_code: str) -> dict:
    if not source_code.strip():
        return {
            "success": False,
            "message": "Source code cannot be empty"
        }

    supported_languages = {"python", "cpp", "java"}

    if language.lower() not in supported_languages:
        return {
            "success": False,
            "message": "Unsupported language"
        }

    return {
        "success": True,
        "message": f"{language} code compiled successfully (simulated)"
    }