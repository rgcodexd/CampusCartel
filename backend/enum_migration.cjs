const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function makeRoleEnum() {
  await client.connect();
  try {
    console.log("Creating user_role enum...");
    await client.query(`DO $$ BEGIN
      CREATE TYPE public.user_role AS ENUM ('user', 'admin');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`);
    
    console.log("Altering profiles table to use user_role...");
    await client.query(`ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;`);
    await client.query(`ALTER TABLE public.profiles ALTER COLUMN role TYPE public.user_role USING role::public.user_role;`);
    await client.query(`ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user'::public.user_role;`);

    console.log("Done.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

makeRoleEnum();
