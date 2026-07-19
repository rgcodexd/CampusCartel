"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { createListing, CreateListingPayload } from "../../lib/api";

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<any>(null);

  const [formData, setFormData] = useState<CreateListingPayload>({
    title: "",
    mode: "rent",
    category: "",
    priceLabel: "",
    college: "",
    distanceKm: 0,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
      }
    });
  }, [router]);
  
  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: profile } = await supabase.from("profiles").select("is_verified").eq("id", session.user.id).maybeSingle();
      if (!profile || !profile.is_verified) {
        router.push("/profile");
      }
    })();
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setLoading(true);
    setError("");

    try {
      const studentId = session.user.id;
      // prefer college_email from profiles for verification headers
      const { data: profile } = await supabase.from("profiles").select("college_email").eq("id", studentId).maybeSingle();
      const studentEmail = profile?.college_email || session.user.email || "";

      await createListing(formData, studentId, studentEmail);
      router.push(`/listings?mode=${formData.mode}`);
    } catch (err: any) {
      setError(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "distanceKm" ? parseFloat(value) : value,
    }));
  };

  if (!session) return null;

  return (
    <main className="mx-auto max-w-2xl px-4 pt-10 pb-16">
      <div className="card-surface rounded-3xl p-8 border">
        <h1 className="font-[var(--font-heading)] text-3xl text-foreground mb-6">Post a Listing</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                minLength={4}
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Mini Fridge"
                className="w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="mode" className="block text-sm font-medium text-foreground mb-1">Listing Type</label>
              <select
                id="mode"
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full bg-background border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="rent">Rent</option>
                <option value="buy">Sell</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">Category</label>
              <input
                id="category"
                name="category"
                type="text"
                required
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Appliances"
                className="w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="priceLabel" className="block text-sm font-medium text-foreground mb-1">Price</label>
              <input
                id="priceLabel"
                name="priceLabel"
                type="text"
                required
                value={formData.priceLabel}
                onChange={handleChange}
                placeholder="e.g. ₹50/sem or ₹1000"
                className="w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="college" className="block text-sm font-medium text-foreground mb-1">College Code</label>
              <input
                id="college"
                name="college"
                type="text"
                required
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. NYUS"
                className="w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div className="col-span-2">
              <label htmlFor="distanceKm" className="block text-sm font-medium text-foreground mb-1">Distance (km)</label>
              <input
                id="distanceKm"
                name="distanceKm"
                type="number"
                min="0"
                step="0.1"
                required
                value={formData.distanceKm}
                onChange={handleChange}
                className="w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold rounded-xl px-4 py-3 hover:bg-primary/90 transition disabled:opacity-50 mt-4 shadow-soft"
          >
            {loading ? "Posting..." : "Post Listing"}
          </button>
        </form>
      </div>
    </main>
  );
}

