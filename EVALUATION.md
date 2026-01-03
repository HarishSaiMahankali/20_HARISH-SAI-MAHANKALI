# 🛡️ Evaluation & Safety Guardrails

This document outlines the safety mechanisms and evaluation strategies for the **Medication Reminder & Caregiver Tracking System**.

## 1. Safety Guardrails

Since this system deals with health information, strict guardrails are implemented to prevent hallucination and ensure user safety.

### A. Groundedness (Label-Awareness)
- **Mechanism**: The System Prompt explicitly instructs the LLM to answer *only* based on the retrieved context.
- **Implementation**:
  ```python
  template = """Answer the question based ONLY on the following context from the FDA drug label:
  {context}
  If the information is not in the context, say "Not found in label"."""
  ```
- **Constraint**: If the vector database retrieval (RAG) does not return relevant chunks, the model defaults to "Not found" rather than inventing facts.

### B. No Medical Advice Disclaimer
- **Mechanism**: All UI interfaces and Chat outputs include a disclaimer.
- **Policy**: The system is for "information and tracking only" and explicitly states it does not replace a doctor's advice.

### C. Caregiver Consent
- **Privacy**: Caregiver access is strictly opt-in. The patient must plainly grant access, and they can revoke it at any time.

## 2. Evaluation Metrics

We evaluate the system using the **RAGAS** (Retrieval Augmented Generation Assessment) framework concepts.

### A. Faithfulness
- **Definition**: Is the answer derived *only* from the retrieved context?
- **Test**: Manually verify that citations in the answer match the provided FDA text strings.

### B. Answer Relevance
- **Definition**: Does the answer directly address the user's question?
- **Test**: Comparison of generated answers against a set of "Golden Questions" (e.g., "What is the dosage?" vs. Standard Label Logic).

### C. Context Precision
- **Definition**: Did the retrieval step find the correct section (e.g., 'Warnings' vs 'Dosage')?
- **Optimization**: We use metadata filtering (Section: Warnings) to ensure high precision.

## 3. Known Limitations
- **Data Latency**: Information is only as current as the downloaded OpenFDA dataset.
- **Complex Queries**: Multi-hop reasoning (e.g., "Can I take this if I take that?") is currently limited and guarded to recommend professional advice.
