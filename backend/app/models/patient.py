from datetime import datetime

# pyrefly: ignore [missing-import]
from sqlalchemy import DateTime, Integer, String 
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Mapped, mapped_column,relationship

from app.database.base import Base

class Patient(Base):
    __tablename__= "patients"

    id: Mapped[int]=mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name: Mapped[str]= mapped_column(
        String(255),
        nullable=False
    )

    age: Mapped[int]= mapped_column(
        Integer,
        nullable=False
    )

    gender:Mapped[str]=mapped_column(
        String(20),
        nullable=False
    )

    phone: Mapped[str] =mapped_column(
        String(20),
        nullable=False
    )

    created_at:Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    reports = relationship(
        "Report",
        back_populates="patient",
        cascade="all, delete-orphan"
    )