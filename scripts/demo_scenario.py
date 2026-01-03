import sys
import os
import asyncio

# Setup path to import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app.services.rag_service import RAGService
from backend.app.services.reminder_service import ReminderService

def run_demo():
    print("🚀 Starting Medication Assistant Demo Scenario...\n")
    
    # 1. Initialize Services
    print("1️⃣  Initializing Services...")
    try:
        rag_service = RAGService()
        reminder_service = ReminderService()
        print("   ✅ Services initialized.\n")
    except Exception as e:
        print(f"   ❌ Failed to initialize services: {e}")
        return

    # 2. Test RAG Chatbot
    question = "What are the warnings for Advil?"
    print(f"2️⃣  Testing Chatbot with Question: '{question}'")
    try:
        # Note: This depends on 'Advil' or similar being in the ingested data. 
        # If the ingestion is still running or finished, we might get a result or "Not found".
        answer = rag_service.query(question)
        print(f"   🤖 Assistant Answer:\n   {answer}\n")
    except Exception as e:
        print(f"   ❌ Chatbot error: {e}\n")

    # 3. Test Reminder Generation
    drug_name = "Metformin"
    dosage_text = "Take 500 mg twice daily with meals."
    print(f"3️⃣  Testing Reminder Generation for: {drug_name}")
    print(f"   📝 Dosage: {dosage_text}")
    try:
        schedule = reminder_service.generate_schedule(drug_name, dosage_text)
        print("   ⏰ Generated Schedule:")
        print(f"      Drug: {schedule['drug']}")
        print(f"      Dosage: {schedule['dosage']}")
        print(f"      Times: {schedule['times']}")
        print(f"      Instructions: {schedule['instructions']}\n")
    except Exception as e:
        print(f"   ❌ Reminder error: {e}\n")

    print("🏁 Demo Scenario Complete.")

if __name__ == "__main__":
    run_demo()
