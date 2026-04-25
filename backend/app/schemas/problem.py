from pydantic import BaseModel
from typing import Optional


class ProblemBase(BaseModel):
    title: str
    code: str
    statement: str
    difficulty: str = "Easy"
    time_limit: int = 1
    memory_limit: int = 256
    tags: Optional[str] = None


class ProblemCreate(ProblemBase):
    pass


class ProblemUpdate(ProblemBase):
    pass


class ProblemResponse(ProblemBase):
    id: int

    model_config = {
        "from_attributes": True
    }