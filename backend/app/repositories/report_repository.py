# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.models.report import Report


class ReportRepository:

    @staticmethod
    def create_report(
        db: Session,
        patient_id: int,
        file_name: str,
        file_path: str,
        report_type: str,
        extracted_text: str | None = None,
        uploaded_by: str | None = None,
    ):
        report = Report(
            patient_id=patient_id,
            file_name=file_name,
            file_path=file_path,
            report_type=report_type,
            extracted_text=extracted_text,
            uploaded_by=uploaded_by,
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def get_all_reports(db: Session):
        return db.query(Report).all()

    @staticmethod
    def get_by_id(db: Session, report_id: int):
        return db.query(Report).filter(Report.id == report_id).first()

    @staticmethod
    def get_reports_by_doctor(db: Session, doctor_email: str):
        return (
            db.query(Report)
            .filter(Report.uploaded_by == doctor_email)
            .order_by(Report.uploaded_at.desc())
            .all()
        )

    @staticmethod
    def get_reports_by_patient(db: Session, patient_id: int):
        return (
            db.query(Report)
            .filter(Report.patient_id == patient_id)
            .all()
        )

    @staticmethod
    def update_extracted_text(db: Session, report_id: int, extracted_text: str):
        report = db.query(Report).filter(Report.id == report_id).first()
        if report:
            report.extracted_text = extracted_text
            db.commit()
            db.refresh(report)
        return report

    @staticmethod
    def update_summary(db, report_id: int, summary: str):
        report = db.query(Report).filter(Report.id == report_id).first()
        if not report:
            return None
        report.summary = summary
        db.commit()
        db.refresh(report)
        return report
