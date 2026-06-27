# pyrefly: ignore [missing-import]
from fastapi.responses import StreamingResponse
from app.agents.coordinator import CoordinatorAgent
from app.models.report import Report
# pyrefly: ignore [missing-import, parse-error]
from sqlalchemy.orm import Session

class HealthcareWorkflow:

    @staticmethod
    def run(
        report_id:int,
        db: Session
    ):

        report=(
            db.query(Report)
            .filter(
                Report.id == report_id
            )
            .first()
        )

        if not report:
            return None

        return StreamingResponse(
            CoordinatorAgent.process_report_stream(report, db),
            media_type="text/event-stream"
        )