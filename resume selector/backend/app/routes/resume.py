from fastapi import APIRouter, UploadFile, File
from app.services.parser import extract_text_from_pdf, extract_email, extract_phone, extract_skills

router = APIRouter()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        return {"error": "Only PDF files allowed"}

    text = extract_text_from_pdf(file.file)

    return {
        "filename": file.filename,
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "preview": text[:500]
    }