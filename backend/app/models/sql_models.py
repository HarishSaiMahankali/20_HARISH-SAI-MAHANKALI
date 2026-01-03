from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, JSON, DateTime, Date
from sqlalchemy.orm import relationship
from backend.app.core.database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    role = Column(String)  # 'patient' or 'caregiver'
    # For hackathon simplicity, we might store plain text or basic hash. 
    # Production MUST use bcrypt. We'll add password_hash field.
    password_hash = Column(String) 

    reminders = relationship("Reminder", back_populates="owner")

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    drug_name = Column(String)
    dosage = Column(String)
    instruction = Column(String)
    frequency = Column(String) # e.g. "daily"
    times = Column(JSON) # ["08:00", "20:00"]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="reminders")
    adherence_records = relationship("Adherence", back_populates="reminder")

class Adherence(Base):
    __tablename__ = "adherence"

    id = Column(Integer, primary_key=True, index=True)
    reminder_id = Column(Integer, ForeignKey("reminders.id"))
    date = Column(Date) # YYYY-MM-DD
    status = Column(String) # 'full', 'missed', 'partial'
    
    reminder = relationship("Reminder", back_populates="adherence_records")
