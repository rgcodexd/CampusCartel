import { Router } from "express";
import { createSupabaseServiceClient } from "../config/supabase.js";
import { env } from "../config/env.js";

export const profilesRouter = Router();

function parseApprovedDomains(): string[] {
  if (env.APPROVED_COLLEGE_DOMAINS) {
    return env.APPROVED_COLLEGE_DOMAINS.split(",").map((s) => s.trim()).filter(Boolean);
  }
  // fallback domains
  return ["edu.in", "ac.in", "edu", "ac.in"];
}

function emailMatchesDomain(email: string, domain: string) {
  const lower = email.toLowerCase();
  const d = domain.toLowerCase();
  return lower.endsWith("@" + d) || lower.endsWith("." + d);
}

profilesRouter.get("/api/v1/profiles/check-domain", (req, res) => {
  const email = String(req.query.email || "");
  if (!email.includes("@")) return res.status(400).json({ error: "Invalid email" });
  const domains = parseApprovedDomains();
  const ok = domains.some((d) => emailMatchesDomain(email, d));
  res.status(200).json({ autoVerify: ok });
});

profilesRouter.post("/api/v1/profiles/auto-verify", async (req, res, next) => {
  try {
    const { id, college_email } = req.body as { id?: string; college_email?: string };
    if (!id || !college_email) return res.status(400).json({ error: "Missing id or college_email" });

    const domains = parseApprovedDomains();
    const ok = domains.some((d) => emailMatchesDomain(String(college_email), d));

    if (!ok) return res.status(200).json({ autoVerified: false });

    const svc = createSupabaseServiceClient();
    if (!svc) return res.status(500).json({ error: "Supabase service client not configured" });

    const { data, error } = await svc.from("profiles").update({ is_verified: true }).eq("id", id).select().single();
    if (error) throw error;

    res.status(200).json({ autoVerified: true, profile: data });
  } catch (err) {
    next(err);
  }
});

profilesRouter.get("/api/v1/profiles/pending-verification", async (req, res, next): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Missing authorization header" });
      return;
    }

    const svc = createSupabaseServiceClient();
    if (!svc) {
      res.status(500).json({ error: "Supabase service client not configured" });
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await svc.auth.getUser(token);
    
    if (authError || !user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const { data: adminProfile } = await svc.from("profiles").select("role").eq("id", user.id).single();
    if (!adminProfile || adminProfile.role !== 'admin') {
      res.status(403).json({ error: "Forbidden: Admins only" });
      return;
    }

    const { data: pending, error } = await svc
      .from("profiles")
      .select("*")
      .eq("verification_status", "pending")
      .not("verification_image_url", "is", null);

    if (error) throw error;
    res.status(200).json({ items: pending });
  } catch (err) {
    next(err);
  }
});

profilesRouter.post("/api/v1/profiles/verify/:id", async (req, res, next): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Missing authorization header" });
      return;
    }

    const svc = createSupabaseServiceClient();
    if (!svc) {
      res.status(500).json({ error: "Supabase service client not configured" });
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await svc.auth.getUser(token);
    
    if (authError || !user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const { data: adminProfile } = await svc.from("profiles").select("role").eq("id", user.id).single();
    if (!adminProfile || adminProfile.role !== 'admin') {
      res.status(403).json({ error: "Forbidden: Admins only" });
      return;
    }

    const profileId = req.params.id;
    const { status } = req.body; // 'approved' or 'rejected'
    
    if (status !== 'approved' && status !== 'rejected') {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const updateData: any = { verification_status: status };
    if (status === 'approved') {
      updateData.is_verified = true;
    }

    const { data, error } = await svc.from("profiles").update(updateData).eq("id", profileId).select().single();
    if (error) throw error;

    res.status(200).json({ success: true, profile: data });
  } catch (err) {
    next(err);
  }
});
