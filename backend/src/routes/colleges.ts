import { Router } from "express";
import { z } from "zod";
import { createSupabaseServiceClient } from "../config/supabase.js";
import { env } from "../config/env.js";

export const collegesRouter = Router();

const collegeSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: z.string(),
  city: z.string(),
  lat: z.number(),
  lng: z.number(),
  domain_extension: z.string(),
});

const ingestSchema = z.array(collegeSchema);

collegesRouter.post("/api/v1/colleges/ingest", async (req, res, next): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`) {
      res.status(401).json({ error: "Unauthorized for ingestion" });
      return;
    }

    const parseResult = ingestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid payload format", details: parseResult.error });
      return;
    }

    const colleges = parseResult.data;
    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    const formattedColleges = colleges.map(c => ({
      id: c.id,
      name: c.name,
      state: c.state,
      city: c.city,
      lat: c.lat,
      lng: c.lng,
      location: `SRID=4326;POINT(${c.lng} ${c.lat})`,
      domain_extension: c.domain_extension
    }));

    const { error } = await supabase
      .from('colleges')
      .upsert(formattedColleges);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, ingested: colleges.length });
  } catch (error) {
    next(error);
  }
});

collegesRouter.get("/api/v1/colleges/search", async (req, res, next): Promise<void> => {
  try {
    const q = req.query.q as string;
    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    if (!q || q.length < 2) {
      res.status(200).json({ items: [] });
      return;
    }

    const { data, error } = await supabase
      .from("colleges")
      .select("id, name, city")
      .ilike("name", `%${q}%`)
      .limit(20);

    if (error) throw error;
    res.status(200).json({ items: data });
  } catch (error) {
    next(error);
  }
});

collegesRouter.get("/api/v1/colleges/nearby", async (req, res, next): Promise<void> => {
  try {
    const { lat, lng, radius_km } = req.query;
    
    if (!lat || !lng || !radius_km) {
      res.status(400).json({ error: "Missing lat, lng, or radius_km parameters" });
      return;
    }

    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    const { data, error } = await supabase.rpc('get_colleges_within_radius', {
      p_lat: parseFloat(String(lat)),
      p_lng: parseFloat(String(lng)),
      p_radius_km: parseFloat(String(radius_km))
    });

    if (error) throw error;

    res.status(200).json({ items: data });
  } catch (error) {
    next(error);
  }
});

collegesRouter.get("/api/v1/colleges/states", async (req, res, next): Promise<void> => {
  try {
    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(500).json({ items: [] });
      return;
    }
    const { data, error } = await supabase.rpc('query', { query: "SELECT DISTINCT state FROM colleges ORDER BY state ASC" });
    if (error) {
      // Fallback if RPC doesn't exist
      const { data: rawData, error: err2 } = await supabase.from('colleges').select('state');
      if (err2) throw err2;
      const states = Array.from(new Set(rawData.map(r => r.state))).filter(Boolean).sort();
      res.status(200).json({ items: states });
      return;
    }
    res.status(200).json({ items: data.map((d: any) => d.state) });
  } catch (error) {
    next(error);
  }
});

collegesRouter.get("/api/v1/colleges", async (req, res, next): Promise<void> => {
  try {
    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(200).json({ items: [] });
      return;
    }
    
    let query = supabase.from('colleges').select('id, name, city, state');
    if (req.query.state) {
      query = query.eq('state', req.query.state);
    }
    
    const { data, error } = await query.limit(500);
    if (error) throw error;
    res.status(200).json({ items: data });
  } catch (error) {
    next(error);
  }
});
