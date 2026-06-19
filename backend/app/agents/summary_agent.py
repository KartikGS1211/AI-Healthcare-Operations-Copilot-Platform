from app.prompts.summary import SUMMARY_PROMPT
from app.services.groq_service import GroqService

class SummaryAgent:

    @staticmethod
    def generate_summary(
        report_text: str
    ) -> str:

        prompt = SUMMARY_PROMPT.format(
            report_text=report_text
        )

        return (GroqService.generate_summary(
            prompt
        )
        )