import os
import subprocess
import sys
import tempfile
from pathlib import Path

from app.utils.comparator import compare_output

VERDICT_ACCEPTED = "Accepted"
VERDICT_WRONG_ANSWER = "Wrong Answer"
VERDICT_TIME_LIMIT_EXCEEDED = "Time Limit Exceeded"
VERDICT_RUNTIME_ERROR = "Runtime Error"
VERDICT_COMPILATION_ERROR = "Compilation Error"

SUPPORTED_LANGUAGES = {
    "python": "python",
    "py": "python",
    "cpp": "cpp",
    "c++": "cpp",
    "java": "java",
}


def judge_submission(
    language: str,
    source_code: str,
    testcases: list,
    time_limit: int = 2,
) -> dict:
    normalized_language = SUPPORTED_LANGUAGES.get(language.lower())

    if not normalized_language:
        return _result(
            verdict=VERDICT_COMPILATION_ERROR,
            message="Unsupported programming language",
        )

    if not source_code.strip():
        return _result(
            verdict=VERDICT_COMPILATION_ERROR,
            message="Source code cannot be empty",
        )

    if not testcases:
        return _result(
            verdict=VERDICT_COMPILATION_ERROR,
            message="No testcases configured for this problem",
        )

    timeout_seconds = max(1, int(time_limit or 2))

    with tempfile.TemporaryDirectory(prefix="mathcode_judge_") as workdir:
        prepared = _prepare_solution(normalized_language, source_code, Path(workdir))

        if not prepared["success"]:
            return _result(
                verdict=VERDICT_COMPILATION_ERROR,
                message=prepared["message"],
                stderr=prepared.get("stderr", ""),
                total_count=len(testcases),
            )

        for index, testcase in enumerate(testcases, start=1):
            input_data = _get_testcase_value(testcase, "input_data", "input")
            expected_output = _get_testcase_value(testcase, "expected_output", "output")

            run_result = _run_command(
                prepared["run_command"],
                input_data,
                timeout_seconds,
                cwd=workdir,
            )

            if run_result["timeout"]:
                return _result(
                    verdict=VERDICT_TIME_LIMIT_EXCEEDED,
                    message=f"Testcase {index} exceeded {timeout_seconds}s",
                    passed_count=index - 1,
                    total_count=len(testcases),
                )

            if run_result["returncode"] != 0:
                return _result(
                    verdict=VERDICT_RUNTIME_ERROR,
                    message=f"Testcase {index} failed at runtime",
                    stderr=run_result["stderr"],
                    passed_count=index - 1,
                    total_count=len(testcases),
                )

            if not compare_output(run_result["stdout"], expected_output):
                return _result(
                    verdict=VERDICT_WRONG_ANSWER,
                    message=f"Wrong answer on testcase {index}",
                    actual_output=_truncate(run_result["stdout"]),
                    expected_output=_truncate(expected_output),
                    passed_count=index - 1,
                    total_count=len(testcases),
                )

    return _result(
        verdict=VERDICT_ACCEPTED,
        message="All testcases passed",
        passed_count=len(testcases),
        total_count=len(testcases),
    )


def _prepare_solution(language: str, source_code: str, workdir: Path) -> dict:
    if language == "python":
        return _prepare_python(source_code, workdir)

    if language == "cpp":
        return _prepare_cpp(source_code, workdir)

    if language == "java":
        return _prepare_java(source_code, workdir)

    return {"success": False, "message": "Unsupported programming language"}


def _prepare_python(source_code: str, workdir: Path) -> dict:
    source_path = workdir / "solution.py"
    source_path.write_text(source_code, encoding="utf-8")

    compile_result = _run_command(
        [sys.executable, "-m", "py_compile", str(source_path)],
        input_data="",
        timeout_seconds=5,
        cwd=str(workdir),
    )

    if compile_result["returncode"] != 0:
        return {
            "success": False,
            "message": "Python compilation failed",
            "stderr": compile_result["stderr"],
        }

    return {
        "success": True,
        "run_command": [sys.executable, str(source_path)],
    }


def _prepare_cpp(source_code: str, workdir: Path) -> dict:
    source_path = workdir / "solution.cpp"
    exe_path = workdir / ("solution.exe" if os.name == "nt" else "solution")
    source_path.write_text(source_code, encoding="utf-8")

    compile_result = _run_command(
        ["g++", "-std=c++17", "-O2", str(source_path), "-o", str(exe_path)],
        input_data="",
        timeout_seconds=10,
        cwd=str(workdir),
    )

    if compile_result["missing_command"]:
        return {
            "success": False,
            "message": "g++ compiler is not installed or not available in PATH",
            "stderr": compile_result["stderr"],
        }

    if compile_result["returncode"] != 0:
        return {
            "success": False,
            "message": "C++ compilation failed",
            "stderr": compile_result["stderr"],
        }

    return {
        "success": True,
        "run_command": [str(exe_path)],
    }


def _prepare_java(source_code: str, workdir: Path) -> dict:
    source_path = workdir / "Main.java"
    source_path.write_text(source_code, encoding="utf-8")

    compile_result = _run_command(
        ["javac", str(source_path)],
        input_data="",
        timeout_seconds=10,
        cwd=str(workdir),
    )

    if compile_result["missing_command"]:
        return {
            "success": False,
            "message": "javac is not installed or not available in PATH",
            "stderr": compile_result["stderr"],
        }

    if compile_result["returncode"] != 0:
        return {
            "success": False,
            "message": "Java compilation failed",
            "stderr": compile_result["stderr"],
        }

    return {
        "success": True,
        "run_command": ["java", "-cp", str(workdir), "Main"],
    }


def _run_command(
    command: list[str],
    input_data: str,
    timeout_seconds: int,
    cwd: str,
) -> dict:
    try:
        completed = subprocess.run(
            command,
            input=input_data,
            capture_output=True,
            cwd=cwd,
            text=True,
            timeout=timeout_seconds,
        )
        return {
            "returncode": completed.returncode,
            "stdout": completed.stdout,
            "stderr": completed.stderr,
            "timeout": False,
            "missing_command": False,
        }
    except subprocess.TimeoutExpired as error:
        return {
            "returncode": -1,
            "stdout": error.stdout or "",
            "stderr": error.stderr or "",
            "timeout": True,
            "missing_command": False,
        }
    except FileNotFoundError as error:
        return {
            "returncode": -1,
            "stdout": "",
            "stderr": str(error),
            "timeout": False,
            "missing_command": True,
        }


def _get_testcase_value(testcase, primary_key: str, fallback_key: str) -> str:
    if isinstance(testcase, dict):
        return str(testcase.get(primary_key, testcase.get(fallback_key, "")))

    return str(
        getattr(testcase, primary_key, getattr(testcase, fallback_key, ""))
    )


def _result(
    verdict: str,
    message: str,
    passed_count: int = 0,
    total_count: int = 0,
    stderr: str = "",
    actual_output: str = "",
    expected_output: str = "",
) -> dict:
    return {
        "success": verdict == VERDICT_ACCEPTED,
        "verdict": verdict,
        "message": message,
        "passed_count": passed_count,
        "total_count": total_count,
        "stderr": _truncate(stderr),
        "actual_output": actual_output,
        "expected_output": expected_output,
    }


def _truncate(value: str, limit: int = 1000) -> str:
    if len(value) <= limit:
        return value

    return value[:limit] + "\n... truncated ..."
