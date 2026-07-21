const { createClient } = require("@supabase/supabase-js");
const { faker } = require("@faker-js/faker");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const COLLEGES = [
  "Delhi University", "IIT Delhi", "NIT Delhi", "DTU", "NSUT", 
  "IIIT Delhi", "Amity University", "IP University", "Jamia Millia Islamia"
];

const LISTING_CATEGORIES = [
  "Electronics", "Academics", "Appliances", "Vehicles", "Furniture", "Miscellaneous"
];

const LISTING_TEMPLATES = {
  "Electronics": [
    { title: "MacBook Air M2 256GB", mode: "buy", priceRange: [60000, 80000], desc: "Hardly used MacBook Air M2 in perfect condition. Battery health is at 98%. Comes with original charger and box." },
    { title: "Sony WH-1000XM5 Headphones", mode: "rent", priceRange: [100, 300], desc: "Premium noise-canceling headphones. Perfect for studying in noisy dorms or libraries. Available for daily or weekly rent." },
    { title: "iPad Pro 11-inch with Apple Pencil", mode: "buy", priceRange: [45000, 55000], desc: "Great for taking notes in class. Includes the Apple Pencil 2nd Gen. Minor scratch on the back, screen is flawless." }
  ],
  "Academics": [
    { title: "Engineering Mathematics Vol 1 & 2", mode: "buy", priceRange: [500, 900], desc: "Standard textbooks for first-year engineering students. No highlights or markings on the pages." },
    { title: "Drafting Table & Kit", mode: "rent", priceRange: [50, 150], desc: "Complete drafting kit including the mini drafter, clips, and a portable table. Ideal for architecture or engineering students." },
    { title: "TI-84 Plus Graphing Calculator", mode: "rent", priceRange: [40, 80], desc: "Essential for calculus and statistics courses. Batteries included. Rent for the whole semester or just for exams." }
  ],
  "Appliances": [
    { title: "Mini Refrigerator (45L)", mode: "buy", priceRange: [3000, 5000], desc: "Perfect size for a dorm room. Works perfectly, keeps drinks and snacks very cold. Selling because I am graduating." },
    { title: "Electric Kettle 1.5L", mode: "buy", priceRange: [400, 700], desc: "Boils water in minutes. Great for making Maggi, tea, or coffee during late-night study sessions." },
    { title: "Room Heater (Oil Filled)", mode: "rent", priceRange: [150, 300], desc: "Very effective for winters. Oil-filled radiator so it doesn't dry out the air. Rent it for the winter months!" }
  ],
  "Vehicles": [
    { title: "Hero Sprint Pro Bicycle", mode: "buy", priceRange: [3500, 5500], desc: "21-gear mountain bike. Perfect for getting around large campuses. Recently serviced, new brake pads installed." },
    { title: "Avon Simple City Bike", mode: "rent", priceRange: [30, 60], desc: "Standard non-gear bicycle. Comes with a sturdy lock and a front basket. Great for daily commute to classes." }
  ],
  "Furniture": [
    { title: "Ergonomic Office Chair", mode: "buy", priceRange: [1500, 2500], desc: "Comfortable mesh chair with lumbar support. Helps maintain good posture during long study hours." },
    { title: "Foldable Study Table", mode: "buy", priceRange: [600, 1000], desc: "Wooden finish, easily foldable to save space. Can comfortably fit a laptop and a notebook." }
  ]
};

async function seedMarketplace() {
  console.log("Starting Premium Data Injection...");

  let dummyImageUrl = "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600";
  
  // Try to upload the provided image if it exists in the logs dir
  const logDir = 'C:UsersRahul.geminiantigravity-idebrain816e7d76-6207-4eab-ae19-e73fc5fcbffa.system_generatedlogs';
  try {
    const files = fs.readdirSync(logDir);
    const pngFiles = files.filter(f => f.endsWith('.png') && f.startsWith('media__'));
    if (pngFiles.length > 0) {
      // get the latest one
      pngFiles.sort((a, b) => fs.statSync(path.join(logDir, b)).mtime.getTime() - fs.statSync(path.join(logDir, a)).mtime.getTime());
      const latestImage = path.join(logDir, pngFiles[0]);
      
      const fileBuffer = fs.readFileSync(latestImage);
      const fileName = `dummy_id_${Date.now()}.png`;
      
      console.log("Uploading dummy ID image from user prompt...");
      const { data, error } = await supabase.storage.from('verifications').upload(fileName, fileBuffer, {
        contentType: 'image/png'
      });
      
      if (!error) {
        const { data: publicUrlData } = supabase.storage.from('verifications').getPublicUrl(fileName);
        dummyImageUrl = publicUrlData.publicUrl;
        console.log("Uploaded successfully:", dummyImageUrl);
      } else {
        console.warn("Upload failed, using fallback URL:", error.message);
      }
    }
  } catch (err) {
    console.warn("Could not process local image, using fallback URL.", err.message);
  }

  const generatedUsers = [];

  for (let i = 0; i < 25; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const password = "Password123!";
    
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: `${firstName} ${lastName}` }
    });

    if (authError) {
      console.error(`Failed to create user ${email}:`, authError.message);
      continue;
    }

    const userId = authData.user.id;
    const college = faker.helpers.arrayElement(COLLEGES);
    
    // 2. Update Profile to Premium Verified State
    await supabase.from("profiles").upsert({
      id: userId,
      email,
      full_name: `${firstName} ${lastName}`,
      role: 'user',
      college: college,
      phone: faker.phone.number('+91 9#########'),
      college_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${college.toLowerCase().replace(/ /g, '')}.edu.in`,
      student_id: faker.string.alphanumeric(8).toUpperCase(),
      trust_score: faker.number.float({ min: 4.2, max: 5.0, fractionDigits: 1 }),
      is_verified: true,
      verification_status: 'approved',
      verification_image_url: dummyImageUrl
    });
    
    generatedUsers.push({ id: userId, college });
    console.log(`[${i+1}/25] Created verified user: ${firstName} ${lastName}`);
  }

  // 3. Generate Listings
  console.log("nGenerating listings for users...");
  let totalListings = 0;

  for (const user of generatedUsers) {
    const numListings = faker.number.int({ min: 2, max: 3 });
    
    for (let j = 0; j < numListings; j++) {
      const category = faker.helpers.arrayElement(LISTING_CATEGORIES);
      const templates = LISTING_TEMPLATES[category] || LISTING_TEMPLATES["Electronics"];
      const template = faker.helpers.arrayElement(templates);
      
      const price = faker.number.int({ min: template.priceRange[0], max: template.priceRange[1] });
      const priceLabel = template.mode === 'rent' ? `₹${price}/day` : `₹${price}`;
      
      // We explicitly leave image_url as null as requested ("without image only post product details")
      const { error } = await supabase.from("listings").insert({
        title: template.title,
        mode: template.mode,
        category: category,
        price_label: priceLabel,
        college: user.college,
        distance_km: faker.number.float({ min: 0.1, max: 8.0, fractionDigits: 1 }),
        description: template.desc,
        owner_student_id: user.id
      });

      if (!error) totalListings++;
    }
  }

  console.log(`nSuccessfully injected ${generatedUsers.length} premium users and ${totalListings} listings!`);
}

seedMarketplace();
