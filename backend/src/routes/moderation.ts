import { Router } from "express";
import { z } from "zod";
import { createSupabaseServiceClient } from "../config/supabase.js";
import { requireAuth } from "../middleware/auth.js";

export const moderationRouter = Router();

const ratingSchema = z.object({
  reviewee_id: z.string().uuid(),
  listing_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

moderationRouter.post("/api/v1/ratings", requireAuth, async (req, res, next): Promise<void> => {
  try {
    const parseResult = ratingSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid payload format", details: parseResult.error });
      return;
    }

    const reviewer_id = (req as any).user.id;
    const { reviewee_id, listing_id, rating, comment } = parseResult.data;

    if (reviewer_id === reviewee_id) {
      res.status(400).json({ error: "Cannot rate yourself" });
      return;
    }

    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    const { error } = await supabase
      .from('user_ratings')
      .insert({
        reviewer_id,
        reviewee_id,
        listing_id,
        rating,
        comment
      });

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

const reportSchema = z.object({
  reported_user_id: z.string().uuid(),
  listing_id: z.string().uuid().optional(),
  reason_category: z.string(),
  description: z.string().optional(),
});

moderationRouter.post("/api/v1/reports", requireAuth, async (req, res, next): Promise<void> => {
  try {
    const parseResult = reportSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: "Invalid payload format", details: parseResult.error });
      return;
    }

    const reporter_id = (req as any).user.id;
    const { reported_user_id, listing_id, reason_category, description } = parseResult.data;

    if (reporter_id === reported_user_id) {
      res.status(400).json({ error: "Cannot report yourself" });
      return;
    }

    const supabase = createSupabaseServiceClient();
    if (!supabase) {
      res.status(500).json({ error: "Supabase client not configured" });
      return;
    }

    const { error } = await supabase
      .from('reports')
      .insert({
        reporter_id,
        reported_user_id,
        listing_id,
        reason_category,
        description,
        status: 'pending'
      });

    if (error) throw error;

    if (listing_id) {
      await supabase.from('listings').update({ status: 'Flagged' }).eq('id', listing_id);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});
