# pyrefly: ignore [missing-import]
from fastapi import (
    APIRouter,
    Depends
)

# pyrefly: ignore [missing-import]
from sqlalchemy import func
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.patient import Patient
from app.models.report import Report
from app.models.prescription import Prescription
from app.models.interaction import Interaction

# pyrefly: ignore [missing-import]
from app.schemas.analytics import (
    DashboardOverview
)
from app.core.dependencies import doctor_required

router=APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get(
    "/overview",
    response_model=DashboardOverview
)
def get_dashboard_overview(
    db:Session = Depends(get_db),
    _user=Depends(doctor_required)
):

    total_patients = (
        db.query(Patient)
        .count()
    )

    total_reports = (
        db.query(Report)
        .count()
    )

    total_prescriptions = (
        db.query(Prescription)
        .count()
    )

    total_interactions = (
        db.query(Interaction)
        .count()
    )

    return DashboardOverview(
        total_patients=total_patients,
        total_reports=total_reports,
        total_prescriptions=total_prescriptions,
        total_interactions=total_interactions
    )

@router.get(
    "/top-medicines"
)
def get_top_medicines(
    db: Session= Depends(get_db)
):

    medicines=(
        db.query(
            Prescription.medicine_name,
            func.count(
                Prescription.id
            ).label(
                "count"
            )
        )
        .group_by(
            Prescription.medicine_name
        )
        .order_by(
            func.count(
                Prescription.id
            ).desc()
        )
        .limit(10)
        .all()
    )

    return [
        {"medicine_name": name, "count": count}
        for name, count in medicines
    ]

@router.get(
    "/recent-reports"
)
def recent_reports(
    db:Session=Depends(get_db)
):

    reports=(
        db.query(Report)
        .order_by(
            Report.uploaded_at.desc()
        )
        .limit(10)
        .all()
    )

    return reports
