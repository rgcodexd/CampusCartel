"use client";
import React, { useState } from "react";
import { Filter, SlidersHorizontal, MapPin, ChevronDown, Calendar, Zap, Star, Search } from "lucide-react";
import { TrustBadge } from "../../components/trust-badge";

type FeedMode = "all" | "rent" | "buy";

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Sony WH-1000XM5 Headphones",
    category: "Electronics",
    mode: "rent",
    price: 149,
    seller: { name: "Aarav M.", trustScore: 4.9 },
    location: "IIT Delhi • 1.2km",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    title: "Engineering Drawing Kit",
    category: "Academics",
    mode: "buy",
    price: 499,
    seller: { name: "Priya S.", trustScore: 4.7 },
    location: "NIT Delhi • 3.4km",
    image: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "3",
    title: "MacBook Air M2",
    category: "Electronics",
    mode: "rent",
    price: 799,
    seller: { name: "Rohan D.", trustScore: 5.0 },
    location: "DTU • 5.1km",
    image: "https://images.unsplash.com/photo-1664478546384-d57ffe74a78c?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "4",
    title: "Mini Refrigerator (45L)",
    category: "Appliances",
    mode: "buy",
    price: 4500,
    seller: { name: "Neha K.", trustScore: 4.6 },
    location: "IIIT Delhi • 2.8km",
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "5",
    title: "Graphing Calculator TI-84 Plus",
    category: "Academics",
    mode: "rent",
    price: 50,
    seller: { name: "Vikram S.", trustScore: 4.1 },
    location: "NSUT • 4.2km",
    image: "https://images.unsplash.com/photo-1574607383476-f517f260d30b?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "6",
    title: "Bicycle - Hero Sprint",
    category: "Vehicles",
    mode: "buy",
    price: 3200,
    seller: { name: "Arjun P.", trustScore: 4.3 },
    location: "IIT Delhi • 0.5km",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600",
  }
];

export default function MarketplacePage() {
  const [feedMode, setFeedMode] = useState<FeedMode>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter listings based on segmented control
  const filteredListings = MOCK_LISTINGS.filter((item) => {
    if (feedMode === "all") return true;
    return item.mode === feedMode;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex flex-col">
      {/* ─── GLOBAL TOP BAR ─── */}
      <div className="sticky top-[73px] z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Segmented Control */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl shadow-inner border border-zinc-200/50 dark:border-zinc-800/50">
            {(["all", "rent", "buy"] as FeedMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setFeedMode(mode)}
                className={`px-5 py-1.5 rounded-lg text-sm font-bold capitalize transition-all duration-300 ${
                  feedMode === mode 
                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700" 
                    : "text-zinc-500 hover:text-foreground hover:bg-zinc-200/50 dark:hover:bg-zinc-900"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              showFilters ? "bg-primary text-white shadow-md" : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row px-4 md:px-8 py-8 gap-8">
        
        {/* ─── FILTER SIDEBAR ─── */}
        <aside className={`lg:w-64 flex-shrink-0 transition-all duration-300 ease-in-out ${
          showFilters ? "block" : "hidden lg:block"
        }`}>
          <div className="sticky top-[160px] bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 font-extrabold text-lg text-foreground mb-6">
              <Filter className="h-5 w-5 text-primary" /> Refine
            </div>
            
            <div className="space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Categories</h4>
                <div className="space-y-2">
                  {["All Categories", "Academics", "Electronics", "Appliances", "Vehicles"].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="rounded-md border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary/50 bg-transparent transition-all cursor-pointer" defaultChecked={cat === "All Categories"} />
                      <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-foreground transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800" />
              
              {/* Price Range */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Price Range</h4>
                <input type="range" min="0" max="10000" className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary mb-3" />
                <div className="flex items-center justify-between gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold w-full text-center">Min: ₹0</div>
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-semibold w-full text-center">Max: ₹10k+</div>
                </div>
              </div>

              <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800" />
              
              {/* Sort By */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Sort By</h4>
                <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 cursor-pointer hover:border-primary/50 transition-colors">
                  <span className="text-sm font-semibold text-foreground">Nearest First</span>
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ─── PRODUCT GRID ─── */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((item) => {
              const isRent = item.mode === "rent";
              const priceSuffix = isRent ? "/ day" : "fixed";
              const actionBg = isRent ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600";
              const priceLabel = isRent ? "Rental Rate" : "Asking Price";

              return (
                <div key={item.id} className="group flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
                  {/* Image Container */}
                  <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800/50 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md shadow-sm border ${
                        isRent 
                          ? "bg-primary/90 border-primary text-white" 
                          : "bg-emerald-500/90 border-emerald-500 text-white"
                      }`}>
                        For {item.mode}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-500 mb-2">
                      <MapPin className="h-3 w-3" />
                      {item.location}
                    </div>
                    
                    <h3 className="font-extrabold text-lg text-foreground line-clamp-1 mb-4 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="mt-auto flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mb-0.5">
                          {priceLabel}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl font-black text-foreground tracking-tight">
                            ₹{item.price}
                          </span>
                          <span className="text-xs font-semibold text-zinc-500">
                            {priceSuffix}
                          </span>
                        </div>
                      </div>

                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner ${actionBg}`}>
                        {isRent ? <Calendar className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Trust Badge Footer */}
                  <div className="px-5 py-3 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/80 dark:bg-zinc-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                        {item.seller.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-foreground">{item.seller.name}</span>
                    </div>
                    <TrustBadge trustScore={item.seller.trustScore} />
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredListings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800">
              <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No listings found</h3>
              <p className="text-zinc-500 font-medium">Try adjusting your filters or search mode.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
