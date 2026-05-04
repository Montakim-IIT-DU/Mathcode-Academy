from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.problem import Problem
from app.models.testcase import Testcase
from app.schemas.testcase import TestcaseCreate, TestcaseResponse, TestcaseUpdate

router = APIRouter()


@router.get("/", response_model=list[TestcaseResponse])
def get_all_testcases(db: Session = Depends(get_db)):
    testcases = db.query(Testcase).all()
    return testcases


@router.get("/problem/{problem_id}", response_model=list[TestcaseResponse])
def get_testcases_for_problem(problem_id: int, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )
    
    testcases = db.query(Testcase).filter(Testcase.problem_id == problem_id).all()
    return testcases


@router.get("/problem/{problem_id}/samples", response_model=list[TestcaseResponse])
def get_sample_testcases_for_problem(problem_id: int, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    testcases = db.query(Testcase).filter(
        (Testcase.problem_id == problem_id) & Testcase.is_sample.is_(True)
    ).all()
    return testcases


@router.get("/{testcase_id}", response_model=TestcaseResponse)
def get_testcase_by_id(testcase_id: int, db: Session = Depends(get_db)):
    testcase = db.query(Testcase).filter(Testcase.id == testcase_id).first()

    if not testcase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testcase not found",
        )

    return testcase


@router.post("/", response_model=TestcaseResponse, status_code=status.HTTP_201_CREATED)
def create_testcase(payload: TestcaseCreate, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == payload.problem_id).first()
    
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )
    
    testcase = Testcase(
        problem_id=payload.problem_id,
        input_data=payload.input_data,
        expected_output=payload.expected_output,
        is_sample=payload.is_sample,
    )

    db.add(testcase)
    db.commit()
    db.refresh(testcase)

    return testcase


@router.put("/{testcase_id}", response_model=TestcaseResponse)
def update_testcase(
    testcase_id: int,
    payload: TestcaseUpdate,
    db: Session = Depends(get_db),
):
    testcase = db.query(Testcase).filter(Testcase.id == testcase_id).first()

    if not testcase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testcase not found",
        )

    testcase.input_data = payload.input_data
    testcase.expected_output = payload.expected_output
    testcase.is_sample = payload.is_sample

    db.commit()
    db.refresh(testcase)

    return testcase


@router.delete("/{testcase_id}")
def delete_testcase(testcase_id: int, db: Session = Depends(get_db)):
    testcase = db.query(Testcase).filter(Testcase.id == testcase_id).first()

    if not testcase:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testcase not found",
        )

    db.delete(testcase)
    db.commit()

    return {"message": "Testcase deleted successfully"}
