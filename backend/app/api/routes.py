from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional

from backend.app.services.rag_service import RAGService
from backend.app.services.reminder_service import ReminderService
from backend.app.models.schemas import DrugInfo
from backend.app.api.endpoints import router as db_router

router = APIRouter()
router.include_router(db_router, tags=["persistence"])

# Initialize Service (Singleton pattern for simplicity in this scope)
# In production, use dependency injection
rag_service = RAGService()
reminder_service = ReminderService()

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

class IngestResponse(BaseModel):
    message: str
    success: bool

@router.post("/ingest/{drug_name}", response_model=IngestResponse)
async def ingest_drug(drug_name: str):
    """
    Ingest a drug's label data into the vector database.
    """
    success = rag_service.ingest_drug(drug_name)
    if success:
        return {"message": f"Successfully ingested data for {drug_name}", "success": True}
    else:
        raise HTTPException(status_code=404, detail="Drug not found or failed to ingest")

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Ask a question about the drugs in the library.
    """
    answer = rag_service.query(request.question)
    return {"answer": answer}

# Placeholder for reminder generation
class ReminderRequest(BaseModel):
    drug_name: str
    dosage_text: str

@router.post("/reminders/generate")
async def generate_reminder(request: ReminderRequest):
    schedule = reminder_service.generate_schedule(request.drug_name, request.dosage_text)
    return schedule
