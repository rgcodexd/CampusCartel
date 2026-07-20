# Render Deployment Setup (Free Tier - No Credit Card)

This guide will walk you through deploying the CampusCartel frontend and backend to [Render.com](https://render.com) manually using the Free Tier, which **does not require a credit card**.

(Note: Using the "Blueprint" feature sometimes prompts for a credit card, which is why we recommend this manual step-by-step setup to bypass it.)

## Prerequisites

1. A [Render](https://render.com/) account.
2. A [Supabase](https://supabase.com/) project set up with the SQL schema provided in `backend/supabase/schema.sql`.
3. Your GitHub repository connected to your Render account.

## Step 1: Deploy the Backend (Web Service)

1. Go to your Render dashboard and click **New+** -> **Web Service**.
2. Select **Build and deploy from a Git repository**.
3. Connect this repository (`CampusCartel`).
4. Configure the service:
   - **Name:** `campus-cartel-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type:** Select the **Free** plan ($0/month).
5. Click **Advanced** and add the following Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `4000`
   - `CORS_ORIGIN`: `https://campus-cartel-frontend.onrender.com` (update this once your frontend is deployed if the name is different)
   - `SUPABASE_URL`: Your Supabase Project URL (e.g., `https://xyz.supabase.co`).
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase `service_role` secret.
   - `DATABASE_URL`: Your Supabase **Transaction Pooler URL** (port 6543). Find this in Supabase Database Settings under Connection String.
6. Set **Health Check Path** to `/api/health`.
7. Click **Create Web Service**.

## Step 2: Deploy the Frontend (Web Service)

1. Go back to your Render dashboard and click **New+** -> **Web Service**. *(Note: Next.js dynamic routing requires a Node.js server, so this must be a Web Service, not a Static Site).*
2. Connect the same repository (`CampusCartel`).
3. Configure the service:
   - **Name:** `campus-cartel-frontend`
   - **Root Directory:** `frontend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type:** Select the **Free** plan ($0/month).
4. Click **Advanced** and add the following Environment Variables:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://campus-cartel-backend.onrender.com`)
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase `anon` public key.
5. Set **Health Check Path** to `/`.
6. Click **Create Web Service**.

## Post-Deployment Notes

- **Spin Downs:** Render's free tier spins down Web Services after 15 minutes of inactivity. When a new request comes in, the service may take 30-60 seconds to wake up.
- **Continuous Deployment:** Any pushes to the `main` branch will automatically trigger redeployments for both services.
