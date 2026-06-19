import json 

from app.prompts.prescription import (
    PRESCRIPTION_PROMPT
)

from app.services.groq_service import(
    GroqService
)

class PrescriptionAgent:

    @staticmethod
    def extract_medicines(
        prescription_text:str
    ):

        prompt= PRESCRIPTION_PROMPT.format(
            prescription_text=prescription_text
        )

        response=(
            GroqService.generate_summary(
                prompt
            )
        )

        return json.loads(response)