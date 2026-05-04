from datetime import datetime

from app.core.constants import VERDICT_ACCEPTED
from app.models.contest import Contest
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User


def build_user_performance(db, user: User) -> dict:
    submissions = (
        db.query(Submission)
        .filter(
            (Submission.user_id == user.id)
            & (Submission.verdict == VERDICT_ACCEPTED)
        )
        .order_by(Submission.id.asc())
        .all()
    )

    problem_map = _problem_map(db, submissions)
    contest_map = _contest_map(db, submissions)

    graph = []
    date_totals = {}
    practice_solved = 0
    contest_solved = 0
    onsite_solved = 0

    for submission in submissions:
        contest = contest_map.get(submission.contest_id)
        source = _solve_source(contest, submission.contest_id)

        if source == "Practice Problem":
            practice_solved += 1
        else:
            contest_solved += 1
            if source == "Onsite Contest":
                onsite_solved += 1

        solve_date = _submission_date(submission)
        date_totals[solve_date] = date_totals.get(solve_date, 0) + 1
        problem = problem_map.get(submission.problem_id)

        graph.append(
            {
                "submission_id": submission.id,
                "problem_id": submission.problem_id,
                "problem_title": problem.title if problem else f"Problem #{submission.problem_id}",
                "contest_id": submission.contest_id,
                "contest_title": contest.title if contest else None,
                "source": source,
                "solve_date": solve_date,
                "solved_count": len(graph) + 1,
            }
        )

    date_summary = []
    cumulative_solved = 0
    for solve_date in sorted(date_totals):
        solved_on_date = date_totals[solve_date]
        cumulative_solved += solved_on_date
        date_summary.append(
            {
                "date": solve_date,
                "solved": solved_on_date,
                "cumulative_solved": cumulative_solved,
            }
        )

    return {
        "user_id": user.id,
        "username": user.username,
        "total_solved": len(submissions),
        "practice_solved": practice_solved,
        "contest_solved": contest_solved,
        "onsite_solved": onsite_solved,
        "accepted_submissions": len(submissions),
        "graph": graph,
        "date_summary": date_summary,
    }


def _solve_source(contest: Contest | None, contest_id: int | None) -> str:
    if not contest_id:
        return "Practice Problem"

    if contest and contest.contest_type == "Onsite":
        return "Onsite Contest"

    return "Contest"


def _submission_date(submission: Submission) -> str:
    if submission.created_at:
        try:
            return datetime.fromisoformat(submission.created_at).date().isoformat()
        except ValueError:
            return submission.created_at[:10]

    return datetime.now().date().isoformat()


def _problem_map(db, submissions: list[Submission]) -> dict[int, Problem]:
    problem_ids = {submission.problem_id for submission in submissions}
    if not problem_ids:
        return {}

    problems = db.query(Problem).filter(Problem.id.in_(problem_ids)).all()
    return {problem.id: problem for problem in problems}


def _contest_map(db, submissions: list[Submission]) -> dict[int, Contest]:
    contest_ids = {
        submission.contest_id
        for submission in submissions
        if submission.contest_id
    }
    if not contest_ids:
        return {}

    contests = db.query(Contest).filter(Contest.id.in_(contest_ids)).all()
    return {contest.id: contest for contest in contests}
