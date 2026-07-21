const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function runMigration() {
  await client.connect();
  try {
    console.log("Adding description and image_url to listings table...");
    await client.query(`
      ALTER TABLE public.listings 
      ADD COLUMN IF NOT EXISTS description text,
      ADD COLUMN IF NOT EXISTS image_url text;
    `);
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runMigration();
