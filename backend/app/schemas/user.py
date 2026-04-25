from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    full_name: str
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: str = "user"


class UserUpdate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    role: str

    model_config = {
        "from_attributes": True
    }