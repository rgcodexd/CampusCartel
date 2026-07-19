"use client";

import Link from "next/link";
import { use } from "react";
import { Star, MapPin, ShieldCheck, MessageCircle, ChevronLeft, Clock, Tag, Heart } from "lucide-react";

/* Mock detail data keyed by id */
const products: Record<string, any> = {
  "1": {
    title: "MacBook Air M1",
    mode: "rent",
    price: "₹499",
    suffix: "/ day",
    college: "Hindu College",
    rating: 4.8,
    reviews: 32,
    distance: "2 km away",
    category: "Electronics > Laptops",
    postedOn: "20 May, 2025",
    description: "MacBook Air M1 (2020) model in excellent condition.\nBattery health: 93%.\nComes with charger and original box.\nRent for short or long term.",
    seller: { name: "Rahul Sharma", college: "Hindu College", rating: 4.8, listings: 12, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100" },
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=600&fmt=webp",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=400",
    ],
  },
  "2": {
    title: "iPhone 12 128GB",
    mode: "buy",
    price: "₹32,999",
    suffix: "",
    college: "SRCC",
    rating: 4.6,
    reviews: 18,
    distance: "3 km away",
    category: "Electronics > Phones",
    postedOn: "15 Jun, 2025",
    description: "iPhone 12 128GB in Pacific Blue. Minor scratches on back. Battery health 87%. Comes with box and charger.",
    seller: { name: "Priya Patel", college: "SRCC", rating: 4.5, listings: 8, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" },
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-blue-select-2020?wid=600&fmt=webp",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=400",
    ],
  },
};

/* Fallback for unknown ids */
const fallback = {
  title: "Product",
  mode: "buy",
  price: "₹999",
  suffix: "",
  college: "Delhi University",
  rating: 4.5,
  reviews: 10,
  distance: "5 km away",
  category: "General",
  postedOn: "1 Jul, 2025",
  description: "This product is available for purchase. Contact the seller for more details.",
  seller: { name: "Student", college: "Delhi University", rating: 4.0, listings: 3, avatar: "" },
  images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600"],
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = products[id] || fallback;
  const mainImage = p.images[0];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-4 md:px-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <Link href="/browse" className="hover:text-primary transition">Electronics</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{p.title}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* ── Images ── */}
        <div>
          <div className="bg-muted rounded-2xl border h-[400px] flex items-center justify-center p-6 mb-4">
            <img src={mainImage} alt={p.title} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {p.images.map((img: string, i: number) => (
              <button key={i} className={`w-20 h-20 rounded-xl border-2 flex-shrink-0 overflow-hidden bg-muted flex items-center justify-center p-1 ${i === 0 ? "border-primary" : "border-transparent hover:border-primary/40"} transition`}>
                <img src={img} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Details ── */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="font-[var(--font-heading)] text-3xl font-bold text-foreground">{p.title}</h1>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${p.mode === "rent" ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-600"}`}>
              {p.mode === "rent" ? "For Rent" : "For Sale"}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-foreground">{p.price}</span>
            {p.suffix && <span className="text-sm text-muted-foreground">{p.suffix}</span>}
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {p.college}</span>
            <span className="flex items-center gap-1 text-amber-500 font-semibold"><Star className="h-4 w-4 fill-amber-500" /> {p.rating} ({p.reviews})</span>
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {p.distance}</span>
          </div>

          <div className="border-t pt-5 mb-5">
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{p.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="text-muted-foreground">Category</span>
              <p className="font-medium text-foreground">{p.category}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Posted on</span>
              <p className="font-medium text-foreground">{p.postedOn}</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> Student Verified
            </span>
            <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> ID Verified
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-8">
            <Link href="/chats" className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition shadow-sm text-sm">
              <MessageCircle className="h-4 w-4" /> Chat with Seller
            </Link>
            <button className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-surface text-foreground font-semibold py-3.5 rounded-xl border hover:bg-muted transition text-sm">
              <Tag className="h-4 w-4 text-primary" /> Make an Offer
            </button>
          </div>

          {/* Seller Info */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-foreground mb-4">Seller Information</h3>
            <div className="flex items-center gap-3">
              {p.seller.avatar ? (
                <img src={p.seller.avatar} alt={p.seller.name} className="w-12 h-12 rounded-full object-cover border" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted border flex items-center justify-center text-muted-foreground text-lg font-bold">{p.seller.name[0]}</div>
              )}
              <div>
                <p className="font-semibold text-foreground">{p.seller.name}</p>
                <p className="text-xs text-muted-foreground">{p.seller.college}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5 text-amber-500 font-semibold"><Star className="h-3 w-3 fill-amber-500" /> {p.seller.rating}</span>
                  <span>{p.seller.listings} Listings</span>
                  <span className="flex items-center gap-1 text-green-500"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active now</span>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="mt-6 bg-muted/50 rounded-xl p-4 border">
              <h4 className="font-semibold text-sm text-foreground mb-2">Safety Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Meet in public places</li>
                <li>Verify the item before payment</li>
                <li>Never pay in advance</li>
                <li>Use in-app chat for safety</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
