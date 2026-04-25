from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.problems import router as problems_router
from app.api.contests import router as contests_router
from app.api.submissions import router as submissions_router
from app.api.leaderboard import router as leaderboard_router
from app.api.testcase import router as testcase_router
from app.api.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(problems_router, prefix="/problems", tags=["Problems"])
api_router.include_router(contests_router, prefix="/contests", tags=["Contests"])
api_router.include_router(submissions_router, prefix="/submissions", tags=["Submissions"])
api_router.include_router(leaderboard_router, prefix="/leaderboard", tags=["Leaderboard"])
api_router.include_router(testcase_router, prefix="/testcases", tags=["Testcases"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])