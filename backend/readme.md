Step 1: Database Setup
Step 2: Patient Module
Step 3: Reports Module
Step 4: OCR Service
Step 5: AI Summary Agent
Step 6: Prescription Agent
Step 7: Drug Interaction Agent
Step 8: RAG Knowledge Base
=> LLM + Medical Knowledge Base
Step 9: Doctor Dashboard APIs
Step 10: LangGraph Multi-Agent Workflow

Patient Uploads Report
↓
OCR
↓
Extracted Text
↓
AI Summary Agent
↓
Prescription Agent
↓
Medicine Extraction
↓
Drug Interaction Agent
↓
RAG Evidence Retrieval
↓
Evidence-Based Healthcare Insights

cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
to add schema in db => python create_tables.py
