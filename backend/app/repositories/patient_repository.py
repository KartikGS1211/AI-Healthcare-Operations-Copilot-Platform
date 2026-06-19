from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.schemas.patient import PatientCreate


class PatientRepository:

    @staticmethod
    def create_patient(
        db: Session,
        patient_data: PatientCreate
    ) -> Patient:

        patient = Patient(
            full_name=patient_data.full_name,
            age=patient_data.age,
            gender=patient_data.gender,
            phone=patient_data.phone
        )

        db.add(patient)
        db.commit()
        db.refresh(patient)

        return patient

    @staticmethod
    def get_all_patients(
        db: Session
    ):

        return db.query(Patient).all()

    @staticmethod
    def get_patient_by_id(
        db: Session,
        patient_id: int
    ):

        return (
            db.query(Patient)
            .filter(Patient.id == patient_id)
            .first()
        )