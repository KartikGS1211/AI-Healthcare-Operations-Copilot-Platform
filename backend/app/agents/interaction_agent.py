import json 

# pyrefly: ignore [missing-import]
from app.prompts.interaction import (
    INTERACTION_PROMPT
    )

from app.services.groq_service import (
    GroqService
)

class InteractionAgent:

    @staticmethod
    def analyze(
        medicines: list[str]
    ):

        prompt = INTERACTION_PROMPT.format(
            medicines= ",".join(medicines)
        )

        response=(
            GroqService.generate_response(
                prompt
            )
        )

        response=(
            response
            .replace("```json", "")
            .replace("```","")
            .strip()
        )

        return json.loads(response)