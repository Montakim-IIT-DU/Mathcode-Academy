from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.contest import Contest
from app.models.contest_participant import ContestParticipant
from app.models.contest_problem import ContestProblem
from app.models.problem import Problem
from app.models.user import User
from app.schemas.contest import (
    ContestCreate,
    ContestJoinRequest,
    ContestResponse,
    ContestUpdate,
)
from app.services.contest_service import (
    create_contest_service,
    format_contest_response,
    update_contest_service,
)
from app.services.leaderboard_service import (
    get_or_create_leaderboard_entry,
    recalculate_contest_ranks,
)

router = APIRouter()


@router.get("/", response_model=list[ContestResponse])
def get_all_contests(db: Session = Depends(get_db)):
    contests = db.query(Contest).all()
    return [format_contest_response(contest, db) for contest in contests]


@router.get("/{contest_id}", response_model=ContestResponse)
def get_contest_by_id(contest_id: int, db: Session = Depends(get_db)):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()

    if not contest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contest not found",
        )

    return format_contest_response(contest, db)


@router.post("/", response_model=ContestResponse, status_code=status.HTTP_201_CREATED)
def create_contest(payload: ContestCreate, db: Session = Depends(get_db)):
    problem_ids = list(dict.fromkeys(payload.problem_ids))
    if problem_ids:
        existing_problem_ids = {
            problem.id
            for problem in db.query(Problem).filter(Problem.id.in_(problem_ids)).all()
        }
        missing_problem_ids = [
            problem_id for problem_id in problem_ids if problem_id not in existing_problem_ids
        ]

        if missing_problem_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Problem IDs not found: {', '.join(map(str, missing_problem_ids))}",
            )

    contest = create_contest_service(payload)
    db.add(contest)
    db.commit()
    db.refresh(contest)

    for problem_id in problem_ids:
        db.add(ContestProblem(contest_id=contest.id, problem_id=problem_id))

    db.commit()
    db.refresh(contest)

    return format_contest_response(contest, db)


@router.put("/{contest_id}", response_model=ContestResponse)
def update_contest(contest_id: int, payload: ContestUpdate, db: Session = Depends(get_db)):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()

    if not contest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contest not found",
        )

    contest = update_contest_service(contest, payload)
    problem_ids = list(dict.fromkeys(payload.problem_ids))
    if problem_ids:
        existing_problem_ids = {
            problem.id
            for problem in db.query(Problem).filter(Problem.id.in_(problem_ids)).all()
        }
        missing_problem_ids = [
            problem_id for problem_id in problem_ids if problem_id not in existing_problem_ids
        ]

        if missing_problem_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Problem IDs not found: {', '.join(map(str, missing_problem_ids))}",
            )

    db.query(ContestProblem).filter(ContestProblem.contest_id == contest.id).delete()
    for problem_id in problem_ids:
        db.add(ContestProblem(contest_id=contest.id, problem_id=problem_id))

    db.commit()
    db.refresh(contest)

    return format_contest_response(contest, db)


@router.post("/{contest_id}/join")
def join_contest(
    contest_id: int,
    payload: ContestJoinRequest | None = None,
    db: Session = Depends(get_db),
):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()

    if not contest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contest not found",
        )

    participant_count = (
        db.query(ContestParticipant)
        .filter(ContestParticipant.contest_id == contest.id)
        .count()
    )

    if payload and payload.user_id:
        user = db.query(User).filter(User.id == payload.user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        existing_participant = db.query(ContestParticipant).filter(
            (ContestParticipant.contest_id == contest.id)
            & (ContestParticipant.user_id == user.id)
        ).first()

        if existing_participant:
            return {
                "message": f"You already joined contest '{contest.title}'",
                "joined": True,
                "participant_count": participant_count,
            }

        db.add(ContestParticipant(contest_id=contest.id, user_id=user.id))
        get_or_create_leaderboard_entry(db, contest.id, user)
        recalculate_contest_ranks(db, contest.id)
        db.commit()
        participant_count += 1

    return {
        "message": f"Successfully joined contest '{contest.title}'",
        "joined": True,
        "participant_count": participant_count,
    }
