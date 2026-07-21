const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupAdmin() {
  const email = "rahulkrgupta6744@gmail.com";
  const password = "Rahul@6744#";

  console.log("Setting up admin user...");

  // 1. Try to create the user via admin API
  let { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  });

  if (createError) {
    if (createError.message.includes("already registered")) {
      console.log("User already exists in auth.users, fetching user ID...");
      // Get the existing user
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error("Error listing users:", listError);
        return;
      }
      user = users.users.find(u => u.email === email);
      
      // Update password just in case
      if (user) {
         await supabase.auth.admin.updateUserById(user.id, { password: password });
         console.log("Updated password for existing user.");
      }
    } else {
      console.error("Error creating user:", createError);
      return;
    }
  } else {
    console.log("Created new user in auth.users.");
    user = user.user;
  }

  if (!user) {
    console.error("Could not find or create user.");
    return;
  }

  console.log(`User ID: ${user.id}`);

  // 2. Wait a moment for trigger to create profile (if new)
  await new Promise(r => setTimeout(r, 2000));

  // 3. Ensure the profile exists, if not create it manually
  let { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  
  if (!profile) {
    console.log("Profile not found, creating manually...");
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      role: 'admin',
      is_verified: true,
      full_name: 'Admin'
    });
    if (insertError) console.error("Error creating profile:", insertError);
    else console.log("Profile created with admin role.");
  } else {
    console.log("Profile found, updating to admin role...");
    const { error: updateError } = await supabase.from("profiles").update({ role: 'admin', is_verified: true }).eq("id", user.id);
    if (updateError) console.error("Error updating profile:", updateError);
    else console.log("Profile updated with admin role.");
  }
}

setupAdmin();
