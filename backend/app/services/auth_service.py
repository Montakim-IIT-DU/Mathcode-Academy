from datetime import timedelta
from typing import Optional

from app.core.config import settings
from app.core.security import create_access_token
from app.models.user import User
from app.utils.hashing import hash_password, verify_password


def register_user_service(
    full_name: str,
    username: str,
    email: str,
    password: str,
    role: str = "user",
) -> dict:
    hashed_password = hash_password(password)

    user = User(
        full_name=full_name,
        username=username,
        email=email,
        password=hashed_password,
        role=role,
    )

    return {
        "message": "User registered successfully",
        "user": user,
    }


def login_user_service(email: str, password: str, user: Optional[User] = None) -> dict:
    if user is None:
        return {
            "success": False,
            "message": "Invalid email or password",
        }

    if not verify_password(password, user.password):
        return {
            "success": False,
            "message": "Invalid email or password",
        }

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        },
        expires_delta=access_token_expires,
    )

    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }