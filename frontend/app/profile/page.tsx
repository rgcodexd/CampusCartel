"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [colleges, setColleges] = useState<Array<any>>([]);
  const [message, setMessage] = useState("");
  const [autoVerifyPossible, setAutoVerifyPossible] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      try {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (mounted && data) {
          setProfile(data);
          setName(data.full_name || "");
          setCollege(data.college || "");
          setPhone(data.phone || "");
          setCollegeEmail(data.college_email || "");
          setStudentId(data.student_id || "");
        }
      } catch (err) {
        // ignore
      }
    });
    // load colleges list from backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/colleges`).then((r) => r.json()).then((j) => setColleges(j.items || [])).catch(() => {});
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    let mounted = true;
    setAutoVerifyPossible(null);
    const email = collegeEmail?.trim();
    if (!email || !email.includes("@")) return;
    const t = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/profiles/check-domain?email=${encodeURIComponent(email)}`)
        .then((r) => r.json())
        .then((j) => {
          if (!mounted) return;
          setAutoVerifyPossible(Boolean(j?.autoVerify));
        })
        .catch(() => {
          if (!mounted) return;
          setAutoVerifyPossible(false);
        });
    }, 400);
    return () => { mounted = false; clearTimeout(t); };
  }, [collegeEmail]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      setMessage("You must be logged in to save your profile.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        id: session.user.id,
        full_name: name,
        college,
        phone,
        college_email: collegeEmail,
        student_id: studentId,
        email: session.user.email,
        is_verified: false,
      };

      const { error } = await supabase.from("profiles").upsert(payload);

      if (error) throw error;
      // attempt auto-verify via backend
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/profiles/auto-verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: session.user.id, college_email: collegeEmail }),
        });
        const j = await res.json();
        if (j?.autoVerified) {
          setMessage("Profile saved and auto-verified.");
          setAutoVerifyPossible(true);
        } else {
          setMessage("Profile saved. Pending verification.");
          setAutoVerifyPossible(false);
        }
      } catch (e) {
        setMessage("Profile saved. Verification check failed.");
      }
    } catch (err: any) {
      setMessage(err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pt-10 pb-16">
      <div className="card-surface rounded-3xl p-8 border">
        <h1 className="font-[var(--font-heading)] text-3xl text-foreground mb-6">Your Profile</h1>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <label className="text-sm font-medium">Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-background border rounded-xl px-4 py-3" />

          <label className="text-sm font-medium">College</label>
          <select value={college} onChange={(e) => setCollege(e.target.value)} className="w-full bg-background border rounded-xl px-4 py-3">
            <option value="">Select your college</option>
            {colleges.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name} — {c.city}</option>
            ))}
          </select>

          <label className="text-sm font-medium">College email (required for verification)</label>
          <input value={collegeEmail} onChange={(e) => setCollegeEmail(e.target.value)} placeholder="you@college.edu" className="w-full bg-background border rounded-xl px-4 py-3" />

          <label className="text-sm font-medium">College / Roll number</label>
          <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 2023CS1001" className="w-full bg-background border rounded-xl px-4 py-3" />

          <label className="text-sm font-medium">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-background border rounded-xl px-4 py-3" />

          {message && <div className="p-3 text-sm bg-muted rounded">{message}</div>}

          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold rounded-xl px-4 py-3 hover:bg-primary/90 transition disabled:opacity-50 mt-2">{loading ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
    </main>
  );
}
