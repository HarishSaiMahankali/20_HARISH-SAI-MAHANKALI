from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

from backend.app.core.database import get_db
from backend.app.models.sql_models import User, Reminder, Adherence
from backend.app.core.security import get_password_hash, verify_password
from backend.app.services.email_service import send_email, format_prescription_email

router = APIRouter()

# --- Pydantic Schemas ---
class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    password: str
    role: str # 'patient' or 'caregiver'
    fullname: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    # fullname: str # if we add fullname to DB

class ReminderCreate(BaseModel):
    user_id: int
    drug_name: str
    dosage: str
    frequency: str
    times: List[str]

class AdherenceCreate(BaseModel):
    reminder_id: int
    date: str # YYYY-MM-DD
    status: str

# --- Endpoints ---

@router.post("/auth/register")
def register(user: UserRegister, db: Session = Depends(get_db)):
    # Check if exists
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username, 
        role=user.role,
        password_hash=hashed_password
        # fullname not in DB yet
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "username": new_user.username, "role": new_user.role}

@router.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"id": db_user.id, "username": db_user.username, "role": db_user.role}

# --- Doctor / Caregiver Features ---

@router.get("/users/patients")
def get_all_patients(db: Session = Depends(get_db)):
    # In prod, check if current user is 'caregiver'
    return db.query(User).filter(User.role == "patient").all()

@router.post("/reminders/add")
def add_reminder(reminder: ReminderCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_reminder = Reminder(
        user_id=reminder.user_id,
        drug_name=reminder.drug_name,
        dosage=reminder.dosage,
        frequency=reminder.frequency,
        times=reminder.times
    )
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)

    # --- Send Notification Email ---
    target_user = db.query(User).filter(User.id == reminder.user_id).first()
    if target_user and target_user.username and "@" in target_user.username:
        # Mock 'fullname' using username or hardcode if DB is missing it
        patient_name = target_user.username.split('@')[0]
        
        email_body = format_prescription_email(
            patient_name=patient_name,
            drug_name=reminder.drug_name,
            dosage=reminder.dosage,
            frequency=reminder.frequency,
            times=reminder.times
        )
        background_tasks.add_task(send_email, target_user.username, "New Prescription Added - MedCare", email_body)

    return db_reminder

@router.get("/reminders/{user_id}")
def get_reminders(user_id: int, db: Session = Depends(get_db)):
    return db.query(Reminder).filter(Reminder.user_id == user_id).all()

@router.post("/adherence")
def record_adherence(record: AdherenceCreate, db: Session = Depends(get_db)):
    # Check if exists
    exists = db.query(Adherence).filter(
        Adherence.reminder_id == record.reminder_id,
        Adherence.date == record.date
    ).first()

    if exists:
        exists.status = record.status
    else:
        new_record = Adherence(
            reminder_id=record.reminder_id,
            date=record.date,
            status=record.status
        )
        db.add(new_record)
    
    db.commit()
    return {"success": True}

@router.get("/adherence/{user_id}")
def get_adherence(user_id: int, db: Session = Depends(get_db)):
    # Join Reminders to get User's adherence
    results = db.query(Adherence).join(Reminder).filter(Reminder.user_id == user_id).all()
    return results
