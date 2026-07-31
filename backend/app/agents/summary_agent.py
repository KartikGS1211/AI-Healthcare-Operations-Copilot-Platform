# pyrefly: ignore [missing-import]
from fastapi import HTTPException
from app.prompts.summary import SUMMARY_PROMPT
from app.prompts.safety import safe_prompt
from app.agents.utils import call_llm_with_retry


class SummaryAgent:

    @staticmethod
    async def generate_summary_async(
        report_text: str
    ) -> str:
        """
        Async-native method — call this from async FastAPI routes.
        Directly awaits the LLM coroutine without any asyncio.run() wrapper.
        """
        prompt = SUMMARY_PROMPT.format(
            report_text=safe_prompt(report_text)
        )

        res = await call_llm_with_retry(prompt)

        if isinstance(res, dict) and "error" in res:
            raise HTTPException(
                status_code=503,
                detail=f"AI analysis unavailable: {res.get('reason', 'Unknown error')}"
            )

        return res

    @staticmethod
    def generate_summary(
        report_text: str
    ) -> str:
        """
        Legacy sync wrapper — kept for backward compatibility.
        Prefer generate_summary_async() in async routes.
        """
        from app.agents.utils import run_sync
        prompt = SUMMARY_PROMPT.format(
            report_text=safe_prompt(report_text)
        )
        res = run_sync(call_llm_with_retry(prompt))
        if isinstance(res, dict) and "error" in res:
            raise HTTPException(status_code=503, detail=res)
        return res