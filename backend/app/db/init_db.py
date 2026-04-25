from app.db.session import Base, engine

# Import models here so SQLAlchemy can detect them before creating tables
from app.models.user import User
from app.models.problem import Problem
from app.models.testcase import Testcase
from app.models.contest import Contest
from app.models.contest_problem import ContestProblem
from app.models.submission import Submission
from app.models.leaderboard import Leaderboard


def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")