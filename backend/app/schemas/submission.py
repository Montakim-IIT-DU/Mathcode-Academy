from pydantic import BaseModel


class SubmissionBase(BaseModel):
    user_id: int
    problem_id: int
    language: str
    source_code: str


class SubmissionCreate(SubmissionBase):
    pass


class SubmissionResponse(SubmissionBase):
    id: int
    verdict: str

    model_config = {
        "from_attributes": True
    }