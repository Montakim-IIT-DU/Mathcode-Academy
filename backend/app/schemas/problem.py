from typing import Optional

from pydantic import BaseModel, Field


class ProblemBase(BaseModel):
    title: str
    code: str
    statement: str
    difficulty: str = "Easy"
    topic: str = "General"
    time_limit: int = 1
    memory_limit: int = 256
    tags: Optional[str] = None


class ProblemCreate(ProblemBase):
    pass


class ProblemUpdate(ProblemBase):
    pass


class ProblemResponse(ProblemBase):
    id: int
    tags: list[str] = Field(default_factory=list)

    model_config = {
        "from_attributes": True
    }
