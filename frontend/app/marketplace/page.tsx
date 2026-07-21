"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Filter, SlidersHorizontal, MapPin, ChevronDown, Calendar, Zap, Search, ShoppingBag, ShieldCheck, Tag, Laptop, BookOpen, Coffee, Car, Sofa, Package } from "lucide-react";
import { fetchListings } from "../../lib/api";

type FeedMode = "all" | "rent" | "buy";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Electronics": Laptop,
  "Academics": BookOpen,
  "Appliances": Coffee,
  "Vehicles": Car,
  "Furniture": Sofa,
  "Miscellaneous": Package
};

export default function MarketplacePage() {
  const [feedMode, setFeedMode] = useState<FeedMode>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchListings(feedMode)
      .then((data) => {
        if (mounted) {
          setListings(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching listings:", err);
        if (mounted) setLoading(false);
      });
    return () => { mounted = false };
  }, [feedMode]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0c] flex flex-col font-sans">
      {/* ─── GLOBAL TOP BAR ─── */}
      <div className="sticky top-[73px] z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Segmented Control */}
          <div className="flex items-center bg-zinc-100/50 dark:bg-black/50 p-1.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50">
            {(["all", "rent", "buy"] as FeedMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setFeedMode(mode)}
                className={`px-6 py-1.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${
                  feedMode === mode 
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm ring-1 ring-zinc-200/50 dark:ring-zinc-700/50" 
                    : "text-zinc-500 hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
              showFilters 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row px-4 md:px-8 py-10 gap-10">
        
        {/* ─── FILTER SIDEBAR ─── */}
        <aside className={`lg:w-72 flex-shrink-0 transition-all duration-300 ease-in-out ${
          showFilters ? "block" : "hidden lg:block"
        }`}>
          <div className="sticky top-[170px] bg-white dark:bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800/80 p-7 shadow-sm">
            <div className="flex items-center gap-2 font-extrabold text-xl text-foreground mb-8">
              <Filter className="h-5 w-5 text-primary" /> Refine Search
            </div>
            
            <div className="space-y-8">
              {/* Category */}
              <div>
                <h4 className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-4">Categories</h4>
                <div className="space-y-3">
                  {["All Categories", "Academics", "Electronics", "Appliances", "Vehicles", "Furniture"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-5 h-5 rounded-lg border-2 border-zinc-300 dark:border-zinc-700 checked:border-primary checked:bg-primary transition-all cursor-pointer" defaultChecked={cat === "All Categories"} />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800/50" />
              
              {/* Price Range */}
              <div>
                <h4 className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest mb-4">Price Range</h4>
                <input type="range" min="0" max="10000" className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-primary mb-4" />
                <div className="flex items-center justify-between gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl px-4 py-2 text-xs font-bold w-full text-center text-foreground">Min: ₹0</div>
                  <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl px-4 py-2 text-xs font-bold w-full text-center text-foreground">Max: ₹10k+</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── PRODUCT GRID ─── */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="relative flex items-center justify-center w-16 h-16">
                <div className="absolute w-full h-full border-4 border-primary/20 rounded-full"></div>
                <div className="absolute w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="mt-6 text-lg font-bold text-foreground">Discovering premium items...</h3>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((item) => {
              const isRent = item.mode === "rent";
              const accentColor = isRent ? "text-primary border-primary bg-primary/5" : "text-emerald-500 border-emerald-500 bg-emerald-500/5";
              const tagColor = isRent ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600";
              const CategoryIcon = CATEGORY_ICONS[item.category] || Package;

              return (
                <Link 
                  href={`/listings/${item.id}`} 
                  key={item.id} 
                  className="group flex flex-col bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200/80 dark:border-zinc-800/80 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden relative"
                >
                  {/* Premium Subtle Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-50/50 dark:to-zinc-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className={`p-3 rounded-2xl ${accentColor}`}>
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${tagColor}`}>
                      For {item.mode}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow relative z-10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 mb-3">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.college}
                    </div>
                    
                    <h3 className="font-black text-2xl text-foreground leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-6 leading-relaxed">
                      {item.description || "No description provided by the seller."}
                    </p>
                    
                    {/* Price and Action */}
                    <div className="mt-auto pt-5 border-t border-zinc-100 dark:border-zinc-800/50 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-extrabold mb-1">
                          {isRent ? "Rental Rate" : "Asking Price"}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-foreground tracking-tighter">
                            {item.priceLabel.replace('/day', '')}
                          </span>
                          {isRent && (
                            <span className="text-sm font-bold text-zinc-500">
                              /day
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-foreground">Verified</span>
                        </div>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${
                          isRent ? "bg-primary text-white" : "bg-emerald-500 text-white"
                        }`}>
                          <ChevronDown className="h-5 w-5 -rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          )}
          
          {!loading && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-white dark:bg-zinc-900 rounded-[2rem] border border-dashed border-zinc-300 dark:border-zinc-800">
              <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-[1.5rem] flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-3">No premium listings found</h3>
              <p className="text-zinc-500 font-medium">Be the first to list an item in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
