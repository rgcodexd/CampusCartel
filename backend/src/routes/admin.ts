import { Router } from "express";
import { createSupabaseServiceClient } from "../config/supabase.js";

export const adminRouter = Router();

// Middleware to verify admin status
const verifyAdmin = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing authorization header" });
    }

    const svc = createSupabaseServiceClient();
    if (!svc) {
      return res.status(500).json({ error: "Supabase service client not configured" });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await svc.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { data: adminProfile } = await svc.from("profiles").select("role").eq("id", user.id).single();
    if (!adminProfile || adminProfile.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    req.adminUser = user;
    req.supabase = svc;
    next();
  } catch (error) {
    next(error);
  }
};

adminRouter.use("/api/v1/admin", verifyAdmin);

// Get overall metrics
adminRouter.get("/api/v1/admin/metrics", async (req: any, res: any, next: any) => {
  try {
    const svc = req.supabase;
    
    // Total users
    const { count: usersCount } = await svc.from("profiles").select("*", { count: "exact", head: true });
    
    // Total listings
    const { count: listingsCount } = await svc.from("listings").select("*", { count: "exact", head: true });
    
    // Pending verifications
    const { count: pendingCount } = await svc.from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "pending")
      .not("verification_image_url", "is", null);
      
    // Active reports
    const { count: reportsCount } = await svc.from("reports")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    res.status(200).json({
      metrics: {
        users: usersCount || 0,
        listings: listingsCount || 0,
        pendingVerifications: pendingCount || 0,
        reports: reportsCount || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get users
adminRouter.get("/api/v1/admin/users", async (req: any, res: any, next: any) => {
  try {
    const svc = req.supabase;
    const { data, error } = await svc.from("profiles")
      .select("id, email, full_name, role, trust_score, is_verified, verification_status, created_at, student_id, verification_image_url")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    res.status(200).json({ users: data });
  } catch (error) {
    next(error);
  }
});

// Delete user
adminRouter.delete("/api/v1/admin/users/:id", async (req: any, res: any, next: any) => {
  try {
    const svc = req.supabase;
    const targetUserId = req.params.id;

    if (req.adminUser.id === targetUserId) {
      return res.status(400).json({ error: "You cannot delete your own admin account." });
    }
    
    // Delete from auth.users (this will cascade to profiles if properly set up, but we'll manually delete if needed)
    const { error: authError } = await svc.auth.admin.deleteUser(targetUserId);
    
    // We also delete the profile directly just in case cascade is not set
    const { error: profileError } = await svc.from("profiles").delete().eq("id", req.params.id);
    
    if (authError && profileError) throw authError;
    
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Get listings
adminRouter.get("/api/v1/admin/listings", async (req: any, res: any, next: any) => {
  try {
    const svc = req.supabase;
    const { data, error } = await svc.from("listings")
      .select("*, owner_student_id, profiles!owner_student_id(email, full_name)")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    res.status(200).json({ listings: data });
  } catch (error) {
    next(error);
  }
});

// Delete listing
adminRouter.delete("/api/v1/admin/listings/:id", async (req: any, res: any, next: any) => {
  try {
    const svc = req.supabase;
    const { error } = await svc.from("listings").delete().eq("id", req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Get reports
adminRouter.get("/api/v1/admin/reports", async (req: any, res: any, next: any) => {
  try {
    const svc = req.supabase;
    const { data, error } = await svc.from("reports")
      .select(`
        *,
        reporter:profiles!reporter_id(email, full_name),
        reported_user:profiles!reported_user_id(email, full_name)
      `)
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    res.status(200).json({ reports: data });
  } catch (error) {
    next(error);
  }
});

// Resolve report
adminRouter.post("/api/v1/admin/reports/:id/resolve", async (req: any, res: any, next: any) => {
  try {
    const svc = req.supabase;
    const { error } = await svc.from("reports").update({ status: 'resolved' }).eq("id", req.params.id);
    if (error) throw error;
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});
