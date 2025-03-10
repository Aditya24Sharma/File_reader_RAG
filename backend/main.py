from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from app.services import extract_pdf_content, store_chunks, retrieve_similar_chunks, generate_response



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

class ProcessRequest(BaseModel):
    file_path: str

class QueryRequest(BaseModel):
    query: str


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

@app.post("/store/")
async def store_pdf_chunks(request: ProcessRequest):
    if not request.file_path:
        return {"error": "File path not found"}
    try:
        chunks = extract_pdf_content(request.file_path)
        if store_chunks(chunks):
            return {"message": "PDF chunks stored successfully"}
        else:
            return {"error": "Failed to store chunks"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/query/")
async def query_pdf(request: QueryRequest):
    try:
        chunks = retrieve_similar_chunks(request.query)

        #create context for LLM
        context = "\n".join(chunks)
        print(f'Questions asked: {request.query}')
        answer = generate_response(context, request.query)
        print(f'Answer: {answer}')
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)