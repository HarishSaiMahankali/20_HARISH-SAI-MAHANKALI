import sys
import os

# Add project root to sys.path
sys.path.append(os.getcwd())

try:
    print("Verifying imports...")
    from backend.main import app
    from backend.app.services.fda_client import FDAClient
    from backend.app.services.rag_service import RAGService
    from backend.app.services.reminder_service import ReminderService
    print("✅ All modules imported successfully.")
except ImportError as e:
    print(f"❌ Import Error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Unexpected Error: {e}")
    sys.exit(1)
