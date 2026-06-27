from fastapi import HTTPException
from app.prompts.summary import SUMMARY_PROMPT
from app.prompts.safety import safe_prompt
from app.agents.utils import call_llm_with_retry, run_sync

class SummaryAgent:

    @staticmethod
    def generate_summary(
        report_text: str
    ) -> str:

        prompt = SUMMARY_PROMPT.format(
            report_text=safe_prompt(report_text)
        )

        res = run_sync(call_llm_with_retry(prompt))
        if isinstance(res, dict) and "error" in res:
            raise HTTPException(status_code=503, detail=res)

        return res