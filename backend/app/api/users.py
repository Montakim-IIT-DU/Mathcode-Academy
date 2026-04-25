from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.submission import Submission
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.utils.hashing import hash_password

router = APIRouter()


@router.get("/", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    submissions = db.query(Submission).filter(Submission.user_id == user_id).all()
    
    accepted_count = sum(1 for sub in submissions if sub.verdict == "Accepted")
    total_submissions = len(submissions)
    
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "total_submissions": total_submissions,
        "accepted_submissions": accepted_count,
        "acceptance_rate": (accepted_count / total_submissions * 100) if total_submissions > 0 else 0,
    }


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == payload.email) | (User.username == payload.username)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already exists",
        )

    user = User(
        full_name=payload.full_name,
        username=payload.username,
        email=payload.email,
        password=hash_password(payload.password),
        role=payload.role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.full_name = payload.full_name
    user.username = payload.username
    user.email = payload.email

    db.commit()
    db.refresh(user)

    return user


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}