# pyrefly: ignore [missing-import]
from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.prescription import Prescription

from app.agents.interaction_agent import (
    InteractionAgent
)

# pyrefly: ignore [missing-import]
from app.repositories.interaction_repository import (
    InteractionRepository
)
from app.core.dependencies import doctor_required

router = APIRouter(
    prefix="/interactions",
    tags=["Interactions"]
)


@router.post(
    "/patient/{patient_id}"
)
def analyze_interactions(
    patient_id: int,
    db: Session = Depends(get_db),
    _user=Depends(doctor_required)
):

    prescriptions = (
        db.query(Prescription)
        .filter(
            Prescription.patient_id
            == patient_id
        )
        .all()
    )

    if not prescriptions:
        raise HTTPException(
            status_code=404,
            detail="No medicines found"
        )

    medicines = [
        p.medicine_name
        for p in prescriptions
    ]

    interactions = (
        InteractionAgent.analyze(
            medicines
        )
    )

    created = []

    for interaction in interactions:

        created.append(
            InteractionRepository.create(
                db=db,
                patient_id=patient_id,
                drug_1=interaction["drug_1"],
                drug_2=interaction["drug_2"],
                severity=interaction["severity"],
                warning=interaction["warning"],
                mechanism=interaction["mechanism"],
                recommendation=interaction["recommendation"]
            )
        )

    return {
    "patient_id": patient_id,
    "interactions_found": len(created),
    "interactions": [
        {
            "id": interaction.id,
            "drug_1": interaction.drug_1,
            "drug_2": interaction.drug_2,
            "severity": interaction.severity,
            "mechanism": interaction.mechanism,
            "warning": interaction.warning,
            "recommendation": interaction.recommendation
        }
        for interaction in created
    ]
}