# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from sqlalchemy import func
from datetime import datetime

from app.database.session import get_db
from app.repositories.patient_repository import PatientRepository
from app.schemas.patient import (
    PatientCreate,
    PatientResponse
)
from app.core.dependencies import doctor_required, get_current_user
from app.models.patient import Patient
from app.models.user import User
from app.models.report import Report
from app.models.prescription import Prescription
from app.models.interaction import Interaction
from app.repositories.user_repository import UserRepository


router = APIRouter(
    prefix="/patients",
    tags=["Patients"]
)

def format_relative_time(dt: datetime) -> str:
    now = datetime.utcnow()
    diff = now - dt
    if diff.days > 0:
        return dt.strftime("%b %d, %Y")
    elif diff.seconds >= 3600:
        hours = diff.seconds // 3600
        return f"{hours} hr ago" if hours == 1 else f"{hours} hrs ago"
    elif diff.seconds >= 60:
        minutes = diff.seconds // 60
        return f"{minutes} min ago" if minutes == 1 else f"{minutes} mins ago"
    else:
        return "Just now"

@router.get(
    "/me",
    response_model=PatientResponse
)
def get_current_patient(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    user_obj = UserRepository.get_by_email(db, email=current_user["sub"])
    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")
        
    patient = db.query(Patient).filter(func.lower(Patient.full_name) == func.lower(user_obj.full_name)).first()
    if not patient:
        patient = db.query(Patient).filter(Patient.full_name.ilike(f"%{user_obj.full_name}%")).first()
        
    if not patient:
        patient = Patient(
            full_name=user_obj.full_name,
            age=30,
            gender="unknown",
            phone="N/A"
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
        
    return patient

@router.get(
    "/me/dashboard"
)
def get_patient_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    user_obj = UserRepository.get_by_email(db, email=current_user["sub"])
    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")
        
    patient = db.query(Patient).filter(func.lower(Patient.full_name) == func.lower(user_obj.full_name)).first()
    if not patient:
        patient = db.query(Patient).filter(Patient.full_name.ilike(f"%{user_obj.full_name}%")).first()
        
    if not patient:
        patient = Patient(
            full_name=user_obj.full_name,
            age=30,
            gender="unknown",
            phone="N/A"
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

    reports = db.query(Report).filter(Report.patient_id == patient.id).order_by(Report.uploaded_at.desc()).all()
    prescriptions = db.query(Prescription).filter(Prescription.patient_id == patient.id).order_by(Prescription.created_at.desc()).all()
    interactions = db.query(Interaction).filter(Interaction.patient_id == patient.id).order_by(Interaction.created_at.desc()).all()

    reports_count = len(reports)
    medicines_count = len(prescriptions)
    findings_count = sum(1 for r in reports if r.summary)
    insights_count = len(interactions)

    kpis = [
        { "title": "Reports Uploaded", "value": reports_count, "change": f"+{reports_count} total" if reports_count > 0 else "No reports", "trend": "up" if reports_count > 0 else "neutral", "icon": "report" },
        { "title": "Active Medicines", "value": medicines_count, "change": "Stable from last month" if medicines_count > 0 else "No active medicines", "trend": "neutral", "icon": "prescription" },
        { "title": "AI Findings", "value": findings_count, "change": f"+{findings_count} new" if findings_count > 0 else "No findings yet", "trend": "up" if findings_count > 0 else "neutral", "icon": "summary" },
        { "title": "Health Insights", "value": insights_count, "change": "Updated" if insights_count > 0 else "No insights", "trend": "neutral", "icon": "patients" }
    ]

    recent_updates = []
    
    for r in reports:
        recent_updates.append({
            "id": f"r-{r.id}",
            "type": "report",
            "title": "Report uploaded",
            "description": f"{r.file_name} — {r.report_type.capitalize()} department",
            "timestamp": format_relative_time(r.uploaded_at),
            "dt": r.uploaded_at
        })
        if r.summary:
            recent_updates.append({
                "id": f"s-{r.id}",
                "type": "summary",
                "title": "Medical summary generated",
                "description": f"{r.file_name} summary generated",
                "timestamp": format_relative_time(r.uploaded_at),
                "dt": r.uploaded_at
            })
            
    for p in prescriptions:
        recent_updates.append({
            "id": f"p-{p.id}",
            "type": "prescription",
            "title": "Prescription analyzed",
            "description": f"{p.medicine_name} — {p.dosage} ({p.frequency})",
            "timestamp": format_relative_time(p.created_at),
            "dt": p.created_at
        })

    for i in interactions:
        recent_updates.append({
            "id": f"i-{i.id}",
            "type": "alert",
            "title": "Drug interaction alert",
            "description": f"{i.drug_1} + {i.drug_2} — {i.severity.capitalize()} risk detected",
            "timestamp": format_relative_time(i.created_at),
            "dt": i.created_at
        })

    recent_updates.sort(key=lambda x: x["dt"], reverse=True)
    
    # Strip the dt helper key out of the final list
    final_updates = []
    for item in recent_updates[:10]: # keep top 10 recent
        final_updates.append({
            "id": item["id"],
            "type": item["type"],
            "title": item["title"],
            "description": item["description"],
            "timestamp": item["timestamp"]
        })

    health_alerts = []
    for item in interactions:
        health_alerts.append({
            "id": f"alert-{item.id}",
            "medicines": [item.drug_1, item.drug_2],
            "summary": item.warning or item.mechanism,
            "riskLevel": item.severity.lower(),
            "recommendedAction": item.recommendation
        })

    return {
        "patient_id": patient.id,
        "kpis": kpis,
        "recent_updates": final_updates,
        "health_alerts": health_alerts
    }



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