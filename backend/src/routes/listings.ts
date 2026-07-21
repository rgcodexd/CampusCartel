import { Router } from "express";
import { z } from "zod";
import { LRUCache } from "lru-cache";
import { AppError } from "../middleware/error-handler.js";
import { requireStudentVerification } from "../middleware/student-auth.js";
import { supabase } from "../supabase/client.js";

const querySchema = z.object({
  mode: z.enum(["rent", "buy"]).optional(),
  q: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().default(5).optional(),
});

const createListingSchema = z.object({
  title: z.string().min(4),
  mode: z.enum(["rent", "buy"]),
  category: z.string().min(2),
  priceLabel: z.string().min(2),
  college: z.string().min(2),
  distanceKm: z.number().min(0),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const listingsRouter = Router();

// LRU Cache for the get listings endpoint based on query string
const listingsCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 min cache
});

listingsRouter.get("/api/v1/listings", async (req, res, next) => {
  try {
    const query = querySchema.parse(req.query);
    const cacheKey = JSON.stringify(query);

    const cached = listingsCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ items: cached });
    }

    const normalizedQ = query.q?.toLowerCase().trim();
    
    // Default base query
    let dbQuery = supabase.from("listings").select("*");

    // If geolocation is provided, we first find nearby colleges
    if (query.lat !== undefined && query.lng !== undefined) {
      const { data: nearbyColleges, error: rpcError } = await supabase.rpc("get_colleges_within_radius", {
        p_lat: query.lat,
        p_lng: query.lng,
        p_radius_km: query.radiusKm,
      });

      if (rpcError) throw new AppError(500, `Database RPC error: ${rpcError.message}`);

      if (!nearbyColleges || nearbyColleges.length === 0) {
        return res.status(200).json({ items: [] });
      }

      const collegeNames = nearbyColleges.map((c: any) => c.name);
      dbQuery = dbQuery.in("college", collegeNames);
    }

    if (query.mode) {
      dbQuery = dbQuery.eq("mode", query.mode);
    }

    if (normalizedQ) {
      dbQuery = dbQuery.ilike("title", `%${normalizedQ}%`);
    }

    dbQuery = dbQuery.order("created_at", { ascending: false });

    const { data, error } = await dbQuery;

    if (error) {
      throw new AppError(500, `Database error: ${error.message}`);
    }

    listingsCache.set(cacheKey, data);
    res.status(200).json({ items: data });
  } catch (error) {
    next(error);
  }
});

listingsRouter.post("/api/v1/listings", requireStudentVerification, async (req, res, next) => {
  try {
    const payload = createListingSchema.parse(req.body);
    const ownerStudentId = req.header("x-student-id");

    if (!ownerStudentId) {
      throw new AppError(401, "Missing x-student-id header");
    }

    const { data, error } = await supabase
      .from("listings")
      .insert({
        title: payload.title,
        mode: payload.mode,
        category: payload.category,
        college: payload.college,
        price_label: payload.priceLabel,
        distance_km: payload.distanceKm,
        description: payload.description || null,
        image_url: payload.imageUrl || null,
        owner_student_id: ownerStudentId,
      })
      .select()
      .single();

    if (error) {
      throw new AppError(500, `Database error: ${error.message}`);
    }
    
    // Invalidate cache on new insert
    listingsCache.clear();

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});
