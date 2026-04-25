from app.models.leaderboard import Leaderboard


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


def calculate_ranks(entries: list[Leaderboard]) -> list[Leaderboard]:
    sorted_entries = sorted(
        entries,
        key=lambda item: (-item.solved, item.penalty, item.username.lower()),
    )

    for index, entry in enumerate(sorted_entries, start=1):
        entry.rank = index

    return sorted_entries


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