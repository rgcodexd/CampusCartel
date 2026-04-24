# Campus Cartel - Enterprise Deployment Guide

This guide covers production deployment for the website stack:

- Frontend: Next.js (Vercel recommended)
- Backend: Express API (Railway/Render/Fly.io recommended)
- Data/Auth: Supabase

## 1. Infrastructure Targets

- Supabase project for Postgres, Auth, and Storage
- Frontend hosting with global CDN
- Backend hosting with private environment variables
- Domain + TLS for both frontend and API

## 2. Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-frontend-domain.com
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Supabase Setup

1. Create a Supabase project.
2. Run SQL from `backend/supabase/schema.sql`.
3. Enable Email auth and configure allowed domains policy.
4. Add Row Level Security policies for listings and chat tables.

## 4. Build and Verify Locally

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

## 5. Deploy Frontend (Vercel)

1. Import repository in Vercel.
2. Set root to `frontend`.
3. Add all frontend env vars.
4. Deploy and bind custom domain.

## 6. Deploy Backend (Render/Railway/Fly)

1. Set service root to `backend`.
2. Build command: `npm install && npm run build`
3. Start command: `npm run start`
4. Add backend env vars.
5. Restrict inbound traffic and enable health checks on `/health`.

## 7. Enterprise Hardening Checklist

1. Enforce HTTPS and HSTS on all domains.
2. Rotate service-role keys using secret manager.
3. Enable audit logs and request tracing.
4. Configure uptime probes and alerting.
5. Run automated dependency and container scanning.
6. Add backup and restore drills for database snapshots.

## 8. CI/CD Baseline

Run these checks on each pull request:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

Add release jobs that deploy frontend and backend only after checks pass.