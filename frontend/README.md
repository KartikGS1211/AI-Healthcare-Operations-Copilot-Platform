# AI Healthcare Operations Copilot

Welcome to the frontend application of the **AI Healthcare Operations Copilot Platform**. This application is an enterprise-grade medical dashboard built on **Next.js 16** (App Router), **React 19**, and **Tailwind CSS v4**. It features custom dashboard cards, real-time file upload indicators, interactive clinical agents monitoring, drug-drug interaction alerts, RAG search query panels, and responsive doctor-patient workspaces.

---

## Technology Stack

- **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Type System**: [TypeScript](https://www.typescriptlang.org/)
- **Styling & Theme**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS-variables theme configuration and [next-themes](https://github.com/pacocoursey/next-themes) (Light/Dark mode)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (Micro-interactions & status transitions)
- **Client State Management**: [Zustand](https://github.com/pmndrs/zustand) (Simple, fast global stores)
- **Data Fetching & Caching**: [TanStack React Query v5](https://tanstack.com/query/latest) (Server state syncing)
- **API Client**: [Axios](https://axios-http.com/) (Interceptors handling JWT Bearer tokens)
- **Charts & Analytics**: [Recharts](https://recharts.org/) (Responsive Area, Bar, Line, and Pie charts)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) validation
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/) / [Base UI](https://base-ui.com/) and [Lucide React](https://lucide.dev/) Icons

---

## Project Directory Structure

```text
frontend/
├── public/                 # Static assets (SVGs, icons, logos)
├── src/
│   ├── app/                # Next.js App Router Page hierarchy
│   │   ├── (dashboard)/    # Shared Dashboard pages (legacy/unified views)
│   │   │   ├── analytics/
│   │   │   ├── doctor-dashboard/
│   │   │   ├── patient-history/
│   │   │   ├── prescription-analysis/
│   │   │   └── settings/
│   │   ├── (doctor)/       # Doctor-specific workspaces
│   │   │   ├── analytics/  # Operational graphs, KPIs, and activities
│   │   │   ├── dashboard/  # Main doctor overview & quick actions panel
│   │   │   ├── interactions/# Medicine conflict & hazard severity log
│   │   │   ├── knowledge/  # RAG clinical knowledge base explorer
│   │   │   ├── patients/   # Patient enrollment & profile management
│   │   │   ├── prescriptions/# Extracted medicine dosage & details
│   │   │   ├── reports/    # Uploading reports and OCR parser trigger
│   │   │   ├── settings/   # Custom configurations
│   │   │   └── workflow/   # Triggering multi-agent clinical coordination
│   │   ├── (patient)/      # Patient-specific views
│   │   │   └── patient-dashboard/ # Active prescriptions & medical history summaries
│   │   ├── login/          # Login page (auth routing)
│   │   ├── register/       # Sign-up page (auth routing)
│   │   ├── unauthorized/   # Unauthorized access handler
│   │   ├── globals.css     # Global styles and Tailwind imports
│   │   ├── layout.tsx      # Main application provider setup (Theme, QueryClient)
│   │   └── page.tsx        # Base root index (Redirects based on role)
│   ├── components/         # Reusable UI React components
│   │   ├── auth/           # Login, registration, and guard forms
│   │   ├── dashboard/      # Custom domain components (KPI cards, charts, activity)
│   │   ├── layout/         # Sidebar navigation, header, and page wrappers
│   │   ├── providers/      # Next.js client-side provider wrappers
│   │   └── ui/             # Reusable basic inputs, buttons, sheets, and dialogs
│   ├── data/               # Static mock-data fallbacks
│   ├── hooks/              # Custom React hooks (e.g. state controllers)
│   ├── lib/                # Config constants, utility functions, and styles merger
│   ├── schemas/            # Zod validation schemas (Login, signup)
│   ├── services/           # Backend API clients (Axios bindings)
│   │   ├── api.ts          # Base Axios instance with token interceptor
│   │   ├── auth.service.ts # Register and Login requests
│   │   ├── patient.service.ts  # Patient management
│   │   ├── report.service.ts   # Report upload, fetch, and summarize
│   │   ├── prescription.service.ts # Medicine extractions
│   │   ├── interaction.service.ts  # Drug conflict analysis
│   │   ├── rag.service.ts      # Vector-search queries
│   │   ├── analytics.service.ts# Dashboard metrics & top meds
│   │   └── workflow.service.ts # Triggering coordinate agent flow
│   ├── store/              # Global stores (e.g., Auth token state)
│   │   └── auth-store.ts   # User profile and JWT persistence in local storage
│   └── types/              # TypeScript types & interface declarations
│       └── index.ts        # Custom structures (Patient, Report, Prescription, etc.)
├── components.json         # ShadCN components config
├── next.config.ts          # Next.js compiler settings
├── postcss.config.mjs      # PostCSS styles processor configuration
├── tailwind.config.ts      # Tailwind styling directives
└── tsconfig.json           # TypeScript configuration options
```

---

## Navigation & Roles

The application dynamically renders layouts and controls access using roles stored in the JWT payload:

| User Role   | Accessible Sections                                                                                               | Description                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Doctor**  | `/dashboard`, `/patients`, `/reports`, `/prescriptions`, `/interactions`, `/knowledge`, `/analytics`, `/workflow` | Full capabilities to enroll patients, upload documents, trigger multi-agent AI pipelines, check medication safety, and inspect RAG outputs. |
| **Patient** | `/patient-dashboard`                                                                                              | Streamlined patient portal showing active prescriptions, clinical summaries, and flagged drug conflicts.                                    |

---

## Getting Started

### 1. Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)

### 2. Install Dependencies

Run the following command in the `frontend` directory to install the node packages:

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file inside the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This tells the Axios client where to find the backend API server.

### 4. Running the Development Server

Launch the local Next.js dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

To build and start the optimized production version:

```bash
# Build bundle
npm run build

# Start production server
npm start
```
