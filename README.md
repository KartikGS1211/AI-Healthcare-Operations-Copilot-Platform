# 🏥 AI Healthcare Operations Copilot Platform

> **An enterprise-grade, full-stack intelligent clinical workstation that automates healthcare operations.** Built to eliminate doctor burnout, prevent medication errors, and empower patient understanding — powered by multi-agent AI, OCR, RAG, and real-time analytics.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Core Problems Solved](#core-problems-solved)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Directory Structure](#directory-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Roles & Access Control](#roles--access-control)
- [Installation & Local Setup](#installation--local-setup)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

---

## Overview

The **AI Healthcare Operations Copilot** is a production-ready, full-stack clinical assistant designed to streamline hospital workflows. It integrates:

- **Document OCR** — extracts structured data from paper prescriptions and lab reports (PDF & image)
- **Multi-Agent AI Reasoning** — a coordinated AI pipeline using Groq's Llama 3.3 70B to summarize, extract, and analyze clinical documents
- **Retrieval-Augmented Generation (RAG)** — injects real verified clinical guidelines and drug interaction rules into every AI output via ChromaDB
- **Live Analytical Dashboards** — tracks weekly/monthly operational KPIs, top medicines, and report category trends
- **Role-Secured Access** — JWT-authenticated portals separated for Doctors and Patients

---

## Problem & Solution

Small clinics often lack proper tools for reviewing patient history and
checking drug safety. Doctors manually go through old reports and
prescriptions, drug-interaction checks are done from memory, and scanned
documents stay unstructured and unsearchable. Enterprise tools (Lexicomp,
Micromedex, full EHRs) solve this but are too expensive for smaller setups.

This platform automates that workflow using a multi-agent AI pipeline:

| Problem                         | Solution                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------- |
| Manual report reading           | OCR (PyMuPDF + Tesseract) extracts text automatically                            |
| No summarization                | Summary Agent (Groq/Llama-3.3-70B) generates clinical summaries                  |
| Inconsistent interaction checks | Interaction Agent + RAG (ChromaDB) flags drug conflicts                          |
| Unstructured data               | Prescription Agent extracts medicines & dosages from OCR text                    |
| No unified view                 | Doctor Portal shows patients, reports, prescriptions & interactions in one place |
| No patient visibility           | Patient Portal shows active meds and safety warnings                             |
| Disconnected tools              | Coordinator Agent runs the full OCR → extract → summarize → check pipeline       |

## Key Features

### 🩺 Doctor Portal

- **Patient Management** — Register, view, and manage patient profiles with complete medical history timelines
- **Report Upload & OCR Parsing** — Upload PDF or image lab reports; Tesseract + PyMuPDF extract raw text instantly
- **One-Click AI Workflow** — Trigger the full coordinator agent pipeline to:
  - Generate a clinical summary
  - Extract all medicines, dosages, frequencies, and durations into structured JSON
  - Run drug-drug interaction analysis with severity ratings and safety warnings
  - Query ChromaDB for RAG-augmented clinical evidence
- **RAG Medical Explorer** — Search the vector knowledge base for dosage guidelines, interaction rules, and drug dictionaries
- **Analytics Dashboard** — View live KPI cards, weekly trend charts, top prescribed medicines, and report distribution breakdowns
- **Prescriptions & Interactions Logs** — Full audit trail of all extracted medicines and flagged drug conflicts

### 🧑‍⚕️ Patient Portal

- Secure, simplified view of active prescriptions and clinical summaries
- Jargon-free daily-language explanations of what each medication is for
- Visual warnings for flagged drug-to-drug conflicts
- Full personal medical history timeline

---

## Technology Stack

### Frontend Application

| Technology                  | Purpose                                                    |
| --------------------------- | ---------------------------------------------------------- |
| **Next.js 16** (App Router) | Full-stack React framework with server-side rendering      |
| **React 19**                | Latest concurrent rendering UI library                     |
| **TypeScript**              | Static type safety across the entire frontend              |
| **Tailwind CSS v4**         | Utility-first styling with CSS variable theming            |
| **next-themes**             | Dark / Light mode support                                  |
| **Framer Motion**           | Micro-animations, loading overlays, and status transitions |
| **Zustand v5**              | Lightweight global auth state management                   |
| **TanStack React Query v5** | Server-state caching, background refetching                |
| **Axios**                   | HTTP client with JWT Bearer token interceptors             |
| **Recharts**                | Responsive Area, Bar, Line, and Pie charts                 |
| **React Hook Form + Zod**   | Type-safe form validation                                  |
| **ShadCN UI / Base UI**     | Accessible, composable component primitives                |
| **Lucide React**            | Clean icon set                                             |
| **Sonner**                  | Toast notification system                                  |

### Backend API Service

| Technology                             | Purpose                                                   |
| -------------------------------------- | --------------------------------------------------------- |
| **FastAPI**                            | Async Python web framework for high-performance REST APIs |
| **SQLAlchemy ORM**                     | Database modeling and query abstraction                   |
| **PostgreSQL**                         | Production-grade relational database                      |
| **SQLite**                             | Lightweight local/dev fallback database                   |
| **ChromaDB**                           | Local vector database for RAG retrieval                   |
| **sentence-transformers**              | Embedding model for vector indexing                       |
| **Groq API (Llama-3.3-70b-versatile)** | Low-latency LLM engine for all AI agent tasks             |
| **PyMuPDF**                            | PDF text extraction and parsing                           |
| **Tesseract OCR + Pillow**             | Image-based text extraction                               |
| **python-jose + bcrypt**               | JWT signing, verification, and password hashing           |
| **Pydantic v2**                        | Request/response validation and settings management       |

### Infrastructure & Deployment

| Technology  | Purpose                                                          |
| ----------- | ---------------------------------------------------------------- |
| **Docker**  | Containerized builds for both frontend and backend services      |
| **Vercel**  | Frontend Next.js hosting and CDN deployment                      |
| **Railway** | Backend FastAPI containerized deployment with managed PostgreSQL |

---

## System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend — Next.js 16 (Vercel)"]
        A[Browser UI] -->|Axios + JWT Interceptor| B(Next.js App Router)
    end

    subgraph API ["Backend — FastAPI (Railway)"]
        B -->|REST Requests| C[FastAPI Route Controllers]
        C -->|Security / Role Checks| D{JWT Auth Guard}
        D -->|Valid Doctor/User| E[Business Logic / Services]
        E -->|Store Metadata| F[(PostgreSQL Database)]
        E -->|Trigger AI Workflow| G[Coordinator Agent]
        E -->|Trigger OCR| H[OCR Service: PyMuPDF / Tesseract]
    end

    subgraph AI ["AI & Knowledge Layer"]
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

## Directory Structure

```text
Healthcare/
├── backend/                         # FastAPI Python Backend
│   ├── app/
│   │   ├── agents/                  # AI Multi-Agent Workflow
│   │   │   ├── coordinator.py       # Orchestrates all sub-agents
│   │   │   ├── summary_agent.py     # Generates clinical summaries
│   │   │   ├── prescription_agent.py# Extracts medicines into structured JSON
│   │   │   ├── interaction_agent.py # Flags drug-drug interaction risks
│   │   │   ├── state.py             # Agent shared state
│   │   │   └── workflow.py          # Workflow entry point
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py          # Register & login endpoints
│   │   │       ├── patient.py       # Patient CRUD operations
│   │   │       ├── reports.py       # Report upload, OCR, summarization
│   │   │       ├── prescription.py  # Medicine extraction & storage
│   │   │       ├── interaction.py   # Drug interaction checker
│   │   │       ├── rag.py           # ChromaDB vector search endpoint
│   │   │       ├── workflow.py      # Full coordinator agent trigger
│   │   │       └── analytics.py     # KPIs, trends, distribution stats
│   │   ├── core/
│   │   │   ├── config.py            # Pydantic settings management
│   │   │   ├── dependencies.py      # Dependency injection (auth guards)
│   │   │   └── security.py          # JWT + password hashing
│   │   ├── database/
│   │   │   ├── base.py              # SQLAlchemy declarative base
│   │   │   ├── connection.py        # Engine connection setup
│   │   │   └── session.py           # Session generator
│   │   ├── models/                  # SQLAlchemy ORM Models
│   │   │   ├── user.py              # User accounts
│   │   │   ├── patient.py           # Patient demographics
│   │   │   ├── report.py            # Uploaded reports & OCR text
│   │   │   ├── prescription.py      # Extracted medicines
│   │   │   └── interaction.py       # Logged drug conflicts
│   │   ├── prompts/                 # LLM system prompt templates
│   │   ├── rag/                     # RAG pipeline
│   │   │   ├── ingest.py            # CSV knowledge base ingestion
│   │   │   ├── embedder.py          # sentence-transformers embeddings
│   │   │   ├── chunker.py           # Text chunking logic
│   │   │   ├── retriever.py         # ChromaDB client interface
│   │   │   └── pipeline.py          # Retrieval orchestration
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── ocr_service.py       # OCR wrappers (PyMuPDF + Tesseract)
│   │   │   ├── groq_service.py      # Groq LLM API integration
│   │   │   └── file_service.py      # File persistence
│   │   └── main.py                  # FastAPI app entrypoint
│   ├── data/                        # Knowledge base CSVs (RAG ingestion)
│   ├── chroma_db/                   # Persistent ChromaDB vector store
│   ├── uploads/                     # Stored uploaded report files
│   ├── create_tables.py             # DB schema initialization script
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Backend container definition
│   └── readme.md                    # Backend-specific documentation
│
├── frontend/                        # Next.js 16 Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (doctor)/            # Doctor-scoped workspaces
│   │   │   │   ├── dashboard/       # Overview KPI panel & quick actions
│   │   │   │   ├── patients/        # Patient enrollment & profile management
│   │   │   │   ├── reports/         # OCR report upload & trigger
│   │   │   │   ├── prescriptions/   # Extracted medicine dosage log
│   │   │   │   ├── interactions/    # Drug conflict & hazard severity log
│   │   │   │   ├── knowledge/       # RAG clinical knowledge explorer
│   │   │   │   ├── analytics/       # Operational charts, KPIs, and trends
│   │   │   │   └── workflow/        # Full AI coordinator workflow trigger
│   │   │   ├── (patient)/           # Patient-scoped portal
│   │   │   │   └── patient-dashboard/ # Prescriptions, summaries, history
│   │   │   ├── login/               # Authentication page
│   │   │   ├── register/            # Sign-up page
│   │   │   └── unauthorized/        # Access-denied handler
│   │   ├── components/
│   │   │   ├── auth/                # Login, register, and guard forms
│   │   │   ├── dashboard/           # KPI cards, charts, and activity widgets
│   │   │   ├── layout/              # Sidebar, header, and page wrappers
│   │   │   ├── providers/           # Theme, QueryClient providers
│   │   │   └── ui/                  # Reusable base UI primitives
│   │   ├── services/                # Axios API binding layer
│   │   │   ├── api.ts               # Base Axios instance + JWT interceptor
│   │   │   ├── auth.service.ts      # Login & register calls
│   │   │   ├── patient.service.ts   # Patient management API
│   │   │   ├── report.service.ts    # Report upload & fetch
│   │   │   ├── prescription.service.ts # Medicine extraction API
│   │   │   ├── interaction.service.ts  # Drug interaction API
│   │   │   ├── rag.service.ts       # Vector search API
│   │   │   ├── analytics.service.ts # Dashboard metrics & trends
│   │   │   └── workflow.service.ts  # Coordinator agent trigger
│   │   ├── store/
│   │   │   └── auth-store.ts        # Zustand auth state & JWT persistence
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── schemas/                 # Zod validation schemas
│   │   ├── types/                   # TypeScript interfaces
│   │   └── lib/                     # Utilities, constants, class merge helpers
│   ├── package.json
│   ├── Dockerfile                   # Frontend container definition
│   └── README.md                    # Frontend-specific documentation
│
└── README.md                        # Master documentation (this file)
```

---

## Database Schema

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

### Authentication (`/auth`)

| Method | Endpoint         | Description                           |
| ------ | ---------------- | ------------------------------------- |
| `POST` | `/auth/register` | Register a new doctor or user account |
| `POST` | `/auth/login`    | Login and receive a JWT Bearer token  |

### Patients (`/patients`)

| Method | Endpoint                 | Description                              |
| ------ | ------------------------ | ---------------------------------------- |
| `POST` | `/patients/`             | Register a new patient                   |
| `GET`  | `/patients/`             | List all patients (Doctor auth required) |
| `GET`  | `/patients/{patient_id}` | Retrieve a specific patient profile      |

### Reports (`/reports`)

| Method | Endpoint                         | Description                                     |
| ------ | -------------------------------- | ----------------------------------------------- |
| `POST` | `/reports/upload`                | Upload PDF/image report, run OCR, persist to DB |
| `GET`  | `/reports/`                      | List all uploaded reports                       |
| `GET`  | `/reports/patient/{patient_id}`  | Get all reports for a patient                   |
| `POST` | `/reports/{report_id}/summarize` | Force-trigger the Summary Agent                 |

### Prescriptions (`/prescriptions`)

| Method | Endpoint                             | Description                           |
| ------ | ------------------------------------ | ------------------------------------- |
| `POST` | `/prescriptions/extract/{report_id}` | AI-extract medicines from report text |

### Interactions (`/interactions`)

| Method | Endpoint                             | Description                                                 |
| ------ | ------------------------------------ | ----------------------------------------------------------- |
| `POST` | `/interactions/patient/{patient_id}` | Run drug-drug interaction checker for all patient medicines |

### RAG / Knowledge Base (`/rag`)

| Method | Endpoint      | Description                                |
| ------ | ------------- | ------------------------------------------ |
| `POST` | `/rag/search` | Query the ChromaDB clinical knowledge base |

### Workflow Orchestration (`/workflow`)

| Method | Endpoint                        | Description                                                                                      |
| ------ | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| `POST` | `/workflow/analyze/{report_id}` | Execute the full coordinator agent pipeline (OCR → Summary → Prescriptions → Interactions → RAG) |

### Analytics (`/analytics`)

| Method | Endpoint                         | Description                                                                      |
| ------ | -------------------------------- | -------------------------------------------------------------------------------- |
| `GET`  | `/analytics/overview`            | High-level KPI metrics (patients, reports, prescriptions, interactions)          |
| `GET`  | `/analytics/top-medicines`       | Top 10 most frequently prescribed medications                                    |
| `GET`  | `/analytics/recent-reports`      | 10 most recently uploaded reports                                                |
| `GET`  | `/analytics/weekly-trends`       | Weekly report, prescription & interaction counts (last 7 days)                   |
| `GET`  | `/analytics/monthly-trends`      | Monthly prescription counts (last 6 months)                                      |
| `GET`  | `/analytics/report-distribution` | Categorical report distribution (Lab, Radiology, Prescription, Discharge, Other) |

---

## Roles & Access Control

JWT payloads carry the user `role` field, which is enforced server-side via FastAPI dependency injection guards.

| Role        | Portal         | Accessible Routes                                                                                                 | Capabilities                                                                                                      |
| ----------- | -------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Doctor**  | Doctor Portal  | `/dashboard`, `/patients`, `/reports`, `/prescriptions`, `/interactions`, `/knowledge`, `/analytics`, `/workflow` | Enroll patients, upload OCR reports, trigger full AI pipeline, search RAG, run interaction checks, view analytics |
| **Patient** | Patient Portal | `/patient-dashboard`                                                                                              | View active prescriptions, clinical summaries, drug conflict warnings, and personal medical history               |

---

## Installation & Local Setup

### Prerequisites

Make sure you have the following installed:

- **Python 3.10+**
- **Node.js v18+** and **npm**
- **PostgreSQL** (or use SQLite for local dev)
- **Tesseract OCR engine** — Install and add to system `PATH`
  - Windows: [tesseract-ocr installer](https://github.com/UB-Mannheim/tesseract/wiki)
  - macOS: `brew install tesseract`
  - Linux: `sudo apt-get install tesseract-ocr`
- A free **[Groq API key](https://console.groq.com/)**

---

### Part 1 — Backend (FastAPI)

**1. Navigate to the backend folder:**

```bash
cd backend
```

**2. Create and activate a virtual environment:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

**3. Install Python dependencies:**

```bash
pip install -r requirements.txt
```

**4. Create the `.env` file** inside `backend/`:

```env
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/healthcare_db
SECRET_KEY=your-super-secret-jwt-key
GROQ_API_KEY=your_groq_api_key_here
```

**5. Initialize the database tables:**

```bash
python create_tables.py
```

**6. Ingest the knowledge base into ChromaDB:**

```bash
python -m app.rag.ingest
```

**7. Start the FastAPI development server:**

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

> The API is now live at `http://127.0.0.1:8000`  
> Interactive Swagger docs: `http://127.0.0.1:8000/docs`

---

### Part 2 — Frontend (Next.js)

**1. Open a new terminal and navigate to the frontend folder:**

```bash
cd frontend
```

**2. Install Node.js packages:**

```bash
npm install
```

**3. Create the `.env.local` file** inside `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**4. Start the development server:**

```bash
npm run dev
```

> The app is now running at `http://localhost:3000`

---

## Deployment

The platform is designed to be deployed as two independent containerized services:

| Service      | Platform | Method                                      |
| ------------ | -------- | ------------------------------------------- |
| **Frontend** | Vercel   | Direct Git integration (Next.js auto-build) |
| **Backend**  | Railway  | Dockerfile-based container deployment       |
| **Database** | Railway  | Managed PostgreSQL instance                 |

### Docker (Local Full-Stack)

Each service has its own `Dockerfile`. To build individually:

```bash
# Backend
cd backend
docker build -t healthcare-backend .
docker run -p 8000:8000 --env-file .env healthcare-backend

# Frontend
cd frontend
docker build -t healthcare-frontend .
docker run -p 3000:3000 healthcare-frontend
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/dbname`) |
| `SECRET_KEY`   | Secret key for JWT signing                                                    |
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com/)                    |

### Frontend (`frontend/.env.local`)

| Variable              | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the FastAPI backend (e.g. `http://localhost:8000`) |

---
