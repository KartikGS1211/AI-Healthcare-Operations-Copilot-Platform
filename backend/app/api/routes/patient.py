# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories.patient_repository import PatientRepository
from app.schemas.patient import (
    PatientCreate,
    PatientResponse
)
from app.core.dependencies import doctor_required

router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)


@router.post(
    "/",
    response_model=PatientResponse,
    status_code=201
)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):

    return PatientRepository.create_patient(
        db,
        patient
    )


@router.get(
    "/",
    response_model=list[PatientResponse]
)
def get_all_patients(
    db: Session = Depends(get_db),
    _user=Depends(doctor_required)
):

    return PatientRepository.get_all_patients(db)


@router.get(
    "/{patient_id}",
    response_model=PatientResponse
)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):

    patient = PatientRepository.get_patient_by_id(
        db,
        patient_id
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient