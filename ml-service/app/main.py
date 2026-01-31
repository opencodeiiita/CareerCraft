import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import resume,health,cover_letter

app = FastAPI(title = "CareerCraft ML Service")

# Detect port for cloud deployment (optional, for local testing)
PORT = int(os.environ.get("PORT", 8001))

# Allow all origins for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["System"])
app.include_router(resume.router, prefix="/resume", tags=["Extraction"])
app.include_router(cover_letter.router, prefix="/cover-letter", tags=["Cover Letter"])

@app.get("/")
async def root():
    return {"message": "ML Service is running"}