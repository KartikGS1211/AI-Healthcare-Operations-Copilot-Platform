from datetime import datetime

# pyrefly: ignore [missing-import]
from sqlalchemy import (
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

# pyrefly: ignore [missing-import]
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from app.database.base import Base


class Interaction(Base):

    __tablename__ = "interactions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False
    )

    drug_1: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    drug_2: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    severity: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    mechanism: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    warning: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    recommendation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    patient = relationship(
        "Patient"
    )