import { Request, Response, NextFunction } from "express";
import { createSupabaseServiceClient } from "../config/supabase.js";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or invalid authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const supabase = createSupabaseServiceClient();
    
    if (!supabase) {
       res.status(500).json({ error: "Supabase client not configured" });
       return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Attach user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};
