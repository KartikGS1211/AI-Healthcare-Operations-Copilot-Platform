from datetime import datetime, timedelta
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


@router.get(
    "/weekly-trends"
)
def get_weekly_trends(
    db: Session = Depends(get_db)
):
    trends = []
    now = datetime.utcnow()
    for i in range(6, -1, -1):
        day = now - timedelta(days=i)
        start_of_day = datetime(day.year, day.month, day.day, 0, 0, 0)
        end_of_day = datetime(day.year, day.month, day.day, 23, 59, 59)

        reports_count = db.query(Report).filter(
            Report.uploaded_at >= start_of_day,
            Report.uploaded_at <= end_of_day
        ).count()

        prescriptions_count = db.query(Prescription).filter(
            Prescription.created_at >= start_of_day,
            Prescription.created_at <= end_of_day
        ).count()

        interactions_count = db.query(Interaction).filter(
            Interaction.created_at >= start_of_day,
            Interaction.created_at <= end_of_day
        ).count()

        day_name = day.strftime("%a")
        trends.append({
            "name": day_name,
            "reports": reports_count,
            "prescriptions": prescriptions_count,
            "interactions": interactions_count,
            "uploaded": reports_count,
            "analyzed": reports_count
        })
    return trends


@router.get(
    "/monthly-trends"
)
def get_monthly_trends(
    db: Session = Depends(get_db)
):
    monthly_trends = []
    now = datetime.utcnow()
    for i in range(5, -1, -1):
        month_val = now.month - i
        year_val = now.year
        while month_val <= 0:
            month_val += 12
            year_val -= 1

        start_of_month = datetime(year_val, month_val, 1, 0, 0, 0)
        next_month = month_val + 1
        next_year = year_val
        if next_month > 12:
            next_month = 1
            next_year += 1
        end_of_month = datetime(next_year, next_month, 1, 0, 0, 0) - timedelta(seconds=1)

        prescriptions_count = db.query(Prescription).filter(
            Prescription.created_at >= start_of_month,
            Prescription.created_at <= end_of_month
        ).count()

        month_name = start_of_month.strftime("%b")
        monthly_trends.append({
            "name": month_name,
            "value": prescriptions_count
        })
    return monthly_trends


@router.get(
    "/report-distribution"
)
def get_report_distribution(
    db: Session = Depends(get_db)
):
    report_types = ["lab", "radiology", "prescription", "discharge"]
    distribution = []
    for r_type in report_types:
        count = db.query(Report).filter(Report.report_type == r_type).count()
        distribution.append({
            "name": r_type.capitalize(),
            "value": count
        })
    other_count = db.query(Report).filter(Report.report_type.notin_(report_types)).count()
    if other_count > 0:
        distribution.append({
            "name": "Other",
            "value": other_count
        })
    return distribution

