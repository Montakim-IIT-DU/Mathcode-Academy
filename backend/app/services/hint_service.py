from app.models.problem import Problem
from app.utils.helpers import tags_string_to_list


def generate_problem_hints(problem: Problem) -> dict:
    topic = (problem.topic or "General").strip()
    tags = tags_string_to_list(problem.tags)
    search_text = " ".join(
        [
            problem.title or "",
            problem.statement or "",
            topic,
            " ".join(tags),
        ]
    ).lower()

    hints = [
        _reading_hint(problem),
        _strategy_hint(search_text, topic),
        _implementation_hint(search_text),
    ]

    return {
        "problem_id": problem.id,
        "topic": topic,
        "hints": hints,
    }


def _reading_hint(problem: Problem) -> str:
    statement = (problem.statement or "").lower()

    if "given integer n" in statement or "size of array" in statement:
        return "First read the size value, then read the values that belong to that input size."

    if "read two integers" in statement:
        return "Start by reading the two input numbers exactly once."

    if "read three integers" in statement:
        return "Start by reading all three numbers before comparing them."

    return "Identify the exact input values and the exact output format before writing the algorithm."


def _strategy_hint(search_text: str, topic: str) -> str:
    if "sort" in search_text or "array" in topic.lower():
        return "Think about storing the numbers in a list or array, then arranging them before printing."

    if "maximum" in search_text or "max" in search_text:
        return "Keep track of the largest value while comparing the inputs."

    if "even" in search_text or "odd" in search_text:
        return "Use the remainder after division by 2 to separate even and odd numbers."

    if "sum" in search_text or "add" in search_text:
        return "After reading the numbers, combine them with the operation asked in the statement."

    return "Break the problem into input reading, core calculation, and output printing."


def _implementation_hint(search_text: str) -> str:
    if "sort" in search_text:
        return "Be careful to print the sorted values in the same spacing format as the expected output."

    if "time limit" in search_text:
        return "Avoid unnecessary nested loops if the input size can be large."

    return "Test your code with the sample input first, then try one small edge case yourself."
