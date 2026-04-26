def normalize_output(output: str) -> str:
    normalized = output.replace("\r\n", "\n").replace("\r", "\n").strip()
    return "\n".join(line.rstrip() for line in normalized.split("\n"))


def compare_output(actual_output: str, expected_output: str) -> bool:
    return normalize_output(actual_output) == normalize_output(expected_output)
