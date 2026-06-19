# pyrefly: ignore [missing-import]
from app.agents.coordinate_agent import CoordinatorAgent
from app.models import Report
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

        result=(
            CoordinatorAgent.process_report(
                report
            )
        )

        return result