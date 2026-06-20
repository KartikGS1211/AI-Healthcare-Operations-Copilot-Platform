
from app.database.connection import engine
from app.database.base import Base

# Import all models here
from app.models.patient import Patient
from app.models.report import Report
from app.models.prescription import Prescription
from app.models.interaction import Interaction
from app.models.user import User

def create_tables():
    print("Registering models...")

    print(
        f"[OK] {Patient.__name__} -> {Patient.__tablename__}"
    )

    print(
        f"[OK] {Report.__name__} -> {Report.__tablename__}"
    )

    print(
        f"[OK] {Prescription.__name__} -> {Prescription.__tablename__}"
    )

    print(
        f"[OK] {Interaction.__name__} -> {Interaction.__tablename__}"
    )

    print(
        f"[OK] {User.__name__} -> {User.__tablename__}"
    )

    print("\nCreating database tables...")

    Base.metadata.create_all(bind=engine)

    print(" Tables Created Successfully")


if __name__ == "__main__":
    create_tables()