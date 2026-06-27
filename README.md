# AI Healthcare Operations Copilot Platform

An enterprise-grade, intelligent clinical workstation designed to optimize healthcare operations. The platform integrates **document OCR**, **multi-agent AI reasoning**, **Retrieval-Augmented Generation (RAG)**, **live database-driven analytical trend reporting**, and **real-time clinical analysis** to assist doctors with report summarization, prescription tracking, and drug-drug interaction safeguards.

---

## Complete Technology Stack

### 1. Frontend Application

- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS v4 & Next Themes (Dark/Light mode support)
- **Animations**: Framer Motion (micro-animations, loader overlays)
- **State Management**: Zustand (local auth state) & TanStack React Query v5 (caching server states)
- **Visual Data**: Recharts (responsive analytics trends)

### 2. Backend API Service

- **Framework**: FastAPI (Asynchronous Python Web Framework)
- **Database & ORM**: PostgreSQL / SQLite with SQLAlchemy ORM
- **Vector Database**: ChromaDB (stores clinical guidelines, interaction rules, and medicine indexes)
- **LLM Engine**: Groq Client (using `llama-3.3-70b-versatile`)
- **Document Processing**: PyMuPDF (PDF parser) & Tesseract OCR + Pillow (Image text extractor)

---

## Platform System Architecture

```mermaid
graph TD
    subgraph Client [Frontend Next.js App]
        A[Browser UI] -->|Axios client + JWT Interceptor| B(Next.js App Router)
    end

    subgraph API [Backend FastAPI Service]
        B -->|REST Requests| C[FastAPI Route Controllers]
        C -->|Security / Role Checks| D{JWT Auth Guard}

        D -->|Valid Doctor/User| E[Business Logic / Services]

        E -->|Store Metadata| F[(SQL Database)]
        E -->|Trigger AI Workflow| G[Coordinator Agent]
        E -->|Trigger OCR| H[OCR Service: PyMuPDF / Tesseract]
    end

    subgraph AI [AI & Knowledge Layer]
        G -->|Summary Prompts| I[Summary Agent]
        G -->|Entity Extraction| J[Prescription Agent]
        G -->|Conflict Analysis| K[Drug Interaction Agent]
        G -->|Vector Query| L[RAG Pipeline]

        I & J & K -->|LLM Requests| M[Groq API: Llama-3.3-70b]
        L -->|Embeddings Search| N[(ChromaDB Vector Store)]
    end

    H -->|Extracted Text| E
```

---

## Master Directory Structure

```text
Healthcare/
├── backend/                # FastAPI Python Backend
│   ├── app/                # Application source code
│   │   ├── agents/         # Coordinator, Summary, Prescription, and Interaction Agents
│   │   ├── api/            # API routers and tag routes (auth, patient, report, etc.)
│   │   ├── core/           # Security keys, JWT hashing, dependencies
│   │   ├── database/       # DB session connections and engines
│   │   ├── models/         # SQLAlchemy DB models (users, patients, reports, etc.)
│   │   ├── prompts/        # System prompts and JSON response templates for LLM
│   │   ├── rag/            # Vector ingestion and retrieval scripts
│   │   ├── schemas/        # Pydantic validation schemas
│   │   └── services/       # OCR parsers, file persistence, Groq API wrappers
│   ├── data/               # Knowledge datasets (CSV guidelines for RAG)
│   ├── chroma_db/          # Persistent ChromaDB store
│   ├── create_tables.py    # Database migrations init script
│   └── readme.md           # Backend specific docs
├── frontend/               # Next.js 16 Web App
│   ├── src/
│   │   ├── app/            # App Router pages (doctor/patient portals, login/register)
│   │   ├── components/     # UI primitives, providers, layouts, dashboard widgets
│   │   ├── hooks/          # React hooks (auth controls)
│   │   ├── services/       # Axios API bindings linking pages to backend endpoints
│   │   ├── store/          # Zustand global stores
│   │   ├── types/          # TypeScript interfaces
│   │   └── globals.css     # Tailwind custom CSS rules
│   └── README.md           # Frontend specific docs
└── README.md               # Master Documentation (this file)
```

---

## Roles & Access Workspaces

The platform uses JWT payloads to enforce security scopes between clinical roles:

- **Doctor Portal** (`/dashboard`, `/patients`, `/reports`, `/prescriptions`, `/interactions`, `/knowledge`, `/analytics`, `/workflow`):
  - Enroll patients and view history timelines.
  - Upload lab reports or prescription documents for OCR parsing.
  - Run AI agents to extract medicines, summarize files, and check cross-interactions.
  - Search clinical rules inside the RAG medical explorer.
  - Track live weekly/monthly operational trends and report category distributions.
- **Patient Portal** (`/patient-dashboard`):
  - Simple, readable views showing active prescriptions, clinical warning banners, and summaries.

---

## Installation & Local Setup

To run the full stack locally, follow these steps:

### Part 1: Start the Backend API

1. **Navigate to the Backend Folder**:

   ```bash
   cd backend
   ```

2. **Setup Virtual Environment**:

   ```bash
   # Create venv
   python -m venv venv
   # Activate venv (Windows)
   venv\Scripts\activate
   # Activate venv (macOS/Linux)
   source venv/bin/activate
   ```

3. **Install Core Requirements**:

   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic-settings groq PyMuPDF pytesseract Pillow pandas chromadb python-jose bcrypt python-multipart psycopg2-binary
   ```

   _(Note: Make sure Tesseract OCR engine is installed on your local host system and added to your environmental PATH)._

4. **Add Environment Config**:
   Create a `.env` file in the `backend/` folder:

   ```env
   DATABASE_URL=postgresql://postgres:admin123@localhost:5432/healthcare_db
   SECRET_KEY=super-secret-key-for-development
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. **Generate Database Tables & Ingest Datasets**:

   ```bash
   # Create tables
   python create_tables.py
   # Load CSV files into ChromaDB
   python -m app.rag.ingest
   ```

6. **Start Uvicorn Server**:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

---

### Part 2: Start the Frontend Application

1. **Navigate to the Frontend Folder** (open a new terminal):

   ```bash
   cd frontend
   ```

2. **Install Node Packages**:

   ```bash
   npm install
   ```

3. **Add Environment Config**:
   Create a `.env.local` file inside the `frontend/` folder:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Launch Dev Server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to start using the platform.

---

## Verification & Production Build

To run production checks and build bundles:

- **Backend Test Connection**:
  Access interactive Swagger API docs at `http://127.0.0.1:8000/docs` to test endpoints manually.
- **Frontend Build Check**:
  ```bash
  cd frontend
  npm run build
  ```
  _(Verifies TypeScript compiler safety and minifies bundles)._
