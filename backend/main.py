from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
import json
import asyncio
from app.services import process_pdf, retrieve_similar_chunks, generate_response



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
    file_path: str

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok = True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    print(f"Uploading file: {file.filename}")
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {
        "message": "File uploaded successfully",
        "status": "success",
        "file_url":f"http://localhost:8000/uploads/{file.filename}",
        "file_path":file_path
    }

@app.post("/process/")
async def process(request: ProcessRequest):
    if not request.file_path:
        return {"error": "File path not found", "status": "error"}
    try:
        if process_pdf(request.file_path):
            return {
                "message": "PDF processed successfully",
                "status": "success",
                "file_path":request.file_path
            }
        else:
            return {"error": "Failed to process PDF", "status": "error"}
    except Exception as e:
        return {"error": str(e), "status": "error"}

@app.post("/query/")
async def query_pdf(request: QueryRequest):
    try:
        print(f'Entered query function')
        chunks = retrieve_similar_chunks(request.query, request.file_path)
        #create context for LLM
        context = "\n".join(chunks)
        print(f'Questions asked: {request.query}')
        async def generate_answer():
            answer = generate_response(context, request.query)

            words = answer.split(" ")
            for word in words:
                yield f"data: {json.dumps({'content':word + ' '})}\n\n"
                await asyncio.sleep(0.03)

            yield f"data: [DONE]\n\n"
        return StreamingResponse(generate_answer(), media_type="text/event-stream")
    
    except Exception as e:
        return {"error": str(e)}
    

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)