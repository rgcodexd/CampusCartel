const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function migrate() {
  await client.connect();
  try {
    console.log("Adding columns to colleges...");
    await client.query(`ALTER TABLE public.colleges ADD COLUMN IF NOT EXISTS state text;`);
    
    console.log("Creating profiles table if not exists...");
    await client.query(`
      create table if not exists public.profiles (
        id uuid primary key,
        email text,
        trust_score numeric(3,2) default 5.00,
        is_verified boolean default false,
        college_id text references public.colleges(id),
        created_at timestamptz default now() not null,
        full_name text,
        college text,
        phone text,
        college_email text,
        student_id text,
        role text default 'user',
        verification_image_url text,
        verification_status text default 'pending'
      );
    `);
    
    console.log("Updating admin user...");
    await client.query(`UPDATE public.profiles SET role = 'admin' WHERE email = 'rahulkrgupta6744@gmail.com';`);
    
    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

migrate();
