from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class ReminderSchedule(BaseModel):
    drug: str = Field(description="Name of the drug")
    dosage: str = Field(description="Dosage amount, e.g., 500mg")
    times: List[str] = Field(description="List of times to take the medication, e.g., ['08:00', '20:00']. If not specified, infer reasonable times based on frequency (e.g. twice daily -> 8am, 8pm).")
    instructions: str = Field(description="Instructions like 'Take with food'")

class ReminderService:
    def __init__(self, model_name="llama3"):
        self.llm = ChatOllama(model=model_name, format="json")
        self.parser = JsonOutputParser(pydantic_object=ReminderSchedule)

    def generate_schedule(self, drug_name: str, dosage_text: str) -> ReminderSchedule:
        """
        Generates a structured reminder schedule from dosage text.
        """
        template = """Processing the dosage information for the drug "{drug_name}".
        Dosage Text: "{dosage_text}"
        
        Extract the medication schedule into a structured JSON format. 
        Infer specific times (HH:MM) if only frequency is given (e.g., "twice a day" -> 09:00, 21:00).
        
        {format_instructions}
        """
        
        prompt = ChatPromptTemplate.from_template(template)
        
        chain = prompt | self.llm | self.parser
        
        try:
            result = chain.invoke({
                "drug_name": drug_name, 
                "dosage_text": dosage_text,
                "format_instructions": self.parser.get_format_instructions()
            })
            return result
        except Exception as e:
            print(f"Error generating reminder: {e}")
            # Fallback
            return {
                "drug": drug_name,
                "dosage": "Unknown",
                "times": [],
                "instructions": "Could not parse instructions."
            }
