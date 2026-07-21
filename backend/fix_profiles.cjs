const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function fixMissingProfiles() {
  await client.connect();
  try {
    console.log("Adding trigger for new users...");
    await client.query(`
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
    `);

    await client.query(`
      drop trigger if exists on_auth_user_created on auth.users;
      create trigger on_auth_user_created
        after insert on auth.users
        for each row execute procedure public.handle_new_user();
    `);

    console.log("Trigger added. Now backfilling missing profiles...");
    const res = await client.query(`
      insert into public.profiles (id, email)
      select id, email from auth.users
      where id not in (select id from public.profiles)
      on conflict do nothing;
    `);
    
    console.log(`Backfilled ${res.rowCount} profiles.`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

fixMissingProfiles();
