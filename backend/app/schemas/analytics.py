from pydantic import BaseModel

class DashboardOverview(BaseModel):

    total_patients:int

    total_reports: int 

    total_prescriptions: int

    total_interactions: int 