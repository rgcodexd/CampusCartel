const { createClient } = require("@supabase/supabase-js");
const { Client } = require('pg');
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const pgClient = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function createListingsBucket() {
  console.log("Creating 'listings' bucket...");
  const { data, error } = await supabase.storage.createBucket('listings', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    fileSizeLimit: 10485760 // 10MB
  });
  
  if (error) {
    if (error.message.includes('already exists')) {
      console.log("Bucket 'listings' already exists.");
    } else {
      console.error("Error creating bucket:", error.message);
      return;
    }
  } else {
    console.log("Created 'listings' bucket successfully:", data);
  }

  await pgClient.connect();
  try {
    console.log("Creating Storage RLS policies for listings bucket...");
    
    await pgClient.query(`
      CREATE POLICY "Allow authenticated uploads to listings"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK ( bucket_id = 'listings' );

      CREATE POLICY "Allow public viewing of listings"
      ON storage.objects FOR SELECT TO public
      USING ( bucket_id = 'listings' );
    `);

    console.log("RLS policies created successfully!");
  } catch (err) {
    if (err.message.includes("already exists")) {
      console.log("Policies already exist.");
    } else {
      console.error("Migration failed:", err);
    }
  } finally {
    await pgClient.end();
  }
}

createListingsBucket();
