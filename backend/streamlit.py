#Imports
from langchain_community.vectorstores import FAISS

from langchain.chains import create_retrieval_chain

from langchain.chains.combine_documents import create_stuff_documents_chain

from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings

from langchain_core.prompts import ChatPromptTemplate

from scripts.document_loader import load_document

import streamlit as st

import dotenv
import os

dotenv.load_dotenv()

OPENAI_KEY = os.getenv('OPENAI_API_KEY')

#Create a streamlit app
st.title("AI-Powered Document Q&A")

# Load document to streamlit
uploaded_file = st.file_uploader("Choose a document", type=['pdf'])

# If a files is uploaded, create the Text Splitter and vector database
if uploaded_file:

    # Code to work around document loader from Streamlit and make it readable by langchain
    temp_file = "./temp.pdf"
    with open(temp_file, 'wb') as file:
        file.write(uploaded_file.getvalue())
        file_name = uploaded_file.name

    # Load document and split it into chunks for efficient retrieval. 
    chunks = load_document(temp_file)

    st.write("Processing document... :watch:")

    # Generate embeddings

    embeddings = OpenAIEmbeddings(openai_api_key = OPENAI_KEY, model = 'text-embedding-ada-002')

    vector_db = FAISS.from_documents(chunks, embeddings) 

    # Create a document retriever
    retriever = vector_db.as_retriever()
    llm = ChatOpenAI(model_name = 'gpt-4o-mini', openai_api_key = OPENAI_KEY)

    # Create a system prompt
    system_prompt = (
        "You are a helpful assistant. Use the given context to answer the question."
        "If you don't know the answer, say you don't know. "
        "{context}"
    )

    # Create a prompt Template
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "{input}"),
        ]
    )

    # Create a chain
    # It creates a StuffDocumentChain, which takes multiple documents (text data) and "stuffs" them together before passing them to the LLM for processing

    question_answer_chain = create_stuff_documents_chain(llm, prompt)

    # Create the RAG
    chain = create_retrieval_chain(retriever, question_answer_chain)

    #Streamlit input for question
    question = st.text_input("Ask a question about the document: ")
    if question:
        response = chain.invoke({"input": question})['answer']
        st.write(response)



# Delete the temp file
os.remove('./temp.pdf')
    