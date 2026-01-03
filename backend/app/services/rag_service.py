import os
from langchain_chroma import Chroma
from langchain_community.chat_models import ChatOllama
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_text_splitters import RecursiveCharacterTextSplitter
# For embeddings, we can use OllamaEmbeddings or a lightweight HuggingFace one.
# Using OllamaEmbeddings requires the model to support bindings, typically 'llama3' or 'nomic-embed-text'
from langchain_community.embeddings import OllamaEmbeddings

from backend.app.services.fda_client import FDAClient
from backend.app.models.schemas import DrugInfo

class RAGService:
    def __init__(self, persist_directory="./chroma_db", model_name="llama3"):
        self.embedding_function = OllamaEmbeddings(model=model_name)
        self.vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=self.embedding_function,
            collection_name="drug_labels"
        )
        self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
        self.llm = ChatOllama(model=model_name)
        self.fda_client = FDAClient()
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

    def ingest_drug(self, drug_name: str) -> bool:
        """
        Fetches drug label from FDA, chunks it, and adds to Vector DB.
        """
        print(f"Fetching data for {drug_name}...")
        result = self.fda_client.search_drug(drug_name)
        
        if not result or not result.results:
            print("No data found.")
            return False

        drug_info = result.results[0]
        
        # Construct content for embedding
        # We'll create separate documents for different sections to improve retrieval accuracy
        documents = []
        
        sections = {
            "Indications & Usage": drug_info.purpose,
            "Warnings": drug_info.warnings,
            "Dosage & Administration": drug_info.dosage_instructions,
            "Adverse Reactions": drug_info.adverse_reactions
        }
        
        base_metadata = {
            "drug_name": drug_info.brand_name or drug_name,
            "generic_name": drug_info.generic_name
        }

        for section_name, content in sections.items():
            if content:
                # Add context to the content itself
                full_content = f"Drug: {base_metadata['drug_name']}\nSection: {section_name}\nContent: {content}"
                docs = self.text_splitter.create_documents([full_content], metadatas=[{**base_metadata, "section": section_name}])
                documents.extend(docs)

        if documents:
            self.vectorstore.add_documents(documents)
            print(f"Ingested {len(documents)} text chunks for {drug_name}.")
            return True
        
        return False

    def query(self, question: str) -> str:
        """
        RAG Query pipeline.
        """
        # Define prompt
        template = """Answer the question based ONLY on the following context from the FDA drug label:
        
        {context}
        
        Question: {question}
        
        If the information is not in the context, say "Not found in label".
        """
        prompt = ChatPromptTemplate.from_template(template)
        
        def format_docs(docs):
            return "\n\n".join([d.page_content for d in docs])

        # Chain
        rag_chain = (
            {"context": self.retriever | format_docs, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        return rag_chain.invoke(question)
