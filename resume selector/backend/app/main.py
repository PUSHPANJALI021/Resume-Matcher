from fastapi import FastAPI
from app.routes import resume

app = FastAPI(title="Intelligent Resume Matching Platform")

app.include_router(resume.router, prefix="/resume", tags=["Resume"])

@app.get("/")
def root():
    return {"message": "Backend running successfully "}