import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key = os.getenv("OPENAI_API_KEY"))

def generate_response(context: str, query: str):
    '''
    Generate a response using the LLM for the given query
    '''
    system_prompt = f"""
    You are an AI assistant that answers questions based on the provided document excerpts.
    Document Context:
    {context}
    
    Question: {query}
    Answer:
    """

    response = client.chat.completions.create(
        model = "gpt-4",
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ],
    )

    answer = response.choices[0].message.content
    return answer

    
    