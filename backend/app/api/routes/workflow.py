# pyrefly: ignore [missing-import]
from fastapi import (APIRouter,Depends,HTTPException)
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.agents.workflow import HealthcareWorkflow

router=APIRouter(
    prefix="/workflow",
    tags=["Workflow"]
)

@router.post(
    "/analyze/{report_id}"
)
def analyze_report(
    report_id:int,
    db : Session=Depends(get_db)
):

    result=(
        HealthcareWorkflow.run(
            report_id=report_id,
            db=db
        )
    )

    if not result:
        raise HTTPException(
            statuscode=404,
            detail="Report not found"
        )

    return result