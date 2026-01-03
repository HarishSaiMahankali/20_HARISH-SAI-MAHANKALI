# 🩺 Medication Reminder & Caregiver Tracking System (Label-Aware)

A **label-aware medication management system** that helps users understand medicines, track daily medication intake, and enables caregivers to monitor adherence — powered entirely by **official FDA drug labels**.

This project focuses on **safe, responsible AI in healthcare** by providing **information and tracking only**, without diagnosis or treatment recommendations.

---

## 📌 Problem Statement

Many patients, especially elderly individuals, face difficulties in:

- Understanding complex drug labels  
- Remembering dosage schedules  
- Maintaining consistent medication adherence  
- Sharing medication history with caregivers or family members  

At the same time, caregivers lack a **secure and ethical way** to monitor medication adherence without interfering in medical decisions.

---

## 💡 Solution Overview

This project provides a **Medication Assistant** that:

- Offers a searchable **Drugs Library** with FDA-sourced information  
- Answers medication-related questions using **label-grounded AI (RAG)**  
- Generates **structured dosage reminder schedules**  
- Tracks daily medication intake (taken / missed)  
- Maintains a clear **medication history timeline**  
- Enables **consent-based caregiver monitoring**

⚠️ This system is **informational only** and does **not diagnose, prescribe, or modify treatment**.

---

## ✨ Key Features

### 📚 Drugs Library
- Search drugs by name (partial or full)
- View FDA label–based information:
  - Purpose / usage  
  - Dosage form (tablet, syrup, injection)  
  - Common side effects  
  - High-level warnings  
- Serves as the entry point for chatbot and reminder features

---

### 💬 Drug Q&A Chatbot (Label-Aware)
- Built using **Retrieval-Augmented Generation (RAG)**
- Answers strictly from **official FDA drug labels**
- Cites label sections (Dosage, Warnings, Adverse Reactions)
- Returns **“Not found in label”** if information is unavailable

**Example Questions**
- *What are the side effects of Ibuprofen?*  
- *Can this medicine be taken with food?*

---

### ⏰ Dosage Reminder Schedule Generator
Converts label dosage text into a structured reminder plan.

**Example Output**
```json
{
  "drug": "Metformin",
  "dosage": "500 mg",
  "times": ["08:00", "20:00"],
  "instructions": "Take after meals"
}
```

### ✅ Daily Medication Tracking

Users can mark each dose as:
- ✅ Taken
- ❌ Missed

Displays:
- Today’s medication checklist
- Missed dose highlights
- Weekly adherence summary

### 📊 Medication History

Tracks:
- Medications added
- Dosage schedules
- Daily adherence logs

Helps users and caregivers understand long-term adherence patterns.

Optional export formats:
- JSON
- CSV

### 👨‍👩‍👧 Caregiver (Parental) Access
- Consent-based caregiver mode
- Read-only access for caregivers

Caregivers can view:
- Medication schedules
- Taken / missed doses
- Adherence percentage

🚫 Caregivers cannot modify medication or dosage
🔓 Access can be revoked by the patient at any time

---

## 🛡️ Safety & Ethics

- Uses only official FDA drug label data
- No diagnosis, prescription, or treatment advice
- Explicit patient consent for caregiver access
- Clear medical disclaimers across the system
- Designed to minimize hallucination using RAG

⚠️ **Disclaimer**
This system provides information sourced from official FDA drug labels and does not replace professional medical advice.
Users should always consult qualified healthcare professionals for diagnosis or treatment decisions.

---

## 🧠 Tech Stack

**Backend**
- Python
- FastAPI
- LangChain
- ChromaDB (Vector Database)

**LLM (Local & Free)**
- LLaMA-3 8B Instruct or
- Mistral 7B Instruct
- (via Ollama, no API key required)

**Database**
- SQLite / MongoDB

**Data Source**
- openFDA Drug Label Dataset
- https://open.fda.gov/apis/drug/label/download/

---

## 🚀 Hackathon Alignment (H2)

- ✔️ Label-aware medication Q&A
- ✔️ RAG-based hallucination control
- ✔️ Structured reminder generation
- ✔️ Ethical & safety-first design
- ✔️ Expandable to full care lifecycle systems

---

## 🏁 How to Run (High Level)

1. Install Ollama and pull a local LLM model
2. Ingest FDA drug labels into ChromaDB
3. Start the FastAPI backend
4. Interact with the chatbot and reminder system

Detailed setup steps are provided in the project documentation.

---

## 📌 Future Enhancements

- Smart adherence alerts
- Multi-language support
- Visual adherence dashboards
- Integration with wearable reminders
- Clinical handoff (doctor → patient) extensions
