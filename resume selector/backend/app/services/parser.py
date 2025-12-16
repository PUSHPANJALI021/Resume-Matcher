import re
import pdfplumber

SKILLS = [
    "python", "java", "javascript", "react", "node",
    "sql", "django", "fastapi", "machine learning",
    "html", "css", "docker"
]

def extract_text_from_pdf(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_email(text):
    match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    return match.group(0) if match else None

def extract_phone(text):
    match = re.search(r"\+?\d[\d\s\-]{8,}\d", text)
    return match.group(0) if match else None

def extract_skills(text):
    text = text.lower()
    return [skill for skill in SKILLS if skill in text]