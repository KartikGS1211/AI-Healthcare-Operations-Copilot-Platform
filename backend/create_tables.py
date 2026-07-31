
from app.database.connection import engine
from app.database.base import Base
# pyrefly: ignore [missing-import]
from sqlalchemy import text

# Import all models here
from app.models.patient import Patient
from app.models.report import Report
from app.models.prescription import Prescription
from app.models.interaction import Interaction
from app.models.user import User


def safe_migrate(conn):
    """
    Run safe ALTER TABLE migrations for columns added after initial deployment.
    Uses IF NOT EXISTS so it is idempotent — safe to run on every startup.
    """
    migrations = [
        # uploaded_by: per-doctor activity scoping
        "ALTER TABLE reports ADD COLUMN IF NOT EXISTS uploaded_by VARCHAR(255)",
        "CREATE INDEX IF NOT EXISTS ix_reports_uploaded_by ON reports (uploaded_by)",
    ]
    for sql in migrations:
        try:
            conn.execute(text(sql))
            print(f"[migrate] OK: {sql[:70]}")
        except Exception as e:
            print(f"[migrate] Skipped (already exists): {e}")


def create_tables():
    print("Registering models...")
    print(f"[OK] {Patient.__name__} -> {Patient.__tablename__}")
    print(f"[OK] {Report.__name__} -> {Report.__tablename__}")
    print(f"[OK] {Prescription.__name__} -> {Prescription.__tablename__}")
    print(f"[OK] {Interaction.__name__} -> {Interaction.__tablename__}")
    print(f"[OK] {User.__name__} -> {User.__tablename__}")

    print("\nCreating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables Created Successfully")

    # Safe column migrations — runs on every startup, no harm if already done
    print("\nRunning safe column migrations...")
    with engine.connect() as conn:
        safe_migrate(conn)
        conn.commit()
    print("Migrations complete!")

    # Seed default demo accounts
    from app.database.session import SessionLocal
    from app.core.security import hash_password

    db = SessionLocal()
    try:
        doctor = db.query(User).filter(User.email == "doctor@hospital.org").first()
        if not doctor:
            print("Seeding doctor account...")
            doctor_user = User(
                email="doctor@hospital.org",
                hashed_password=hash_password("Password123"),
                full_name="Dr. Sarah Connor",
                role="doctor"
            )
            db.add(doctor_user)

        patient = db.query(User).filter(User.email == "patient@hospital.org").first()
        if not patient:
            print("Seeding patient account...")
            patient_user = User(
                email="patient@hospital.org",
                hashed_password=hash_password("Password123"),
                full_name="John Connor",
                role="patient"
            )
            db.add(patient_user)

            existing_profile = db.query(Patient).filter(Patient.full_name == "John Connor").first()
            if not existing_profile:
                new_patient_profile = Patient(
                    full_name="John Connor",
                    age=30,
                    gender="male",
                    phone="9876543210"
                )
                db.add(new_patient_profile)

        db.commit()
        print("Demo accounts seeded successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    create_tables()