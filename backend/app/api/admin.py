from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.contest import Contest
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User
from app.services.contest_service import refresh_contest_statuses

router = APIRouter()


@router.get("/dashboard")
def get_admin_dashboard(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_problems = db.query(Problem).count()
    total_contests = db.query(Contest).count()
    total_submissions = db.query(Submission).count()

    return {
        "message": "Admin dashboard data fetched successfully",
        "stats": {
            "total_users": total_users,
            "total_problems": total_problems,
            "total_contests": total_contests,
            "total_submissions": total_submissions,
        },
    }


@router.get("/overview")
def get_admin_overview(db: Session = Depends(get_db)):
    recent_users = db.query(User).order_by(User.id.desc()).limit(5).all()
    recent_problems = db.query(Problem).order_by(Problem.id.desc()).limit(5).all()
    recent_contests = db.query(Contest).order_by(Contest.id.desc()).limit(5).all()
    refresh_contest_statuses(recent_contests, db)
    recent_submissions = db.query(Submission).order_by(Submission.id.desc()).limit(5).all()

    return {
        "recent_users": [
            {
                "id": user.id,
                "full_name": user.full_name,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            }
            for user in recent_users
        ],
        "recent_problems": [
            {
                "id": problem.id,
                "title": problem.title,
                "code": problem.code,
                "difficulty": problem.difficulty,
            }
            for problem in recent_problems
        ],
        "recent_contests": [
            {
                "id": contest.id,
                "title": contest.title,
                "status": contest.status,
                "start_time": contest.start_time,
                "end_time": contest.end_time,
            }
            for contest in recent_contests
        ],
        "recent_submissions": [
            {
                "id": submission.id,
                "user_id": submission.user_id,
                "problem_id": submission.problem_id,
                "language": submission.language,
                "verdict": submission.verdict,
            }
            for submission in recent_submissions
        ],
    }
