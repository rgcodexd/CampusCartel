create extension if not exists postgis;

create table if not exists public.colleges (
  id text primary key,
  name text not null,
  city text not null,
  lat double precision not null,
  lng double precision not null,
  location geography(POINT, 4326),
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

-- Spatial index for colleges
create index if not exists idx_colleges_location on public.colleges using GIST(location);

-- PostGIS RPC for fetching nearby colleges
create or replace function get_colleges_within_radius(
  p_lat double precision,
  p_lng double precision,
  p_radius_km double precision
)
returns table (
  id text,
  name text,
  city text,
  distance_km double precision
)
language sql
stable
as $$
  select 
    c.id, 
    c.name, 
    c.city,
    (ST_Distance(c.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography) / 1000.0) as distance_km
  from public.colleges c
  where ST_DWithin(c.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography, p_radius_km * 1000)
  order by distance_km;
$$;

-- RLS Policies for listings
alter table public.listings enable row level security;

create policy "Public listings are viewable by everyone."
  on public.listings for select
  using ( true );

create policy "Users can insert their own listings."
  on public.listings for insert
  with check ( (auth.uid()::text = owner_student_id) );

create policy "Users can update their own listings."
  on public.listings for update
  using ( (auth.uid()::text = owner_student_id) );

create policy "Users can delete their own listings."
  on public.listings for delete
  using ( (auth.uid()::text = owner_student_id) );