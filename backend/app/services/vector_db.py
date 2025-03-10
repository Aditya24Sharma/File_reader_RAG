import os
import dotenv
import chromadb
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
dotenv.load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_API_KEY")

embedding_model = OpenAIEmbeddings(openai_api_key = OPENAI_KEY, model = 'text-embedding-ada-002')

#initialize chromadb client
chroma_client = chromadb.PersistentClient(path = "chroma_db")

#create a collection
collection = chroma_client.get_or_create_collection("pdf_collection")


def store_chunks(chunks: list[str]):
    '''
    Store chunks in ChromaDB with OpenAI embeddings
    '''
    for i, chunk in enumerate(chunks):
        embedding = embedding_model.embed_query(chunk)
        collection.add(
            ids = [str(i)],
            embeddings = [embedding],
            metadatas = [{"text": chunk}],
            documents = [chunk]
        )
    return True

def retrieve_similar_chunks(query: str, top_k:int = 5):
    '''
    Retrieve similar chunks from ChromaDB based on a query
    '''
    query_embedding = embedding_model.embed_query(query)
    results = collection.query(
        query_embeddings = [query_embedding],
        n_results = top_k
    )
    return [result["text"] for result in results["metadatas"][0] if results["documents"][0]]
