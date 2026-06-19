# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session

from app.models.interaction import Interaction


class InteractionRepository:

    @staticmethod
    def create(
        db: Session,
        patient_id: int,
        drug_1: str,
        drug_2: str,
        severity: str,
        warning: str,
        mechanism: str,
        recommendation:str
    ):

        interaction = Interaction(
            patient_id=patient_id,
            drug_1=drug_1,
            drug_2=drug_2,
            severity=severity,
            warning=warning,
            mechanism=mechanism,
            recommendation=recommendation
        )

        db.add(interaction)

        db.commit()

        db.refresh(interaction)

        return interaction