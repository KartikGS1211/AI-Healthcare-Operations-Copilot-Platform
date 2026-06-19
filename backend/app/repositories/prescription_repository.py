# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.models.prescription import Prescription


class PrescriptionRepository:

    @staticmethod
    def create(
        db: Session,
        patient_id: int,
        report_id: int,
        medicine_name: str,
        dosage: str | None,
        frequency: str | None,
        duration: str | None,
        raw_text: str | None
    ):

        prescription = Prescription(
            patient_id=patient_id,
            report_id=report_id,
            medicine_name=medicine_name,
            dosage=dosage,
            frequency=frequency,
            duration=duration,
            raw_text=raw_text
        )

        db.add(prescription)

        db.commit()

        db.refresh(prescription)

        return prescription

    @staticmethod
    def get_by_patient(
        db: Session,
        patient_id: int
    ):

        return (
            db.query(Prescription)
            .filter(
                Prescription.patient_id
                == patient_id
            )
            .all()
        )