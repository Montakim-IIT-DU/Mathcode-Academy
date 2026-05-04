from sqlalchemy import inspect, text

from app.db.session import Base, engine

# Import models here so SQLAlchemy can detect them before creating tables
from app.models.user import User
from app.models.problem import Problem
from app.models.testcase import Testcase
from app.models.contest import Contest
from app.models.contest_problem import ContestProblem
from app.models.contest_participant import ContestParticipant
from app.models.submission import Submission
from app.models.leaderboard import Leaderboard


def _add_column_if_missing(table_name: str, column_name: str, definition: str) -> None:
    inspector = inspect(engine)
    column_names = [column["name"] for column in inspector.get_columns(table_name)]

    if column_name in column_names:
        return

    with engine.begin() as connection:
        connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {definition}"))


def init_db():
    Base.metadata.create_all(bind=engine)
    _add_column_if_missing(
        "problems",
        "topic",
        "topic VARCHAR NOT NULL DEFAULT 'General'",
    )
    _add_column_if_missing(
        "contests",
        "contest_type",
        "contest_type VARCHAR NOT NULL DEFAULT 'Online'",
    )
    _add_column_if_missing("contests", "venue", "venue VARCHAR")
    _add_column_if_missing("submissions", "contest_id", "contest_id INTEGER")
    _add_column_if_missing("submissions", "created_at", "created_at VARCHAR")
    with engine.begin() as connection:
        connection.execute(
            text("UPDATE submissions SET created_at = date('now') WHERE created_at IS NULL")
        )
    print("Database tables created successfully.")
