# pyrefly: ignore [missing-import]
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile
)
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

import os 

# pyrefly: ignore [missing-import]
from app.services.ocr_service import OCRServices

from app.database.session import get_db
from app.models.patient import Patient
from app.repositories.report_repository import ReportRepository
from app.schemas.report import ReportResponse
from app.services.file_service import save_report_file
from app.agents.summary_agent import SummaryAgent
from app.models.report import Report

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.post(
    "/upload",
    response_model=ReportResponse
)
def upload_report(
    patient_id: int = Form(...),
    report_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id
        )
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    file_name, file_path = save_report_file(
        file
    )

    # ocr extraction
    extension = os.path.splitext(file.filename)[1].lower()
    extracted_text = ""

    if extension == ".pdf":
        extracted_text = OCRServices.extract_pdf_text(file_path)
    elif extension in [".png", ".jpg", ".jpeg"]:
        extracted_text = OCRServices.extract_image_text(file_path)

    report = (
        ReportRepository.create_report(
            db=db,
            patient_id=patient_id,
            file_name=file_name,
            file_path=file_path,
            report_type=report_type,
            extracted_text=extracted_text
        )
    )

    return report


@router.get(
    "/",
    response_model=list[ReportResponse]
)
def get_reports(
    db: Session = Depends(get_db)
):

    return (
        ReportRepository.get_all_reports(
            db
        )
    )


@router.get(
    "/patient/{patient_id}",
    response_model=list[ReportResponse]
)
def get_patient_reports(
    patient_id: int,
    db: Session = Depends(get_db)
):

    return (
        ReportRepository.get_reports_by_patient(
            db,
            patient_id
        )
    )

@router.post(
    "/{report_id}/summarize"
)
def summarize_report(
    report_id:int,
    db: Session=Depends(get_db)
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

    if not report.extracted_text:
        raise HTTPException(
            status_code=400,
            detail="OCR text not found"
        )

    summary = (
        SummaryAgent.generate_summary(
            report.extracted_text
        )
    )

    ReportRepository.update_summary(
        db=db,
        report_id=report.id,
        summary=summary
    )

    return {
        "report_id": report.id,
        "summary": summary
    }