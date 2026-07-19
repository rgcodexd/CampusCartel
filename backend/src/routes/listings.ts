import { Router } from "express";
import { z } from "zod";
import { AppError } from "../middleware/error-handler.js";
import { requireStudentVerification } from "../middleware/student-auth.js";
import { supabase } from "../supabase/client.js";

const querySchema = z.object({
  mode: z.enum(["rent", "buy"]).optional(),
  q: z.string().optional(),
});

const createListingSchema = z.object({
  title: z.string().min(4),
  mode: z.enum(["rent", "buy"]),
  category: z.string().min(2),
  priceLabel: z.string().min(2),
  college: z.string().min(2),
  distanceKm: z.number().min(0),
});

export const listingsRouter = Router();

listingsRouter.get("/api/v1/listings", async (req, res, next) => {
  try {
    const query = querySchema.parse(req.query);
    const normalizedQ = query.q?.toLowerCase().trim();

    let dbQuery = supabase.from("listings").select("*").order("created_at", { ascending: false });

    if (query.mode) {
      dbQuery = dbQuery.eq("mode", query.mode);
    }

    if (normalizedQ) {
      dbQuery = dbQuery.ilike("title", `%${normalizedQ}%`);
    }

    const { data, error } = await dbQuery;

    if (error) {
      throw new AppError(500, `Database error: ${error.message}`);
    }

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
        owner_student_id: ownerStudentId,
      })
      .select()
      .single();

    if (error) {
      throw new AppError(500, `Database error: ${error.message}`);
    }

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});
