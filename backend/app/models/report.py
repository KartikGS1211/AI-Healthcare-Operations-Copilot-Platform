from datetime import datetime

# pyrefly: ignore [missing-import]
from sqlalchemy import (DateTime, ForeignKey, Integer, String, Text)
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"), nullable=False)

    # Doctor who uploaded — used for per-doctor activity scoping
    uploaded_by: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)

    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    report_type: Mapped[str] = mapped_column(String(100), nullable=False)
    extracted_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="reports")
