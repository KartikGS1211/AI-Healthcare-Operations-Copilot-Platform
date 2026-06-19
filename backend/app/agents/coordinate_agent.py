from app.rag.pipeline import RAGPipeline
from app.agents.interaction_agent import InteractionAgent
from app.agents.prescription_agent import PrescriptionAgent
from app.agents.summary_agent import SummaryAgent

class CoordinatorAgent:


    @staticmethod
    def process_report(
        report
    ):

        extracted_text=(
            report.extracted_text
        )

        summary=(
            SummaryAgent.generate_summary(
                extracted_text
            )
        )

        medicines = (
            PrescriptionAgent.extract_medicines(
                extracted_text
            )
        )

        medicine_names = [
            m.get("medicine_name", "")
            for m in medicines
            if m.get("medicine_name")
        ]

        interactions = (
            InteractionAgent.analyze(
                medicine_names
            )
        )

        rag_context = (
            RAGPipeline.retrieve_context(
                ",".join(medicine_names)
            )
        )

        return{
            "summary":summary,
            "medicines":medicines,
            "interactions":interactions,
            "rag_context":rag_context
        }
