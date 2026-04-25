from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.problem import Problem
from app.schemas.problem import ProblemCreate, ProblemResponse, ProblemUpdate
from app.services.problem_service import (
    create_problem_service,
    format_problem_response,
    update_problem_service,
)

router = APIRouter()


@router.get("/", response_model=list[ProblemResponse])
def get_all_problems(db: Session = Depends(get_db)):
    problems = db.query(Problem).all()
    return [format_problem_response(problem) for problem in problems]


@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem_by_id(problem_id: int, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    return format_problem_response(problem)


@router.post("/", response_model=ProblemResponse, status_code=status.HTTP_201_CREATED)
def create_problem(payload: ProblemCreate, db: Session = Depends(get_db)):
    existing_problem = db.query(Problem).filter(
        (Problem.code == payload.code) | (Problem.title == payload.title)
    ).first()

    if existing_problem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Problem with this title or code already exists",
        )

    problem = create_problem_service(payload)
    db.add(problem)
    db.commit()
    db.refresh(problem)

    return format_problem_response(problem)


@router.put("/{problem_id}", response_model=ProblemResponse)
def update_problem(problem_id: int, payload: ProblemUpdate, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    problem = update_problem_service(problem, payload)
    db.commit()
    db.refresh(problem)

    return format_problem_response(problem)


@router.delete("/{problem_id}")
def delete_problem(problem_id: int, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    db.delete(problem)
    db.commit()

    return {"message": "Problem deleted successfully"}