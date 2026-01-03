from backend.app.core.database import SessionLocal, engine
from backend.app.models.sql_models import User
from backend.app.core.security import get_password_hash

def seed_doctors():
    db = SessionLocal()
    try:
        doctors = [
            ("doctor1", "docpass1", "caregiver"), # Using 'caregiver' role as Doctor for now
            ("doctor2", "docpass2", "caregiver"),
            ("doctor3", "docpass3", "caregiver"),
            ("doctor4", "docpass4", "caregiver"), # Admin/Head Doc
            ("admin", "adminpass", "caregiver")
        ]

        print("Seeding Doctors...")
        for username, password, role in doctors:
            existing = db.query(User).filter(User.username == username).first()
            if not existing:
                print(f"Creating {username}...")
                new_user = User(
                    username=username,
                    role=role,
                    password_hash=get_password_hash(password)
                )
                db.add(new_user)
            else:
                print(f"Skipping {username} (already exists)")
        
        db.commit()
        print("Seeding Complete.")
    except Exception as e:
        print(f"Error seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_doctors()
