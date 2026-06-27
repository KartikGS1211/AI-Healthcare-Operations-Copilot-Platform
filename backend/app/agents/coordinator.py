import json
import asyncio
from app.agents.summary_agent import SummaryAgent
from app.agents.prescription_agent import PrescriptionAgent
from app.agents.interaction_agent import InteractionAgent
from app.rag.pipeline import RAGPipeline

class CoordinatorAgent:

    @staticmethod
    def process_report(
        report
    ):
        extracted_text = report.extracted_text

        summary = SummaryAgent.generate_summary(extracted_text)
        medicines = PrescriptionAgent.extract_medicines(extracted_text)

        medicine_names = [
            m.get("medicine_name", "")
            for m in medicines
            if isinstance(m, dict) and m.get("medicine_name")
        ]

        interactions = InteractionAgent.analyze(medicine_names)
        rag_context = RAGPipeline.retrieve_context(",".join(medicine_names))

        return {
            "summary": summary,
            "medicines": medicines,
            "interactions": interactions,
            "rag_context": rag_context
        }

    @staticmethod
    async def process_report_stream(report, db):
        # 1. OCR Step
        yield f"data: {json.dumps({'step': 'ocr', 'status': 'running'})}\n\n"
        await asyncio.sleep(0.5)
        extracted_text = report.extracted_text
        yield f"data: {json.dumps({'step': 'ocr', 'status': 'done'})}\n\n"

        # 2. Summary Step
        yield f"data: {json.dumps({'step': 'summary', 'status': 'running'})}\n\n"
        try:
            summary = await asyncio.to_thread(SummaryAgent.generate_summary, extracted_text)
        except Exception as e:
            summary = {"error": "AI analysis unavailable", "reason": str(e)}
        yield f"data: {json.dumps({'step': 'summary', 'status': 'done'})}\n\n"

        # 3. Prescription Step
        yield f"data: {json.dumps({'step': 'prescription', 'status': 'running'})}\n\n"
        try:
            medicines = await asyncio.to_thread(PrescriptionAgent.extract_medicines, extracted_text)
        except Exception as e:
            medicines = {"error": "AI analysis unavailable", "reason": str(e)}
        yield f"data: {json.dumps({'step': 'prescription', 'status': 'done'})}\n\n"

        # 4. Interaction Step
        yield f"data: {json.dumps({'step': 'interaction', 'status': 'running'})}\n\n"
        try:
            if isinstance(medicines, list):
                medicine_names = [
                    m.get("medicine_name", "")
                    for m in medicines
                    if isinstance(m, dict) and m.get("medicine_name")
                ]
            else:
                medicine_names = []

            if medicine_names:
                interactions = await asyncio.to_thread(InteractionAgent.analyze, medicine_names)
                rag_context = await asyncio.to_thread(RAGPipeline.retrieve_context, ",".join(medicine_names))
            else:
                interactions = []
                rag_context = ""
        except Exception as e:
            interactions = {"error": "AI analysis unavailable", "reason": str(e)}
            rag_context = ""
        yield f"data: {json.dumps({'step': 'interaction', 'status': 'done'})}\n\n"

        # 5. Final Result
        result_payload = {
            "summary": summary,
            "medicines": medicines,
            "interactions": interactions,
            "rag_context": rag_context
        }
        yield f"data: {json.dumps({'result': result_payload})}\n\n"
