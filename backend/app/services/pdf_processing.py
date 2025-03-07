import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

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

        return chunks
    except Exception as e:
        print(f"Error processing PDF file: {e}")
        return []

