from app.models.contest import Contest
from app.models.contest_participant import ContestParticipant
from app.models.contest_problem import ContestProblem
from app.models.problem import Problem
from app.services.problem_service import format_problem_response
from app.utils.helpers import get_contest_status


def create_contest_service(payload) -> Contest:
    contest = Contest(
        title=payload.title,
        description=payload.description,
        contest_type=payload.contest_type,
        venue=payload.venue,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status=get_contest_status(payload.start_time, payload.end_time),
    )
    return contest


def update_contest_service(contest: Contest, payload) -> Contest:
    contest.title = payload.title
    contest.description = payload.description
    contest.contest_type = payload.contest_type
    contest.venue = payload.venue
    contest.start_time = payload.start_time
    contest.end_time = payload.end_time
    contest.status = get_contest_status(payload.start_time, payload.end_time)
    return contest


def set_current_contest_status(contest: Contest) -> bool:
    current_status = get_contest_status(contest.start_time, contest.end_time)

    if contest.status == current_status:
        return False

    contest.status = current_status
    return True


def refresh_contest_status(contest: Contest, db=None) -> Contest:
    changed = set_current_contest_status(contest)

    if changed and db:
        db.add(contest)
        db.commit()
        db.refresh(contest)

    return contest


def refresh_contest_statuses(contests: list[Contest], db=None) -> list[Contest]:
    changed = False

    for contest in contests:
        changed = set_current_contest_status(contest) or changed

    if changed and db:
        db.commit()
        for contest in contests:
            db.refresh(contest)

    return contests


def format_contest_response(contest: Contest, db=None) -> dict:
    problems = []
    participant_count = 0

    if db:
        problems = (
            db.query(Problem)
            .join(ContestProblem, ContestProblem.problem_id == Problem.id)
            .filter(ContestProblem.contest_id == contest.id)
            .all()
        )
        participant_count = (
            db.query(ContestParticipant)
            .filter(ContestParticipant.contest_id == contest.id)
            .count()
        )

    return {
        "id": contest.id,
        "title": contest.title,
        "description": contest.description,
        "contest_type": contest.contest_type,
        "venue": contest.venue,
        "start_time": contest.start_time,
        "end_time": contest.end_time,
        "status": contest.status,
        "problems": [format_problem_response(problem) for problem in problems],
        "participant_count": participant_count,
    }
