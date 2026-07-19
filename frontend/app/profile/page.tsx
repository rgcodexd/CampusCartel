"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

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
        }
      } catch (err) {
        // ignore
      }
    });
    return () => { mounted = false };
  }, []);

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
        email: session.user.email,
      };

      const { error } = await supabase.from("profiles").upsert(payload);

      if (error) throw error;
      setMessage("Profile saved.");
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
          <input value={college} onChange={(e) => setCollege(e.target.value)} className="w-full bg-background border rounded-xl px-4 py-3" />

          <label className="text-sm font-medium">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-background border rounded-xl px-4 py-3" />

          {message && <div className="p-3 text-sm bg-muted rounded">{message}</div>}

          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-bold rounded-xl px-4 py-3 hover:bg-primary/90 transition disabled:opacity-50 mt-2">{loading ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
    </main>
  );
}
