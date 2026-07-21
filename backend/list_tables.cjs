const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function listTables() {
  await client.connect();
  try {
    const res = await client.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_name = 'profiles'");
    console.log(res.rows);
  } finally {
    await client.end();
  }
}

listTables();
