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