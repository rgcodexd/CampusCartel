const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createBucket() {
  const { data, error } = await supabase.storage.createBucket('verifications', {
    public: true,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
    fileSizeLimit: 5242880 // 5MB
  });
  
  if (error) {
    if (error.message.includes('already exists')) {
      console.log("Bucket 'verifications' already exists.");
    } else {
      console.error("Error creating bucket:", error.message);
    }
  } else {
    console.log("Created 'verifications' bucket successfully:", data);
  }
}

createBucket();
