from pydantic import BaseModel


class TestcaseCreate(BaseModel):
    problem_id: int
    input_data: str
    expected_output: str
    is_sample: bool = False


class TestcaseResponse(BaseModel):
    id: int
    problem_id: int
    input_data: str
    expected_output: str
    is_sample: bool

    class Config:
        from_attributes = True
