import json 
from fastapi import HTTPException

from app.prompts.prescription import (
    PRESCRIPTION_PROMPT
)
from app.prompts.safety import safe_prompt
from app.agents.utils import call_llm_with_retry, run_sync

class PrescriptionAgent:

    @staticmethod
    def extract_medicines(
        prescription_text:str
    ):

        prompt= PRESCRIPTION_PROMPT.format(
            prescription_text=safe_prompt(prescription_text)
        )

        res = run_sync(call_llm_with_retry(prompt))
        if isinstance(res, dict) and "error" in res:
            raise HTTPException(status_code=503, detail=res)

        return json.loads(res)