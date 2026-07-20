"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function ReportModal({ isOpen, onClose, listingId, reportedUserId }: { isOpen: boolean, onClose: () => void, listingId?: string, reportedUserId: string }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
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
        alert("You must be logged in to report.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          reported_user_id: reportedUserId,
          listing_id: listingId,
          reason_category: reason,
          description: description
        })
      });

      if (!res.ok) {
        throw new Error("Failed to submit report");
      }

      alert("Report submitted successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-red-50 dark:bg-red-950/20">
          <h2 className="text-xl font-black flex items-center gap-2 text-red-600 dark:text-red-500">
            <AlertTriangle className="h-6 w-6" /> Report Activity
          </h2>
          <button onClick={onClose} className="p-2 bg-white/50 dark:bg-black/50 hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2">Reason Category</label>
            <select 
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-red-500 transition-colors"
            >
              <option value="">Select a reason</option>
              <option value="scam">Suspected Scam</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="fake_item">Fake Item / Not as described</option>
              <option value="harassment">Harassment</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea 
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Please provide details..."
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none focus:border-red-500 transition-colors resize-none"
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
