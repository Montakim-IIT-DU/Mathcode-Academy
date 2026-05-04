from pydantic import BaseModel


class SubmissionBase(BaseModel):
    user_id: int
    problem_id: int
    contest_id: int | None = None
    language: str
    source_code: str


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionResponse(SubmissionBase):
    id: int
    verdict: str
    created_at: str | None = None

    model_config = {
        "from_attributes": True
    }
