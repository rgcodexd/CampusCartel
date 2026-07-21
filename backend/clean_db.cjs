const { createClient } = require("@supabase/supabase-js");
const { Client } = require('pg');
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const client = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function cleanDatabase() {
  await client.connect();
  const ADMIN_EMAIL = 'rahulkrgupta6744@gmail.com';

  try {
    console.log("Starting database cleanup...");
    
    // 1. Delete all users except the admin from auth.users via SQL
    // This will trigger cascades to profiles and listings if set up, 
    // but we'll manually delete just to be safe.
    console.log("Deleting listings for non-admin users...");
    await client.query(`
      DELETE FROM public.listings 
      WHERE owner_student_id::uuid IN (
        SELECT id::uuid FROM public.profiles WHERE email != $1::text
      );
    `, [ADMIN_EMAIL]);

    console.log("Deleting non-admin profiles...");
    await client.query(`
      DELETE FROM public.profiles WHERE email != $1::text;
    `, [ADMIN_EMAIL]);

    console.log("Deleting non-admin auth users...");
    await client.query(`
      DELETE FROM auth.users WHERE email != $1::text;
    `, [ADMIN_EMAIL]);

    console.log("Database cleanup complete! All garbage data removed.");
  } catch (error) {
    console.error("Failed to clean database:", error);
  } finally {
    await client.end();
  }
}

cleanDatabase();
