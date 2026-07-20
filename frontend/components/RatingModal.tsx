"use client";

import { useState } from "react";
import { X, Star } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function RatingModal({ isOpen, onClose, listingId, revieweeId }: { isOpen: boolean, onClose: () => void, listingId: string, revieweeId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("You must be logged in to rate.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          reviewee_id: revieweeId,
          listing_id: listingId,
          rating,
          comment
        })
      });

      if (!res.ok) {
        throw new Error("Failed to submit rating");
      }

      alert("Rating submitted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error submitting rating");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/10">
          <h2 className="text-xl font-black flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
            <Star className="h-6 w-6 fill-current" /> Rate Transaction
          </h2>
          <button onClick={onClose} className="p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex justify-center gap-2 py-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-2 rounded-full transition-all ${rating >= star ? 'text-yellow-500 scale-110' : 'text-zinc-300 dark:text-zinc-700 hover:text-yellow-400'}`}
              >
                <Star className={`h-10 w-10 ${rating >= star ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">Comment (Optional)</label>
            <textarea 
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="How was your experience?"
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-yellow-500 transition-colors resize-none"
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl font-bold bg-yellow-500 text-white hover:bg-yellow-600 active:scale-95 transition-all disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
