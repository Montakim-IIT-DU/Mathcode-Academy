from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.contest import Contest
from app.models.contest_participant import ContestParticipant
from app.models.contest_problem import ContestProblem
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.testcase import Testcase
from app.models.user import User
from app.schemas.submission import SubmissionCreate, SubmissionResponse
from app.services.judge_service import judge_submission_service
from app.services.leaderboard_service import update_leaderboard_for_accepted_submission
from app.services.submission_service import (
    create_submission_service,
    format_submission_response,
    update_submission_verdict_service,
)

router = APIRouter()


@router.get("/", response_model=list[SubmissionResponse])
def get_all_submissions(db: Session = Depends(get_db)):
    submissions = db.query(Submission).all()
    return [format_submission_response(submission) for submission in submissions]


@router.get("/user/{user_id}", response_model=list[SubmissionResponse])
def get_user_submissions(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    submissions = db.query(Submission).filter(Submission.user_id == user_id).all()
    return [format_submission_response(submission) for submission in submissions]


@router.get("/{submission_id}", response_model=SubmissionResponse)
def get_submission_by_id(submission_id: int, db: Session = Depends(get_db)):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()

    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found",
        )

    return format_submission_response(submission)


@router.post("/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def create_submission(payload: SubmissionCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    problem = db.query(Problem).filter(Problem.id == payload.problem_id).first()
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    contest = None
    if payload.contest_id:
        contest = db.query(Contest).filter(Contest.id == payload.contest_id).first()
        if not contest:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contest not found",
            )

        contest_problem = db.query(ContestProblem).filter(
            (ContestProblem.contest_id == contest.id)
            & (ContestProblem.problem_id == problem.id)
        ).first()
        if not contest_problem:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This problem is not part of the selected contest.",
            )

        participant = db.query(ContestParticipant).filter(
            (ContestParticipant.contest_id == contest.id)
            & (ContestParticipant.user_id == user.id)
        ).first()
        if not participant:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Join this contest before submitting contest solutions.",
            )

    testcases = db.query(Testcase).filter(Testcase.problem_id == problem.id).all()

    if not testcases:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This problem has no testcases configured yet.",
        )

    submission = create_submission_service(
        payload=payload,
        verdict="Pending",
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    judge_result = judge_submission_service(
        language=payload.language,
        source_code=payload.source_code,
        testcases=testcases,
        time_limit=problem.time_limit,
    )

    submission = update_submission_verdict_service(
        submission,
        judge_result["verdict"],
    )
    if contest:
        update_leaderboard_for_accepted_submission(db, submission, user, contest)

    db.commit()
    db.refresh(submission)

    return format_submission_response(submission)
