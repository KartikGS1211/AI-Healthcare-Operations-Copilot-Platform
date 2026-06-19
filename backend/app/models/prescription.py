from datetime import datetime
# pyrefly: ignore [missing-import]
from sqlalchemy import (
    DateTime,ForeignKey,Integer,String,Text
)

# pyrefly: ignore [missing-import]
from sqlalchemy.orm import(
    Mapped,mapped_column,relationship
)

from app.database.base import Base

class Prescription(Base):

    __tablename__ ="prescriptions"

    id:Mapped[int] =mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id:Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False
    )

    report_id:Mapped[int] =mapped_column(
        ForeignKey("reports.id"),
        nullable=False
    )

    medicine_name: Mapped[str] =mapped_column(
        String(255),
        nullable=False
    )

    dosage: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    frequency:Mapped[str | None] =mapped_column(
        String(100),
        nullable=True
    )

    duration:Mapped[ str | None] =mapped_column(
        String(100),
        nullable=True
    )

    raw_text:Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    patient= relationship("Patient")
    report=relationship("Report")