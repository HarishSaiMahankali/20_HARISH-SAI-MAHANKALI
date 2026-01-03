from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from backend.app.api.routes import router
from backend.app.core.database import engine, Base
from backend.app.models import sql_models

# Init Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Medication Assistant", version="0.1.0")

app.include_router(router, prefix="/api/v1")

# Mount static files (Production Build)
# In dev, we use Vite dev server which proxies to this backend.
# In prod, we serve the built assets.
if os.path.exists("frontend/dist"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
def read_root(full_path: str):
    # Serve index.html for any path not capturing API/Assets (SPA routing)
    if full_path.startswith("api") or full_path.startswith("assets"):
        return {"error": "Not found"}
        
    if os.path.exists("frontend/dist/index.html"):
        return FileResponse("frontend/dist/index.html")
    return {"message": "Frontend build not found. Run 'npm run build' in frontend/."}

