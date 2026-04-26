from app.models.submission import Submission


def create_submission_service(payload, verdict: str = "Pending") -> Submission:
    submission = Submission(
        user_id=payload.user_id,
        problem_id=payload.problem_id,
        contest_id=payload.contest_id,
        language=payload.language,
        source_code=payload.source_code,
        verdict=verdict,
    )
    return submission


def update_submission_verdict_service(submission: Submission, verdict: str) -> Submission:
    submission.verdict = verdict
    return submission


def format_submission_response(submission: Submission) -> dict:
    return {
        "id": submission.id,
        "user_id": submission.user_id,
        "problem_id": submission.problem_id,
        "contest_id": submission.contest_id,
        "language": submission.language,
        "source_code": submission.source_code,
        "verdict": submission.verdict,
    }
