from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest
from app.services.auth_service import login_user_service, register_user_service

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == payload.email) | (User.username == payload.username)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already exists",
        )

    result = register_user_service(
        full_name=payload.full_name,
        username=payload.username,
        email=payload.email,
        password=payload.password,
        role="user",
    )

    user = result["user"]
    db.add(user)
    db.commit()
    db.refresh(user)

    login_result = login_user_service(
        email=payload.email,
        password=payload.password,
        user=user,
    )

    return {
        "message": result["message"],
        "access_token": login_result["access_token"],
        "token_type": login_result["token_type"],
        "user": user,
    }


@router.post("/login", response_model=AuthResponse)
def login_user(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    result = login_user_service(
        email=payload.email,
        password=payload.password,
        user=user,
    )

    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result["message"],
        )

    return {
        "message": result["message"],
        "access_token": result["access_token"],
        "token_type": result["token_type"],
        "user": result["user"],
    }


@router.get("/me")
def get_current_user():
    return {
        "message": "Current user endpoint will be connected with JWT later."
    }