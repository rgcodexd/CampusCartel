"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal, X, MapPin } from "lucide-react";

/* ── Mock product data ── */
const allProducts = [
  { id: "1", title: "MacBook Air M1", mode: "rent" as const, price: "₹499", suffix: "/day", college: "Hindu College", rating: 4.8, reviews: 32, category: "electronics", image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=400&fmt=webp" },
  { id: "2", title: "iPhone 12 128GB", mode: "buy" as const, price: "₹32,999", suffix: "", college: "SRCC", rating: 4.6, reviews: 18, category: "electronics", image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-blue-select-2020?wid=400&fmt=webp" },
  { id: "3", title: "Study Table", mode: "rent" as const, price: "₹299", suffix: "/month", college: "Miranda House", rating: 4.3, reviews: 75, category: "furniture", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=400" },
  { id: "4", title: "Physics Textbook Set", mode: "buy" as const, price: "₹499", suffix: "", college: "Hindu College", rating: 4.7, reviews: 12, category: "books", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400" },
  { id: "5", title: "Royal Enfield Classic 350", mode: "rent" as const, price: "₹799", suffix: "/day", college: "LSR", rating: 4.5, reviews: 9, category: "bikes", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=400" },
  { id: "6", title: "Samsung Refrigerator", mode: "buy" as const, price: "₹11,999", suffix: "", college: "NSUT", rating: 4.3, reviews: 45, category: "appliances", image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=400" },
  { id: "7", title: "Nike Running Shoes", mode: "buy" as const, price: "₹2,499", suffix: "", college: "Delhi University", rating: 4.6, reviews: 16, category: "fashion", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" },
  { id: "8", title: "Volleyball", mode: "rent" as const, price: "₹59", suffix: "/day", college: "SRCC", rating: 4.4, reviews: 8, category: "sports", image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=400" },
];

const categories = ["All", "Books", "Electronics", "Furniture", "Bikes", "Appliances", "Fashion", "Sports", "Other"];

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [typeFilter, setTypeFilter] = useState<"all" | "rent" | "buy">("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = allProducts.filter((p) => {
    if (selectedCategory !== "All" && p.category !== selectedCategory.toLowerCase()) return false;
    if (typeFilter !== "all" && p.mode !== typeFilter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 md:px-8">
      <div className="flex gap-6">
        {/* ── Sidebar Filters ── */}
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-72 lg:w-64 flex-shrink-0
          bg-white dark:bg-surface border-r lg:border lg:rounded-2xl
          p-6 overflow-y-auto
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-[var(--font-heading)] text-lg font-bold text-foreground">Filters</h2>
            <button className="text-xs text-primary font-semibold hover:underline" onClick={() => { setSearch(""); setSelectedCategory("All"); setTypeFilter("all"); }}>
              Clear all
            </button>
            <button className="lg:hidden p-1" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-foreground mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for items..."
                className="w-full bg-background border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-foreground mb-2 block">Category</label>
            <div className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === cat
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range (visual only) */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-foreground mb-2 block">Price Range</label>
            <input type="range" min="0" max="50000" className="w-full accent-primary" />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>₹0</span>
              <span>₹50,000+</span>
            </div>
          </div>

          {/* Type */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-foreground mb-2 block">Type</label>
            <div className="flex flex-col gap-2">
              {(["all","rent","buy"] as const).map((t) => (
                <label key={t} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={typeFilter === t}
                    onChange={() => setTypeFilter(t)}
                    className="accent-primary w-4 h-4"
                  />
                  {t === "all" ? "All" : t === "rent" ? "Rent" : "Buy"}
                </label>
              ))}
            </div>
          </div>

          {/* Campus Radius (visual) */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-foreground mb-2 block">Campus Radius</label>
            <select className="w-full bg-background border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
              <option>Within 5 km</option>
              <option>Within 10 km</option>
              <option>Within 25 km</option>
              <option>Any distance</option>
            </select>
          </div>

          <button className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition shadow-sm text-sm">
            Apply Filters
          </button>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="font-[var(--font-heading)] text-2xl font-bold text-foreground">All Listings</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{filtered.length.toLocaleString()} items found</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              <select className="bg-white dark:bg-surface border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none">
                <option>Sort by: Recently Added</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
              <button className="p-2 border rounded-lg bg-primary/10 text-primary"><LayoutGrid className="h-4 w-4" /></button>
              <button className="p-2 border rounded-lg bg-white dark:bg-surface text-muted-foreground hover:bg-muted transition"><List className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground text-sm">No items match your filters. Try adjusting your criteria.</p>
              </div>
            )}
            {filtered.map((item) => (
              <Link key={item.id} href={`/browse/${item.id}`} className="group">
                <article className="bg-white dark:bg-surface rounded-2xl border overflow-hidden shadow-sm hover:shadow-floating transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-44 bg-muted flex items-center justify-center p-4">
                    <img src={item.image} alt={item.title} className="h-full max-w-full object-contain" />
                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      item.mode === "rent" ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-600"
                    }`}>
                      {item.mode === "rent" ? "For Rent" : "For Sale"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition truncate">{item.title}</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-bold text-foreground">{item.price}</span>
                      {item.suffix && <span className="text-xs text-muted-foreground">{item.suffix}</span>}
                    </div>
                    <div className="flex justify-between items-center mt-2 text-[11px] text-muted-foreground">
                      <span>{item.college}</span>
                      <span className="flex items-center text-amber-500 font-semibold">
                        <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
                        {item.rating} ({item.reviews})
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1.5 mt-10">
            <button className="p-2 rounded-lg border bg-white dark:bg-surface hover:bg-muted transition text-muted-foreground"><ChevronLeft className="h-4 w-4" /></button>
            {[1,2,3,4,5].map(n => (
              <button key={n} className={`w-9 h-9 rounded-lg text-sm font-medium transition ${n === 1 ? "bg-primary text-white" : "border bg-white dark:bg-surface hover:bg-muted text-foreground"}`}>
                {n}
              </button>
            ))}
            <span className="text-muted-foreground text-sm mx-1">…</span>
            <button className="w-9 h-9 rounded-lg text-sm font-medium border bg-white dark:bg-surface hover:bg-muted text-foreground">20</button>
            <button className="p-2 rounded-lg border bg-white dark:bg-surface hover:bg-muted transition text-muted-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </main>
  );
}
