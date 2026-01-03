from pydantic import BaseModel
from typing import List, Optional

class DrugInfo(BaseModel):
    brand_name: Optional[str] = None
    generic_name: Optional[str] = None
    purpose: Optional[str] = None # indications_and_usage
    warnings: Optional[str] = None
    dosage_instructions: Optional[str] = None # dosage_and_administration
    adverse_reactions: Optional[str] = None
    
class DrugSearchResult(BaseModel):
    results: List[DrugInfo]
