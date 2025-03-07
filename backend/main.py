from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os
from app.services import extract_pdf_content
import uvicorn

app = FastAPI()

class ProcessRequest(BaseModel):
    file_path: str

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok = True)

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"message": "File uploaded successfully"}

@app.post("/process/")
async def process_pdf(request: ProcessRequest):
    chunks = extract_pdf_content(request.file_path)
    return {"message": "PDF processed successfully", "chunks": chunks}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)