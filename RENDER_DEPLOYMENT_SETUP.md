# Render Deployment Setup

This repository is pre-configured with a `render.yaml` Blueprint for easy deployment to [Render.com](https://render.com).

The blueprint defines two services:
1. **Backend Web Service** (Express Node.js)
2. **Frontend Web Service** (Next.js 15)

## Prerequisites

1. A [Render](https://render.com/) account.
2. A [Supabase](https://supabase.com/) project set up with the SQL schema provided in `backend/supabase/schema.sql`.
3. Your GitHub repository linked to your Render account.

## Step-by-Step Deployment

1. **Log in to Render Dashboard:**
   Go to your Render dashboard and click **New+** -> **Blueprint**.

2. **Connect Repository:**
   Select this repository (CampusCartel). Render will automatically detect the `render.yaml` file in the root.

3. **Configure Environment Variables:**
   Render will prompt you for the required environment variables during the blueprint setup. Fill them in:
   
   **For the Backend (`campus-cartel-backend`):**
   - `SUPABASE_URL`: Your Supabase Project URL (e.g., `https://xyz.supabase.co`).
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase `service_role` secret (needed for admin bypass).
   - `DATABASE_URL`: Your Supabase **Transaction Pooler URL** (port 6543). You can find this in your Supabase Database Settings under Connection String.

   **For the Frontend (`campus-cartel-frontend`):**
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase `anon` public key.

4. **Apply and Deploy:**
   Click **Apply**. Render will automatically provision both services and start building them. 
   
   - The backend will build using `npm run build` in the `backend` workspace and start up.
   - The frontend will build using `npm run build` in the `frontend` workspace and start the Next.js server.

5. **Post-Deployment:**
   - Both services have health checks configured (`/api/health` for backend, `/` for frontend) to ensure zero-downtime deployments.
   - Any pushes to the `main` branch will automatically trigger redeployments.

## Note on Scalability
This setup uses the Supabase Transaction Pooler (port 6543). This ensures that your Node.js backend can gracefully handle 10,000+ concurrent connections without exhausting the Postgres database limits.
