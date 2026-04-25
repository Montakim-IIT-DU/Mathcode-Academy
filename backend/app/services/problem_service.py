from app.models.problem import Problem
from app.utils.helpers import tags_list_to_string, tags_string_to_list


def create_problem_service(payload) -> Problem:
    problem = Problem(
        title=payload.title,
        code=payload.code,
        statement=payload.statement,
        difficulty=payload.difficulty,
        time_limit=payload.time_limit,
        memory_limit=payload.memory_limit,
        tags=payload.tags if isinstance(payload.tags, str) else tags_list_to_string(payload.tags),
    )
    return problem


def update_problem_service(problem: Problem, payload) -> Problem:
    problem.title = payload.title
    problem.code = payload.code
    problem.statement = payload.statement
    problem.difficulty = payload.difficulty
    problem.time_limit = payload.time_limit
    problem.memory_limit = payload.memory_limit
    problem.tags = payload.tags if isinstance(payload.tags, str) else tags_list_to_string(payload.tags)
    return problem


def format_problem_response(problem: Problem) -> dict:
    return {
        "id": problem.id,
        "title": problem.title,
        "code": problem.code,
        "statement": problem.statement,
        "difficulty": problem.difficulty,
        "time_limit": problem.time_limit,
        "memory_limit": problem.memory_limit,
        "tags": tags_string_to_list(problem.tags),
    }