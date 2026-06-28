# pyrefly: ignore [missing-import]
from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.report import Report

from app.agents.prescription_agent import (
    PrescriptionAgent
)

from app.repositories.prescription_repository import (
    PrescriptionRepository
)
from app.core.dependencies import doctor_required

router = APIRouter(
    prefix="/prescriptions",
    tags=["Prescriptions"]
)


@router.post(
    "/extract/{report_id}"
)
def extract_prescription(
    report_id: int,
    db: Session = Depends(get_db),
    _user=Depends(doctor_required)
):

    report = (
        db.query(Report)
        .filter(
            Report.id == report_id
        )
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    medicines = (
        PrescriptionAgent.extract_medicines(
            report.extracted_text
        )
    )

    created = []

    for medicine in medicines:

        created.append(
            PrescriptionRepository.create(
                db=db,
                patient_id=report.patient_id,
                report_id=report.id,
                medicine_name=medicine.get(
                    "medicine_name"
                ),
                dosage=medicine.get(
                    "dosage"
                ),
                frequency=medicine.get(
                    "frequency"
                ),
                duration=medicine.get(
                    "duration"
                ),
                raw_text=report.extracted_text
            )
        )

    return {
    "report_id": report.id,
    "medicines_found": len(created),
    "medicines": [
        {
            "id": medicine.id,
            "medicine_name": medicine.medicine_name,
            "dosage": medicine.dosage,
            "frequency": medicine.frequency,
            "duration": medicine.duration
        }
        for medicine in created
    ]
}

@router.get(
    "/patient/{patient_id}"
)
def get_patient_prescriptions(
    patient_id: int,
    db: Session = Depends(get_db)
):
    prescriptions = db.query(Prescription).filter(Prescription.patient_id == patient_id).order_by(Prescription.created_at.desc()).all()
    return prescriptions