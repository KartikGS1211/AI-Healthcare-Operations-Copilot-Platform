# AI Healthcare Operations Copilot - Backend

Welcome to the backend service of the **AI Healthcare Operations Copilot Platform**. This service is built with **FastAPI**, **SQLAlchemy** (supporting PostgreSQL and SQLite), **ChromaDB** (for RAG), and the **Groq API** (running Llama-3.3-70b-versatile) to process patient health reports, extract medical insights, check drug-drug interactions, and provide doctors with an analytics-driven clinical copilot.

---

## Key Features

- **Secure Authentication & Role-Based Access Control**: JWT token-based authentication with role protections (`doctor` vs. default users).
- **Document Processing & OCR Service**: Extract text from uploaded PDF files (via `PyMuPDF`) and images (via `Tesseract OCR` & `Pillow`).
- **Multi-Agent Orchestration**:
  - **Summary Agent**: Condenses extracted health records into structured clinical summaries.
  - **Prescription Agent**: Extracts medicines, dosages, frequencies, and durations from patient documents into structured entities.
  - **Drug-Drug Interaction Agent**: Analyzes lists of medicines to flag interactions, severity levels, mechanisms, and safety warnings.
- **Retrieval-Augmented Generation (RAG)**: Integrates **ChromaDB** to query verified dosage guidelines, drug interaction databases, and medicine dictionaries, injecting clinical evidence into copilot outputs.
- **Analytics Dashboard APIs**: Aggregates patient statistics, calculates the most frequently prescribed medicines, and lists recent medical reports.

---

## Architecture & Workflow

```mermaid
graph TD
    A[Patient Report PDF/Image] -->|Upload| B(FastAPI Endpoint)
    B -->|Save File| C[Upload Storage]
    B -->|Trigger OCR| D[OCR Service: PyMuPDF / Tesseract]
    D -->|Extracted Text| E[Database: Save Report]
    E -->|Trigger Multi-Agent Workflow| F[Coordinator Agent]

    F -->|Run Summary Agent| G[Summary Agent: LLM]
    F -->|Run Prescription Agent| H[Prescription Agent: LLM]
    F -->|Run Drug-Drug Interaction Agent| I[Interaction Agent: LLM]
    F -->|Query Context| J[RAG Pipeline: ChromaDB]

    G -->|Update Summary| K[Structured Analysis Report]
    H -->|Extract Medicines| K
    I -->|Analyze Intersections| K
    J -->|Retrieve Evidence| K

    K -->|Store & Return| L[Doctor Dashboard APIs / Frontend]
```

---

## Project Directory Structure

```text
backend/
├── app/
│   ├── agents/             # AI Multi-Agent Workflow components
│   │   ├── coordinate_agent.py  # Coordinates summary, prescription, and interaction agents
│   │   ├── summary_agent.py     # Generates clinical summary of reports
│   │   ├── prescription_agent.py# Extracts medicine details into structured JSON
│   │   ├── interaction_agent.py # Analyzes drug-drug interactions
│   │   ├── state.py             # Agent state management
│   │   └── workflow.py          # Main workflow entry point
│   ├── api/                # FastAPI routing and route controllers
│   │   ├── routes/
│   │   │   ├── analytics.py     # Dashboard stats, top medicines, recent reports
│   │   │   ├── auth.py          # User register & login authentication
│   │   │   ├── interaction.py   # Patient drug-drug interaction checks
│   │   │   ├── patient.py       # CRUD operations for patients
│   │   │   ├── prescription.py  # Extracting and saving prescriptions
│   │   │   ├── rag.py           # RAG search query endpoints
│   │   │   ├── reports.py       # Report upload, retrieval, and summarization
│   │   │   └── workflow.py      # Triggering the coordinator agent workflow
│   │   └── router.py            # API router aggregator
│   ├── core/               # Configuration, security utils, and auth dependencies
│   │   ├── config.py            # Pydantic Settings management
│   │   ├── dependencies.py      # Dependency injection (e.g. auth checks)
│   │   └── security.py          # JWT, password hashing and verification
│   ├── database/           # DB session and connection configuration
│   │   ├── base.py              # Base declarative class
│   │   ├── connection.py        # SQLAlchemy engine connection
│   │   └── session.py           # DB session generator
│   ├── models/             # SQLAlchemy ORM Database Models
│   │   ├── user.py              # User model (Authentication)
│   │   ├── patient.py           # Patient demographics model
│   │   ├── report.py            # Uploaded medical report metadata & OCR text
│   │   ├── prescription.py      # Extracted medicine prescriptions
│   │   └── interaction.py       # Logged drug-drug interactions
│   ├── prompts/            # LLM Prompt Templates for agents
│   ├── rag/                # RAG (Retrieval-Augmented Generation) engine
│   │   ├── chunker.py           # Text chunking logic
│   │   ├── embedder.py          # Sentence-transformers embedding logic
│   │   ├── ingest.py            # Data ingestion script for CSV knowledge bases
│   │   ├── pipeline.py          # Retreival orchestration
│   │   └── retriever.py         # ChromaDB client interface
│   ├── schemas/            # Pydantic data schemas (Validation & Response)
│   ├── services/           # Underlying infrastructure services
│   │   ├── file_service.py      # Local file persistence
│   │   ├── groq_service.py      # Groq LLM API integration
│   │   └── ocr_service.py       # Tesseract OCR & PyMuPDF wrappers
│   └── main.py             # FastAPI entrypoint application
├── data/                   # Knowledge Base CSV files for RAG ingestion
├── uploads/                # Directory storing uploaded medical report files
├── chroma_db/              # Local SQLite-based ChromaDB vector store
├── create_tables.py        # Database schema initialization script
├── readme.md               # Backend documentation
└── .env                    # Environment variables (secret)
```

---

## Database Models Schema

```mermaid
erDiagram
    users {
        int id PK
        string email UK
        string hashed_password
        string full_name
        string role
    }
    patients {
        int id PK
        string name
        int age
        string gender
        string contact_number
        string medical_history
    }
    reports {
        int id PK
        int patient_id FK
        string file_name
        string file_path
        string report_type
        string extracted_text
        string summary
        datetime uploaded_at
    }
    prescriptions {
        int id PK
        int patient_id FK
        int report_id FK
        string medicine_name
        string dosage
        string frequency
        string duration
        string raw_text
    }
    interactions {
        int id PK
        int patient_id FK
        string drug_1
        string drug_2
        string severity
        string warning
        string mechanism
        string recommendation
    }

    patients ||--o{ reports : "has"
    patients ||--o{ prescriptions : "prescribed"
    patients ||--o{ interactions : "risks"
    reports ||--o{ prescriptions : "specifies"
```

---

## API Reference

### 1. Authentication (`/auth`)

- `POST /auth/register` - Register a new user (`doctor` or generic).
- `POST /auth/login` - Login to receive a JWT token (OAuth2 Password flow).

### 2. Patients (`/patients`)

- `POST /patients/` - Register a new patient.
- `GET /patients/` - List all patients (Requires `doctor` authentication).
- `GET /patients/{patient_id}` - Retrieve metadata of a specific patient.

### 3. Reports (`/reports`)

- `POST /reports/upload` - Upload PDF/Image report, run OCR, and persist to database. (Requires `doctor` auth).
- `GET /reports/` - Get list of all uploaded reports.
- `GET /reports/patient/{patient_id}` - Get list of all reports associated with a patient.
- `POST /reports/{report_id}/summarize` - Force generation of a clinical summary using the Summary Agent.

### 4. Prescriptions (`/prescriptions`)

- `POST /prescriptions/extract/{report_id}` - Trigger AI extraction of medicines from report text and store them. (Requires `doctor` auth).

### 5. Interactions (`/interactions`)

- `POST /interactions/patient/{patient_id}` - Run the drug-drug interaction checker on all active patient medicines. (Requires `doctor` auth).

### 6. RAG / Knowledge Base (`/rag`)

- `POST /rag/search` - Directly query the medical knowledge base (ChromaDB) for dosage rules, interaction data, and dictionaries.

### 7. Workflow Orchestration (`/workflow`)

- `POST /workflow/analyze/{report_id}` - Executes the unified coordinator workflow. It automatically runs the OCR parser, structures summaries, extracts medicines, checks interactions, retrieves RAG context, and logs everything to database tables. (Requires `doctor` auth).

### 8. Analytics (`/analytics`)

- `GET /analytics/overview` - Returns high-level metrics of patients, reports, prescriptions, and interactions. (Requires `doctor` auth).
- `GET /analytics/top-medicines` - Top 10 most frequently prescribed medications.
- `GET /analytics/recent-reports` - Fetch the 10 most recently uploaded reports.

---

## Local Setup & Installation

### 1. Prerequisites

Ensure you have the following installed on your machine:

- Python 3.10+
- Tesseract OCR engine (Install and add to system PATH)

### 2. Create Virtual Environment

Run the following commands inside the `backend` folder:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

Install all required libraries:

```bash
pip install fastapi uvicorn sqlalchemy pydantic-settings groq PyMuPDF pytesseract Pillow pandas chromadb python-jose bcrypt python-multipart psycopg2-binary
```

### 4. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/healthcare_db
SECRET_KEY=super-secret-key-for-development
GROQ_API_KEY=your_groq_api_key_here
```

### 5. Initialize the Database Schema

Generate the database tables defined in the SQLAlchemy models:

```bash
python create_tables.py
```

### 6. Ingest Knowledge Base into RAG

Populate the ChromaDB vector database with the drug guidelines and dictionaries:

```bash
python -m app.rag.ingest
```

### 7. Start the Development Server

Start the FastAPI backend server using Uvicorn:

```bash
uvicorn app.main:app --reload
```

The server will run at `http://localhost:8000`. You can access the interactive API docs at `http://localhost:8000/docs`.
