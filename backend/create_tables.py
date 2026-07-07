
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