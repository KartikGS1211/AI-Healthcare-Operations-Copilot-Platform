from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict
)


class InteractionResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: int

    patient_id: int

    drug_1: str
    drug_2: str
    severity: str
    warning: str
    mechanism: str
    recommendation:str

    created_at: datetime