from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.contest import Contest
from app.models.leaderboard import Leaderboard
from app.models.user import User
from app.schemas.leaderboard import LeaderboardCreate, LeaderboardResponse
from app.services.leaderboard_service import (
    calculate_ranks,
    create_leaderboard_entry_service,
    format_leaderboard_entry,
)

router = APIRouter()


@router.get("/", response_model=list[LeaderboardResponse])
def get_all_leaderboards(db: Session = Depends(get_db)):
    entries = db.query(Leaderboard).all()
    ranked_entries = calculate_ranks(entries)
    return [format_leaderboard_entry(entry) for entry in ranked_entries]


@router.get("/contest/{contest_id}", response_model=list[LeaderboardResponse])
def get_contest_leaderboard(contest_id: int, db: Session = Depends(get_db)):
    contest = db.query(Contest).filter(Contest.id == contest_id).first()

    if not contest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contest not found",
        )

    entries = db.query(Leaderboard).filter(Leaderboard.contest_id == contest_id).all()
    ranked_entries = calculate_ranks(entries)

    for entry in ranked_entries:
        db.add(entry)
    db.commit()

    return [format_leaderboard_entry(entry) for entry in ranked_entries]


@router.post("/", response_model=LeaderboardResponse, status_code=status.HTTP_201_CREATED)
def create_leaderboard_entry(payload: LeaderboardCreate, db: Session = Depends(get_db)):
    contest = db.query(Contest).filter(Contest.id == payload.contest_id).first()
    if not contest:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contest not found",
        )

    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    existing_entry = db.query(Leaderboard).filter(
        (Leaderboard.contest_id == payload.contest_id) &
        (Leaderboard.user_id == payload.user_id)
    ).first()

    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Leaderboard entry already exists for this user in this contest",
        )

    entry = create_leaderboard_entry_service(
        contest_id=payload.contest_id,
        user_id=payload.user_id,
        username=payload.username,
        solved=payload.solved,
        penalty=payload.penalty,
        rank=payload.rank,
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    contest_entries = db.query(Leaderboard).filter(
        Leaderboard.contest_id == payload.contest_id
    ).all()
    ranked_entries = calculate_ranks(contest_entries)

    for ranked_entry in ranked_entries:
        db.add(ranked_entry)
    db.commit()
    db.refresh(entry)

    return format_leaderboard_entry(entry)