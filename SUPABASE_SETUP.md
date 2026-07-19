# Supabase Setup Guide

This project uses Supabase for PostgreSQL storage, authentication, and client access.

## 1. Create a Supabase project

1. Sign in at https://supabase.com
2. Create a new project.
3. Wait for the project to finish provisioning.

## 2. Get your project credentials

In your Supabase dashboard, go to:

- Project Settings > API

Copy these values:

- Project URL
- anon public key
- service_role secret key

## 3. Configure environment variables

Create the following files if they do not already exist:

### Backend
Create `backend/.env` with:

```env
SUPABASE_URL=https://jjbpdemyqgddupabkrrl.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Frontend
Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jjbpdemyqgddupabkrrl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Apply the database schema

In the Supabase dashboard:

1. Open the SQL Editor.
2. Create a new query.
3. Paste the SQL below.
4. Click Run.

This creates the `public.colleges` and `public.listings` tables used by the app.

```sql
create table if not exists public.colleges (
  id text primary key,
  name text not null,
  city text not null,
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz default now() not null
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  mode text not null check (mode in ('rent', 'buy')),
  category text not null,
  price_label text not null,
  college text not null,
  distance_km numeric(5,2) not null default 0,
  owner_student_id text not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_listings_mode on public.listings(mode);
create index if not exists idx_listings_college on public.listings(college);
create index if not exists idx_listings_created_at on public.listings(created_at desc);
```

You can also find the same SQL in `backend/supabase/schema.sql`.

### Profiles table (optional but recommended)

This app expects a `profiles` table for user profile data. Run this SQL in Supabase SQL Editor to create it:

```sql
create table if not exists public.profiles (
  id text primary key,
  full_name text,
  email text,
  college text,
  phone text,
  college_email text,
  student_id text,
  id_card_url text,
  is_verified boolean default false,
  updated_at timestamptz default now()
);
```

If you prefer, you can store user metadata in Supabase Auth, but the `profiles` table gives more flexibility.

### Auto-verification by domain

You can enable automatic verification when a user supplies a `college_email` that matches an approved domain list. Set the approved domains as a comma-separated env var in your backend `.env`:

```env
APPROVED_COLLEGE_DOMAINS=edu.in,ac.in,mycollege.edu
```

The backend exposes endpoints to check a domain and to attempt auto-verification:

- `GET /api/v1/profiles/check-domain?email=...` — returns `{ autoVerify: true|false }`
- `POST /api/v1/profiles/auto-verify` — body `{ id, college_email }` will set `is_verified=true` when matched

The frontend profile editor uses these endpoints to show verification status and auto-verify after saving.

## 5. Enable authentication (recommended)

In the Supabase dashboard open **Authentication** (left sidebar). Use the menu or the search box (Ctrl+K) to find "Authentication" or "Auth".

1. Sign-in methods (Email)

  - Go to **Authentication → Sign In / Providers** (may be labeled **Sign-in methods**).
  - Toggle **Email** to enable email/password and magic-link sign-in. No extra credentials are required.

2. OAuth providers (Google, GitHub, etc.)

  - Still under **Sign In / Providers**, click a provider (for example **Google**).
  - Follow the provider-specific instructions shown in the modal.
  - For **Google** you will need a Google OAuth Client ID and Client Secret. Create these in Google Cloud Console (APIs & Services → Credentials → Create OAuth 2.0 Client ID). Use the Supabase callback URL shown in the provider modal as the Authorized redirect URI in the Google Console.
  - Paste the **Client ID(s)** and **Client Secret** into the provider modal in Supabase and toggle **Enable**.

  Note: The provider modal shows a **Callback URL (for OAuth)**. Copy that exact URL and add it to your OAuth app configuration in the provider console (Google/GitHub/etc.). Example callback URL format:

  ```text
  https://jjbpdemyqgddupabkrrl.supabase.co/auth/v1/callback
  ```

  Google OAuth quick checklist

  - In Google Cloud Console → APIs & Services → Credentials → Create Credentials → OAuth client ID:
    - Application type: Web application
    - Name: e.g. Campus Cartel Web
    - Authorized JavaScript origins:
      - http://localhost:3000
      - https://jjbpdemyqgddupabkrrl.supabase.co
    - Authorized redirect URIs:
      - https://jjbpdemyqgddupabkrrl.supabase.co/auth/v1/callback
  - Create the client, copy the **Client ID** and **Client secret**, or download the JSON. Store the secret securely — do not commit it.
  - In Google Cloud Console → OAuth consent screen:
    - Keep the app in **Testing** while developing.
    - Add your email as a **Test user** so you can sign in during testing (see your screenshot where you added rahulkrgupta...@gmail.com).

  Paste into Supabase:

  - Authentication → Sign In / Providers → Google
    - `Client IDs`: paste the Google Client ID
    - `Client Secret`: paste the Google Client secret
    - Toggle **Enable** and click **Save**

  Important: ensure the redirect URI registered in Google exactly matches the callback URL Supabase shows (character-for-character). If the Google consent screen is in Testing, only listed test users can sign in until you publish the app.
3. Redirect / URL configuration

  - Open **Authentication → URL Configuration** (or **Settings → URL Configuration**).
  - Add your local development URLs to the **Redirect URLs** (or **Site URL / Allowed URLs**) list, for example:

  ```text
  http://localhost:3000
  http://localhost:3000/auth/callback
  https://jjbpdemyqgddupabkrrl.supabase.co/auth/v1/callback
  https://jjbpdemyqgddupabkrrl.supabase.co
  ```

Troubleshooting tips:

- If you cannot find provider options, verify you are in the correct project and have Owner/Admin permissions.
- If OAuth fails, ensure the callback URL registered in the provider console exactly matches the callback URL Supabase shows.
- Use the Supabase dashboard search (Ctrl+K) and type "Providers" or "Sign In" if menu labels differ.


## 6. Start the app

From the repo root:

```bash
npm install
npm run dev
```

The frontend should run at http://localhost:3000 and the backend at http://localhost:4000.

## 7. Verify

If the setup is correct:

- the backend can connect to Supabase
- the frontend can initialize the Supabase client
- listings and colleges endpoints can read from the database

If you run into issues, double-check that:

- the URLs and keys are copied exactly
- the SQL schema was executed successfully
- the environment files are in the correct folders
