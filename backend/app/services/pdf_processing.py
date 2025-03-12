import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.services.vector_db import store_chunks, check_collection

def process_pdf(file_path: str):
    '''
    Process a PDF file and store the chunks in the vector database
    '''
    try:
        file_name = os.path.basename(file_path)
        if check_collection(file_name):
            return True # Collection already exists so no need to process
        
        print(f"Extracting pdf content from: {file_path}")
        chunks = extract_pdf_content(file_path)
        if chunks:
            store_chunks(chunks, file_name)
            print(f"PDF content extracted and stored in ChromaDB for file: {file_name}")
            return True
        else:
            print(f"No content extracted from file: {file_name}")
            return False
        
    except Exception as e:
        print(f"Error processing PDF file: {e}")
        return False

def extract_pdf_content(file_path: str):
    '''
    Process a PDF file and return a list of chunks of text

    :param file_path: Path to the PDF file
    :return: List of chunks of text
    '''
    try:        
        loader = PyPDFLoader(file_path)
        docs = loader.load()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=200)
        chunked_docs = text_splitter.split_documents(docs)

        #Extract only the text from the chunks
        chunks = [chunk.page_content for chunk in chunked_docs]
        print(f"Extracted {len(chunks)} chunks from file: {file_path}")
        return chunks
    except Exception as e:
        print(f"Error processing PDF file: {e}")
        return []

