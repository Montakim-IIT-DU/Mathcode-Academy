from fastapi import FastAPI
from pydantic import BaseModel

from app.services.verdict_service import get_verdict_for_code

app = FastAPI(
    title="Mathcode Academy Judge Service",
    version="1.0.0"
)


class JudgeRequest(BaseModel):
    language: str
    source_code: str


@app.get("/")
def root():
    return {"message": "Judge service is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/judge")
def judge_code(payload: JudgeRequest):
    verdict = get_verdict_for_code(payload.language, payload.source_code)
    return {
        "success": True,
        "language": payload.language,
        "verdict": verdict
    }