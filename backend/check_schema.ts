import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
  const { data, error } = await supabase.rpc('query', { query: "SELECT column_name FROM information_schema.columns WHERE table_name = 'colleges'" });
  if (error) {
    const { data: qData, error: qErr } = await supabase.from('colleges').select('*').limit(0).csv();
    console.log("CSV Header:", qData);
  } else {
    console.log(data);
  }
}

checkSchema();
