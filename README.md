# Campus Cartel

Campus Cartel is now a web-first platform for student-only peer-to-peer renting and reselling inside college clusters.

This repository has been migrated from Bolt/Expo mobile scaffolding to a production-oriented monorepo:

- `frontend`: Next.js + React + Supabase client integration
- `backend`: Node.js + Express + Supabase-aware API service

## Product Direction

Campus Cartel focuses on trust-first campus commerce:

- Student-only onboarding with college domain verification and optional ID checks
- Rent/Buy switch for each listing
- Campus radius discovery for nearby colleges
- Chat-first transactions for meetup and negotiation
- Trust score and rating system (planned)

## Stack

- Frontend: Next.js 15, React 19, TypeScript
- Backend: Express, TypeScript, Zod, Helmet, CORS
- Database/Auth: Supabase (Postgres + Auth + Storage)
- Tooling: npm workspaces, concurrently

## Repository Structure

```text
CampusCartel/
    backend/
        src/
        supabase/
    frontend/
        app/
        components/
        lib/
    DEPLOYMENT.md
    README.md
    package.json
```

## Local Setup

1. Install dependencies

```bash
npm install
```

2. Create environment files

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env.local`

3. Start both services

```bash
npm run dev
```

- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:4000`

## Scripts

- `npm run dev` - run frontend + backend in parallel
- `npm run build` - build both projects
- `npm run lint` - lint both projects
- `npm run typecheck` - typecheck both projects

## MVP Scope Implemented

- Modern web landing page and listings UI shell
- REST API for health, colleges, and listings
- Input validation and centralized error handling
- Supabase-ready service configuration with env-driven setup
- Security baseline (Helmet, CORS, request IDs)

## Planned Next Milestones

1. Supabase Auth with college-email and invite-code gates
2. OCR-based student ID verification workflow
3. Real-time chat with row-level security rules
4. Trust score, rating, and moderation dashboards
5. Enterprise CI/CD, observability, and SLO tracking