import os
import dotenv
import chromadb
from langchain_openai import OpenAIEmbeddings
dotenv.load_dotenv()

OPENAI_KEY = os.getenv("OPENAI_API_KEY")

embedding_model = OpenAIEmbeddings(openai_api_key = OPENAI_KEY, model = 'text-embedding-ada-002')

#initialize chromadb client
chroma_client = chromadb.PersistentClient(path = "chroma_db")


def store_chunks(chunks: list[str], file_name:str):
    '''
    Creates a new collection for each PDF file and stores the chunks in it
    '''
    try:
        collection_name = file_name.replace(".pdf", "").replace(" ", "_")
        collection = chroma_client.create_collection(
            name = collection_name
        )


        for i, chunk in enumerate(chunks):
            embedding = embedding_model.embed_query(chunk)
            collection.add(
                ids = [str(i)],
                embeddings = embedding,
                metadatas = [{"text": chunk}],
                documents = [chunk]
            )
        return True
    except Exception as e:
        print(f"Error storing chunks: {e}")
        return False

def retrieve_similar_chunks(query: str,file_path:str, top_k:int = 5):
    '''
    Retrieve similar chunks from ChromaDB based on a query
    '''
    collection_name = os.path.basename(file_path).replace(".pdf", "").replace(" ", "_")
    collection = chroma_client.get_collection(collection_name)
    query_embedding = embedding_model.embed_query(query)
    results = collection.query(
        query_embeddings = [query_embedding],
        n_results = top_k
    )
    return [result["text"] for result in results["metadatas"][0] if results["documents"][0]]


def check_collection(file_name:str):
    '''
    Check if the collection already exists
    '''
    try:
        collection_name = file_name.replace(".pdf", "").replace(" ", "_")
        # existing_collections = chroma_client.list_collections()
        chroma_client.get_collection(collection_name) #raises valueerror if collection doesn't exist
        print(f"Collection {collection_name} already exists. Skipping processing.")
        return True
    except Exception as e:
        print(f"Collection {collection_name} does not exist. Processing...")
        return False
