from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    username: str
    email: EmailStr
    role: str

    model_config = {
        "from_attributes": True
    }


class AuthResponse(BaseModel):
    message: str
    access_token: str
    token_type: str
    user: UserResponse