import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const API_KEY = "579b464db66ec23bdd0000011b8fe976fc3a45844d3beada6deacef4";
const RESOURCE_ID = "44bea382-c525-4740-8a07-04bd20a99b52";
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json`;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface GovCollege {
  s_no_: string;
  university_name: string;
  college_name: string;
  college_type: string;
  state_name: string;
  district_name: string;
}

async function fetchAndIngest() {
  const limit = 5000;
  let offset = 0;
  let hasMore = true;

  console.log("Starting data.gov.in ingestion...");

  while (hasMore) {
    console.log(`Fetching offset ${offset}...`);
    try {
      const url = `${BASE_URL}&limit=${limit}&offset=${offset}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      const records: GovCollege[] = data.records || [];
      if (records.length === 0) {
        hasMore = false;
        break;
      }

      console.log(`Fetched ${records.length} records. Ingesting to Supabase...`);

      // Format for Supabase
      const formattedColleges = records.map((c) => ({
        // Create a unique ID using S.No. and district to prevent conflicts
        id: `gov_${c.s_no_}`,
        name: c.college_name || "Unknown College",
        city: c.district_name || "Unknown City",
        state: c.state_name || "Unknown State",
        lat: 0,
        lng: 0,
      }));

      // Ingest in batches of 1000 to prevent payload too large errors
      const batchSize = 1000;
      for (let i = 0; i < formattedColleges.length; i += batchSize) {
        const batch = formattedColleges.slice(i, i + batchSize);
        const { error } = await supabase.from("colleges").upsert(batch, { onConflict: "id" });
        if (error) {
          console.error("Supabase upsert error:", error.message);
        }
      }

      offset += limit;
      
      // Stop early if we have fetched all (the API has around 38k records)
      if (records.length < limit) {
        hasMore = false;
      }
    } catch (err) {
      console.error("Error during ingestion:", err);
      break;
    }
  }

  console.log("Finished ingestion!");
}

fetchAndIngest();
