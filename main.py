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