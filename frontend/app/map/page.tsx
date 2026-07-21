"use client";

import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { MapPin, Search } from "lucide-react";

// Dynamically import Map component to avoid SSR issues with Leaflet
const MapWithNoSSR = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center">
      <MapPin className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-4 animate-bounce" />
      <div className="text-zinc-500 font-medium">Loading Map...</div>
    </div>
  )
});

export default function MapPage() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/colleges/states`)
      .then(res => res.json())
      .then(data => setStates(data.items || []))
      .catch(console.error);
      
    // Fetch initial batch of colleges that have coordinates
    fetchColleges("");
  }, []);

  const fetchColleges = async (stateParam: string) => {
    setLoading(true);
    try {
      const url = stateParam 
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/colleges?state=${encodeURIComponent(stateParam)}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/colleges`;
        
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        // Filter out colleges with 0,0 coordinates since they won't look good on the map
        setColleges(data.items.filter((c: any) => c.lat !== 0 && c.lng !== 0) || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedState(val);
    fetchColleges(val);
  };

  const filteredColleges = colleges.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-7xl px-4 pt-6 pb-6 h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="font-[var(--font-heading)] text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Campus Map Explorer</h1>
          <p className="text-zinc-500 mt-1">Discover colleges and nearby listings on the map.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2.5 shadow-sm min-w-[200px]">
            <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search colleges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-foreground"
            />
          </div>
          <select 
            value={selectedState} 
            onChange={handleStateChange}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary shadow-sm"
          >
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      
      <div className="flex-1 min-h-[500px] relative rounded-2xl shadow-xl shadow-primary/5">
        <MapWithNoSSR colleges={filteredColleges} />
        
        {/* Floating overlay with stats */}
        <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-lg pointer-events-none">
          <div className="text-sm font-bold">{loading ? "Loading..." : `${filteredColleges.length} Campuses`}</div>
          <div className="text-xs text-zinc-500">Currently visible on map</div>
        </div>
      </div>
    </main>
  );
}
