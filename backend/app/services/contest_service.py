from app.models.contest import Contest
from app.utils.helpers import get_contest_status


def create_contest_service(payload) -> Contest:
    contest = Contest(
        title=payload.title,
        description=payload.description,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status=get_contest_status(payload.start_time, payload.end_time),
    )
    return contest


def update_contest_service(contest: Contest, payload) -> Contest:
    contest.title = payload.title
    contest.description = payload.description
    contest.start_time = payload.start_time
    contest.end_time = payload.end_time
    contest.status = get_contest_status(payload.start_time, payload.end_time)
    return contest


def format_contest_response(contest: Contest) -> dict:
    return {
        "id": contest.id,
        "title": contest.title,
        "description": contest.description,
        "start_time": contest.start_time,
        "end_time": contest.end_time,
        "status": contest.status,
    }