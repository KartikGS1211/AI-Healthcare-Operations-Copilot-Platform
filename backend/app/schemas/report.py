from datetime import datetime

from pydantic import BaseModel , ConfigDict

class ReportResponse(BaseModel):
    model_config= ConfigDict(
        from_attributes=True
    )

    id:int
    patient_id:int
    file_name:str
    file_path:str
    report_type:str

    extracted_text:str | None
    summary:str | None
    
    uploaded_at:datetime