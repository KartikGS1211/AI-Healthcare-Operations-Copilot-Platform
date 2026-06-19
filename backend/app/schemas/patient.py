from codecs import getencoder
from datetime import datetime

from pydantic import BaseModel, ConfigDict

class PatientCreate(BaseModel):
    full_name:str
    age:int
    gender:str 
    phone:str


class PatientResponse(BaseModel):
    model_config= ConfigDict(
        from_attributes=True
    )

    id:int
    full_name:str
    age:int
    gender:str
    phone:str
    created_at:datetime