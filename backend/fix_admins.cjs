const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function fixAdmins() {
  await client.connect();
  try {
    console.log("Updating admin verification statuses...");
    await client.query(`
      UPDATE public.profiles
      SET verification_status = 'approved', is_verified = true
      WHERE role = 'admin';
    `);
    console.log("Admins successfully auto-approved.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

fixAdmins();
