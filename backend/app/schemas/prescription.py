from datetime import datetime

from pydantic import BaseModel
from pydantic import ConfigDict

class PrescriptionResponse(BaseModel):

    model_config= ConfigDict(
        from_attributes=True
    )

    id:int
    patient_id:int
    report_id: int
    medicine_name:str
    dosage: str | None
    frequency: str | None
    duration: str | None
    raw_text: str | None
    created_at: datetime
