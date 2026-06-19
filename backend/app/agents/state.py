from typing import TypedDict

class WorkflowState(TypedDict):

    report_id:int

    extracted_text:str

    summary:str

    medicines:str

    interactions:str
    
    rag_content:str