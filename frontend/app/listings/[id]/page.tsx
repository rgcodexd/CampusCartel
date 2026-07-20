"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Tag, User, MapPin, MessageSquare, AlertTriangle } from "lucide-react";
import ReportModal from "@/components/ReportModal";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rentStartDate, setRentStartDate] = useState("");
  const [rentEndDate, setRentEndDate] = useState("");
  const [session, setSession] = useState<any>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const fetchListing = async () => {
      const { data } = await supabase
        .from("listings")
        .select(`
          *,
          owner:profiles!owner_student_id(
            id,
            email,
            trust_score,
            college:colleges!college_id(name)
          )
        `)
        .eq("id", params.id)
        .single();
      
      if (data) setListing(data);
      setLoading(false);
    };

    fetchListing();
  }, [params.id, supabase]);

  const handleAction = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    
    let initialMessage = "";
    if (listing.mode === "rent") {
      if (!rentStartDate || !rentEndDate) {
        alert("Please select dates");
        return;
      }
      initialMessage = `Hi! I'd like to request a rental for ${listing.title} from ${rentStartDate} to ${rentEndDate}.`;
    } else {
      initialMessage = `Hi! I'm interested in buying ${listing.title} for ${listing.price_label}. Is it still available?`;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          listing_id: listing.id,
          seller_id: listing.owner_student_id,
          initial_message: initialMessage
        })
      });
      
      const resData = await response.json();
      if (resData.chat_id) {
        router.push(`/chats/${resData.chat_id}`);
      } else {
        alert(resData.error || "Failed to start chat");
      }
    } catch (err) {
      console.error(err);
      alert("Error starting chat");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;
  if (!listing) return <div className="p-10 text-center text-red-500 font-bold">Listing not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2">
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-3xl h-[400px] flex items-center justify-center relative overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <span className="text-zinc-400 font-medium">Photo Gallery</span>
            <div className={`absolute top-4 left-4 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md ${listing.status === 'Available' ? 'bg-primary' : 'bg-zinc-500'}`}>
              {listing.status}
            </div>
            {session && session.user.id !== listing.owner_student_id && (
              <button 
                onClick={() => setIsReportOpen(true)}
                className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 p-2.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors shadow-sm"
              >
                <AlertTriangle className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="mt-8 space-y-4">
            <h1 className="text-3xl md:text-5xl font-black text-foreground">{listing.title}</h1>
            <p className="text-2xl text-primary font-extrabold">{listing.price_label}</p>
            <div className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 rounded-full font-medium"><Tag className="h-4 w-4"/> {listing.category}</span>
              <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 rounded-full font-medium"><MapPin className="h-4 w-4"/> {listing.college}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <User className="h-7 w-7" />
              </div>
              <div>
                <p className="font-extrabold text-lg">{listing.owner?.email.split('@')[0]}</p>
                <div className="flex items-center text-sm text-zinc-500 mt-0.5">
                  <span className="text-yellow-500 font-bold mr-1.5 text-base">★ {listing.owner?.trust_score}</span>
                  Trust Score
                </div>
              </div>
            </div>
            <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-3.5 rounded-xl flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-primary"/> 
              {listing.owner?.college?.name || listing.college}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-lg border-t-4 border-t-primary">
            {listing.mode === 'rent' ? (
              <div className="space-y-5">
                <h3 className="font-black text-xl">Request Rental</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Start Date</label>
                    <input type="date" value={rentStartDate} onChange={e=>setRentStartDate(e.target.value)} className="w-full mt-1.5 p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">End Date</label>
                    <input type="date" value={rentEndDate} onChange={e=>setRentEndDate(e.target.value)} className="w-full mt-1.5 p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div className="bg-primary/5 text-primary p-4 rounded-xl text-sm font-bold flex justify-between items-center border border-primary/10">
                  <span>Estimated total:</span>
                  <span className="text-lg">Auto-calc</span>
                </div>
                <button onClick={handleAction} disabled={listing.status !== 'Available' || listing.owner_student_id === session?.user?.id} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:pointer-events-none">
                  <MessageSquare className="h-5 w-5"/> Send Request
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="font-black text-xl">Buy Now</h3>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <div className="flex justify-between items-center font-black text-2xl">
                    <span className="text-zinc-500 text-lg">Total</span>
                    <span className="text-primary">{listing.price_label}</span>
                  </div>
                </div>
                <button onClick={handleAction} disabled={listing.status !== 'Available' || listing.owner_student_id === session?.user?.id} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:pointer-events-none">
                  <MessageSquare className="h-5 w-5"/> Contact Seller
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isReportOpen && (
        <ReportModal 
          isOpen={isReportOpen} 
          onClose={() => setIsReportOpen(false)} 
          listingId={listing.id} 
          reportedUserId={listing.owner_student_id} 
        />
      )}
    </div>
  );
}
