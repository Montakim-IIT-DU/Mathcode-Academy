from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.contest import Contest
from app.schemas.contest import ContestCreate, ContestResponse, ContestUpdate
from app.services.contest_service import (
    create_contest_service,
    format_contest_response,
    update_contest_service,
)

router = APIRouter()


@router.get("/", response_model=list[ContestResponse])
def get_all_contests(db: Session = Depends(get_db)):
    contests = db.query(Contest).all()
    return [format_contest_response(contest) for contest in contests]


@router.get("/{contest_id}", response_model=ContestResponse)
def get_contest_by_id(contest_id: int, db: Session = Depends(get_db)):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()

    if not contest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contest not found",
        )

    return format_contest_response(contest)


@router.post("/", response_model=ContestResponse, status_code=status.HTTP_201_CREATED)
def create_contest(payload: ContestCreate, db: Session = Depends(get_db)):
    contest = create_contest_service(payload)
    db.add(contest)
    db.commit()
    db.refresh(contest)

    return format_contest_response(contest)


@router.put("/{contest_id}", response_model=ContestResponse)
def update_contest(contest_id: int, payload: ContestUpdate, db: Session = Depends(get_db)):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()

    if not contest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contest not found",
        )

    contest = update_contest_service(contest, payload)
    db.commit()
    db.refresh(contest)

    return format_contest_response(contest)


@router.post("/{contest_id}/join")
def join_contest(contest_id: int, db: Session = Depends(get_db)):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()

    if not contest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contest not found",
        )

    return {
        "message": f"Successfully joined contest '{contest.title}'"
    }