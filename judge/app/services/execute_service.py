def execute_code(language: str, source_code: str) -> dict:
    if not source_code.strip():
        return {
            "success": False,
            "message": "Source code cannot be empty"
        }

    return {
        "success": True,
        "message": f"{language} code executed successfully (simulated)"
    }