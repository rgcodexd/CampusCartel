const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' });
client.connect().then(() => client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'colleges'")).then(res => console.log(res.rows)).finally(() => client.end());
