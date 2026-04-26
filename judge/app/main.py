from fastapi import FastAPI
from pydantic import BaseModel, Field

from app.services.execute_service import judge_submission

app = FastAPI(
    title="Mathcode Academy Judge Service",
    version="1.0.0"
)


class JudgeTestcase(BaseModel):
    input_data: str
    expected_output: str


class JudgeRequest(BaseModel):
    language: str
    source_code: str
    testcases: list[JudgeTestcase] = Field(default_factory=list)
    time_limit: int = 2


@app.get("/")
def root():
    return {"message": "Judge service is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/judge")
def judge_code(payload: JudgeRequest):
    return judge_submission(
        language=payload.language,
        source_code=payload.source_code,
        testcases=payload.testcases,
        time_limit=payload.time_limit,
    )
