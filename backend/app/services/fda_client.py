import requests
from typing import Optional, Dict, Any
from backend.app.models.schemas import DrugInfo, DrugSearchResult

BASE_URL = "https://api.fda.gov/drug/label.json"

class FDAClient:
    def __init__(self):
        self.base_url = BASE_URL

    def search_drug(self, query: str, limit: int = 1) -> Optional[DrugSearchResult]:
        """
        Search for a drug by brand name or generic name.
        """
        # Search in both brand_name and generic_name
        search_query = f'openfda.brand_name:"{query}"+OR+openfda.generic_name:"{query}"'
        params = {
            "search": search_query,
            "limit": limit
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if "results" not in data:
                return None
                
            drug_infos = []
            for item in data["results"]:
                # Helper to safely get list or string and join if list
                def get_text(key):
                    val = item.get(key)
                    if isinstance(val, list):
                        return "\n".join(val)
                    return val

                openfda = item.get("openfda", {})
                
                info = DrugInfo(
                    brand_name=openfda.get("brand_name", [None])[0],
                    generic_name=openfda.get("generic_name", [None])[0],
                    purpose=get_text("indications_and_usage"),
                    warnings=get_text("warnings"),
                    dosage_instructions=get_text("dosage_and_administration"),
                    adverse_reactions=get_text("adverse_reactions")
                )
                drug_infos.append(info)
                
            return DrugSearchResult(results=drug_infos)
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from FDA API: {e}")
            return None
