create extension if not exists postgis;

create table if not exists public.colleges (
  id text primary key,
  name text not null,
  state text not null,
  city text not null,
  lat double precision not null,
  lng double precision not null,
  location geography(POINT, 4326),
  domain_extension text not null,
  created_at timestamptz default now() not null
);

create type user_role as enum ('user', 'admin');

create table if not exists public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  phone text,
  college text,
  college_email text,
  student_id text,
  trust_score numeric(3,2) default 5.00,
  is_verified boolean default false,
  college_id text references public.colleges(id),
  role user_role default 'user',
  verification_image_url text,
  verification_status text default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
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
  owner_student_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'Available',
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
  state text,
  city text,
  domain_extension text,
  distance_km double precision
)
language sql
stable
as $$
  select 
    c.id, 
    c.name, 
    c.state,
    c.city,
    c.domain_extension,
    (ST_Distance(c.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography) / 1000.0) as distance_km
  from public.colleges c
  where ST_DWithin(c.location, ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography, p_radius_km * 1000)
  order by distance_km;
$$;



-- User Ratings
create table if not exists public.user_ratings (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references public.profiles(id) not null,
  reviewee_id uuid references public.profiles(id) not null,
  listing_id uuid references public.listings(id) not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now() not null
);

-- Reports
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) not null,
  reported_user_id uuid references public.profiles(id) not null,
  listing_id uuid references public.listings(id),
  reason_category text not null,
  description text,
  status text default 'pending' check (status in ('pending', 'under_review', 'resolved')),
  created_at timestamptz default now() not null
);

-- Trust Score Trigger
create or replace function update_trust_score()
returns trigger as $$
declare
  avg_score numeric(3,2);
begin
  select avg(rating) into avg_score
  from public.user_ratings
  where reviewee_id = new.reviewee_id;
  
  update public.profiles
  set trust_score = coalesce(avg_score, 5.00)
  where id = new.reviewee_id;
  
  return new;
end;
$$ language plpgsql;

create or replace trigger on_rating_inserted
after insert or update on public.user_ratings
for each row
execute function update_trust_score();

-- RLS
alter table public.listings enable row level security;

alter table public.user_ratings enable row level security;
alter table public.reports enable row level security;
alter table public.profiles enable row level security;

-- Listings RLS
create policy "Public listings are viewable by everyone." on public.listings for select using ( status != 'Flagged' );
create policy "Users can insert their own listings." on public.listings for insert with check ( auth.uid() = owner_student_id );
create policy "Users can update their own listings." on public.listings for update using ( auth.uid() = owner_student_id );
create policy "Users can delete their own listings." on public.listings for delete using ( auth.uid() = owner_student_id );

-- Profiles RLS
create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can update their own profile." on public.profiles for update using ( auth.uid() = id );



-- Ratings RLS
create policy "Ratings are viewable by everyone." on public.user_ratings for select using ( true );
create policy "Users can insert ratings." on public.user_ratings for insert with check ( auth.uid() = reviewer_id );

-- Reports RLS
create policy "Users can view their own reports." on public.reports for select using ( auth.uid() = reporter_id );
create policy "Users can insert reports." on public.reports for insert with check ( auth.uid() = reporter_id );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
