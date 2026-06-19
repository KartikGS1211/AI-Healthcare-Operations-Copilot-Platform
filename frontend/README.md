# AI Healthcare Operations Copilot

Enterprise-grade healthcare SaaS dashboard for prescription analysis, patient history summarization, doctor workflows, and operational analytics.

## Tech Stack

- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **ShadCN UI**
- **Lucide React**
- **React Hook Form** + Zod
- **Recharts**
- **next-themes** (light/dark mode)
- **Sonner** (toast notifications)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with KPIs, charts, quick actions |
| `/prescription-analysis` | Upload & analyze prescriptions |
| `/patient-history` | Medical report summarization |
| `/doctor-dashboard` | Patient panel & discharge summary |
| `/analytics` | Operational insights & charts |
| `/settings` | Profile, notifications, appearance |

## Project Structure

```
src/
├── app/(dashboard)/     # App Router pages
├── components/
│   ├── dashboard/       # Reusable domain components
│   ├── layout/          # Sidebar, Navbar, Shell
│   ├── providers/       # Theme provider
│   └── ui/              # ShadCN primitives
├── data/mock-data.ts    # Realistic dummy healthcare data
├── lib/constants.ts     # Navigation & app config
└── types/index.ts       # TypeScript interfaces
```

## Features

- Collapsible sidebar with active route indicators
- Responsive mobile layout with sheet navigation
- Drag-and-drop file upload with progress
- AI processing animations & skeleton loaders
- Drug interaction alerts with risk levels
- Recharts analytics (area, bar, line, pie)
- Toast notifications for success/warning/error
- Light and dark theme support

## Build

```bash
npm run build
npm start
```
