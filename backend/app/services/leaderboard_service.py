from app.models.leaderboard import Leaderboard
from app.models.submission import Submission
from app.models.user import User
from app.core.constants import VERDICT_ACCEPTED


def create_leaderboard_entry_service(
    contest_id: int,
    user_id: int,
    username: str,
    solved: int = 0,
    penalty: int = 0,
    rank: int = 0,
) -> Leaderboard:
    entry = Leaderboard(
        contest_id=contest_id,
        user_id=user_id,
        username=username,
        solved=solved,
        penalty=penalty,
        rank=rank,
    )
    return entry


def get_or_create_leaderboard_entry(db, contest_id: int, user: User) -> Leaderboard:
    entry = db.query(Leaderboard).filter(
        (Leaderboard.contest_id == contest_id)
        & (Leaderboard.user_id == user.id)
    ).first()

    if entry:
        return entry

    entry = create_leaderboard_entry_service(
        contest_id=contest_id,
        user_id=user.id,
        username=user.username,
    )
    db.add(entry)
    db.flush()
    return entry


def update_leaderboard_for_accepted_submission(
    db,
    submission: Submission,
    user: User,
    contest,
) -> Leaderboard | None:
    if submission.verdict != VERDICT_ACCEPTED or not submission.contest_id:
        return None

    previous_accepted = db.query(Submission).filter(
        (Submission.contest_id == submission.contest_id)
        & (Submission.user_id == submission.user_id)
        & (Submission.problem_id == submission.problem_id)
        & (Submission.verdict == VERDICT_ACCEPTED)
        & (Submission.id != submission.id)
    ).first()

    if previous_accepted:
        return get_or_create_leaderboard_entry(db, submission.contest_id, user)

    entry = get_or_create_leaderboard_entry(db, submission.contest_id, user)
    wrong_attempts = db.query(Submission).filter(
        (Submission.contest_id == submission.contest_id)
        & (Submission.user_id == submission.user_id)
        & (Submission.problem_id == submission.problem_id)
        & (Submission.id != submission.id)
        & (Submission.verdict != VERDICT_ACCEPTED)
    ).count()

    entry.solved += 1
    entry.penalty += _contest_elapsed_minutes(contest) + (wrong_attempts * 20)

    recalculate_contest_ranks(db, submission.contest_id)
    return entry


def recalculate_contest_ranks(db, contest_id: int) -> list[Leaderboard]:
    entries = db.query(Leaderboard).filter(
        Leaderboard.contest_id == contest_id
    ).all()
    ranked_entries = calculate_ranks(entries)

    for entry in ranked_entries:
        db.add(entry)

    return ranked_entries


def calculate_ranks(entries: list[Leaderboard]) -> list[Leaderboard]:
    sorted_entries = sorted(
        entries,
        key=lambda item: (-item.solved, item.penalty, item.username.lower()),
    )

    for index, entry in enumerate(sorted_entries, start=1):
        entry.rank = index

    return sorted_entries


def _contest_elapsed_minutes(contest) -> int:
    from datetime import datetime

    try:
        start_time = datetime.fromisoformat(contest.start_time)
    except ValueError:
        return 0

    elapsed_seconds = max(0, (datetime.now() - start_time).total_seconds())
    return int(elapsed_seconds // 60)


def format_leaderboard_entry(entry: Leaderboard) -> dict:
    return {
        "id": entry.id,
        "contest_id": entry.contest_id,
        "user_id": entry.user_id,
        "username": entry.username,
        "solved": entry.solved,
        "penalty": entry.penalty,
        "rank": entry.rank,
    }
