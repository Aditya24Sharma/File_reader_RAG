from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def load_document(pdf):
    #load a pdf
    '''
    Load a PDF and split it into chuncks for efficient retrieval

    :param pdf: PDF file to load
    :return: List of chunks of text
    '''

    loader = PyPDFLoader(pdf)
    docs = loader.load() #converts pdf to document obj to be sent to the text splitter

    # instantiate text splitter with chunck size of 500 words and overlap of 100 words so that the context is # not lost

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    # split the chuncks for efficient retrieval
    chunks = text_splitter.split_documents(docs)

    return chunks



