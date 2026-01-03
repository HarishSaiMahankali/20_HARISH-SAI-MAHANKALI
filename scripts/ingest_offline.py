import sys
import os
import json
import asyncio

# Setup path to import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app.services.rag_service import RAGService
from backend.app.models.schemas import DrugInfo

import zipfile
import io

def load_data_files(data_dir):
    files = [f for f in os.listdir(data_dir) if f.endswith('.json') or f.endswith('.zip')]
    return files

def process_file(rag_service: RAGService, file_path: str):
    print(f"Processing {file_path}...")
    
    if file_path.endswith('.zip'):
        try:
            with zipfile.ZipFile(file_path, 'r') as z:
                for filename in z.namelist():
                    if filename.endswith('.json'):
                        print(f"  - Extracting {filename} from zip...")
                        with z.open(filename) as f:
                            data = json.load(f)
                            ingest_data(rag_service, data, f"{file_path}::{filename}")
        except Exception as e:
            print(f"Error reading zip {file_path}: {e}")
            
    elif file_path.endswith('.json'):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                ingest_data(rag_service, data, file_path)
        except Exception as e:
            print(f"Error reading {file_path}: {e}")

def ingest_data(rag_service: RAGService, data: any, source_name: str):
    # Handle OpenFDA bulk download format or single OpenFDA result format
    results = []
    if isinstance(data, dict) and "results" in data:
        results = data["results"]
    elif isinstance(data, list):
        results = data
    else:
        results = [data]
        
    count = 0
    for item in results:
        # Check if it has openfda key (standard structure)
        openfda = item.get("openfda", {})
        brand_name = openfda.get("brand_name", [None])[0]
        generic_name = openfda.get("generic_name", [None])[0]
        
        # If no brand name, try to use generic, else skip
        name = brand_name or generic_name
        if not name:
            continue

        # Extract fields helper
        def get_text(key):
            val = item.get(key)
            if isinstance(val, list):
                return "\n".join(val)
            return val

        drug_info = DrugInfo(
            brand_name=brand_name,
            generic_name=generic_name,
            purpose=get_text("indications_and_usage"),
            warnings=get_text("warnings"),
            dosage_instructions=get_text("dosage_and_administration"),
            adverse_reactions=get_text("adverse_reactions")
        )
        
        # Manually trigger the splitting and adding logic from RAGService
        
        documents = []
        sections = {
            "Indications & Usage": drug_info.purpose,
            "Warnings": drug_info.warnings,
            "Dosage & Administration": drug_info.dosage_instructions,
            "Adverse Reactions": drug_info.adverse_reactions
        }
        
        base_metadata = {
            "drug_name": name,
            "generic_name": drug_info.generic_name
        }

        for section_name, content in sections.items():
            if content:
                full_content = f"Drug: {base_metadata['drug_name']}\nSection: {section_name}\nContent: {content}"
                docs = rag_service.text_splitter.create_documents([full_content], metadatas=[{**base_metadata, "section": section_name}])
                documents.extend(docs)

        if documents:
            rag_service.vectorstore.add_documents(documents)
            count += 1
            
    print(f"Successfully digested {count} drugs from {source_name}")

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    
    if not os.path.exists(data_dir):
        print(f"Data directory not found: {data_dir}")
        return

    print(f"Looking for data in {data_dir}")
    files = load_data_files(data_dir)
    
    if not files:
        print("No JSON or ZIP files found.")
        return

    rag_service = RAGService()
    
    for file_name in files:
        process_file(rag_service, os.path.join(data_dir, file_name))
        
    print("Ingestion complete.")

if __name__ == "__main__":
    main()
