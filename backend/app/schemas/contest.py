from pydantic import BaseModel, Field

from app.schemas.problem import ProblemResponse


class ContestBase(BaseModel):
    title: str
    description: str | None = None
    contest_type: str = "Online"
    venue: str | None = None
    start_time: str
    end_time: str
    status: str = "Upcoming"


class ContestCreate(ContestBase):
    problem_ids: list[int] = Field(default_factory=list)


class ContestUpdate(ContestBase):
    problem_ids: list[int] = Field(default_factory=list)


class ContestJoinRequest(BaseModel):
    user_id: int | None = None


class ContestResponse(ContestBase):
    id: int
    problems: list[ProblemResponse] = Field(default_factory=list)
    participant_count: int = 0

    model_config = {
        "from_attributes": True
    }
