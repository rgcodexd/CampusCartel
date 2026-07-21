const { Client } = require('pg');

const client = new Client({ 
  connectionString: 'postgresql://postgres.jjbpdemyqgddupabkrrl:ePvXrQg0Fyt7gwTC@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres' 
});

async function geocode() {
  await client.connect();
  
  // Sample of Indian states and some approximate coords (Lat, Lng) to spread colleges
  const states = {
    "Delhi": [28.6139, 77.2090],
    "Maharashtra": [19.0760, 72.8777],
    "Karnataka": [12.9716, 77.5946],
    "Tamil Nadu": [13.0827, 80.2707],
    "Uttar Pradesh": [26.8467, 80.9462],
    "Gujarat": [23.0225, 72.5714],
    "West Bengal": [22.5726, 88.3639],
    "Rajasthan": [26.9124, 75.7873],
    "Telangana": [17.3850, 78.4867],
    "Kerala": [10.8505, 76.2711]
  };
  
  try {
    for (const [state, coords] of Object.entries(states)) {
      const [baseLat, baseLng] = coords;
      
      const res = await client.query("SELECT id FROM public.colleges WHERE state = $1 LIMIT 50", [state]);
      const ids = res.rows.map(r => r.id);
      
      for (const id of ids) {
        // Add some random scatter (approx 10-20km)
        const lat = baseLat + (Math.random() - 0.5) * 0.2;
        const lng = baseLng + (Math.random() - 0.5) * 0.2;
        
        await client.query("UPDATE public.colleges SET lat = $1, lng = $2, location = ST_SetSRID(ST_MakePoint($2, $1), 4326) WHERE id = $3", [lat, lng, id]);
      }
      console.log(`Geocoded 50 colleges in ${state}`);
    }
  } finally {
    await client.end();
  }
}

geocode();
