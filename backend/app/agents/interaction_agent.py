import json 
from fastapi import HTTPException

# pyrefly: ignore [missing-import]
from app.prompts.interaction import (
    INTERACTION_PROMPT
)
from app.prompts.safety import safe_prompt
from app.agents.utils import call_llm_with_retry, run_sync

class InteractionAgent:

    @staticmethod
    def analyze(
        medicines: list[str]
    ):

        prompt = INTERACTION_PROMPT.format(
            medicines=safe_prompt(",".join(medicines))
        )

        res = run_sync(call_llm_with_retry(prompt))
        if isinstance(res, dict) and "error" in res:
            raise HTTPException(status_code=503, detail=res)

        res = (
            res
            .replace("```json", "")
            .replace("```","")
            .strip()
        )

        return json.loads(res)