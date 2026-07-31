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
from app.core.dependencies import doctor_required

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("/upload", response_model=ReportResponse)
def upload_report(
    patient_id: int = Form(...),
    report_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(doctor_required),
):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    file_name, file_path = save_report_file(file)

    # OCR extraction
    extension = os.path.splitext(file.filename)[1].lower()
    extracted_text = ""
    if extension == ".pdf":
        extracted_text = OCRServices.extract_pdf_text(file_path)
    elif extension in [".png", ".jpg", ".jpeg"]:
        extracted_text = OCRServices.extract_image_text(file_path)

    report = ReportRepository.create_report(
        db=db,
        patient_id=patient_id,
        file_name=file_name,
        file_path=file_path,
        report_type=report_type,
        extracted_text=extracted_text,
        uploaded_by=current_user["sub"],   # doctor's email from JWT
    )
    return report


@router.get("/", response_model=list[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return ReportRepository.get_all_reports(db)


@router.get("/{report_id}", response_model=ReportResponse)
def get_report_by_id(
    report_id: int,
    db: Session = Depends(get_db),
    _user=Depends(doctor_required),
):
    report = ReportRepository.get_by_id(db, report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.get("/patient/{patient_id}", response_model=list[ReportResponse])
def get_patient_reports(patient_id: int, db: Session = Depends(get_db)):
    return ReportRepository.get_reports_by_patient(db, patient_id)


@router.post("/{report_id}/summarize")
async def summarize_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    if not report.extracted_text:
        raise HTTPException(
            status_code=400,
            detail="No text could be extracted from this report. "
                   "Please ensure the PDF contains readable text.",
        )

    summary = await SummaryAgent.generate_summary_async(report.extracted_text)
    ReportRepository.update_summary(db=db, report_id=report.id, summary=summary)

    return {"report_id": report.id, "summary": summary}