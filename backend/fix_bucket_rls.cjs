const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function fixBucketRLS() {
  await client.connect();
  try {
    console.log("Creating Storage RLS policies for verifications bucket...");
    
    // We need to allow inserts (uploads) to the verifications bucket by authenticated users.
    await client.query(`
      CREATE POLICY "Allow authenticated uploads to verifications"
      ON storage.objects FOR INSERT TO authenticated
      WITH CHECK ( bucket_id = 'verifications' );

      CREATE POLICY "Allow authenticated viewing of verifications"
      ON storage.objects FOR SELECT TO authenticated
      USING ( bucket_id = 'verifications' );
    `);

    console.log("RLS policies created successfully!");
  } catch (err) {
    if (err.message.includes("already exists")) {
      console.log("Policies already exist.");
    } else {
      console.error("Migration failed:", err);
    }
  } finally {
    await client.end();
  }
}

fixBucketRLS();
