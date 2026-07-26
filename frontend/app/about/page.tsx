"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, MapPin, ArrowRight, ShieldCheck, 
  MessageCircle, Star, Calendar, Zap, Lock, ChevronRight, X 
} from "lucide-react";

import { fetchListings } from "@/lib/api";
import { Laptop, BookOpen, Coffee, Car, Sofa, Package, ChevronDown } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "Electronics": Laptop,
  "Academics": BookOpen,
  "Appliances": Coffee,
  "Vehicles": Car,
  "Furniture": Sofa,
  "Miscellaneous": Package
};

const CLUSTER_CAMPUSES = [
  { name: "IIT Delhi", dist: 0, active: 412, coords: { x: 50, y: 50 } },
  { name: "JNU", dist: 1.8, active: 189, coords: { x: 30, y: 70 } },
  { name: "IIIT Delhi", dist: 3.2, active: 84, coords: { x: 75, y: 25 } },
  { name: "AIIMS", dist: 4.5, active: 156, coords: { x: 20, y: 30 } },
  { name: "NIFT", dist: 2.1, active: 203, coords: { x: 80, y: 65 } },
];

function BentoCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border bg-white dark:bg-zinc-900 shadow-sm transition-all hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
}

/* ─── Main Page ─── */

export default function PremiumHomePage() {
  const [globalMode, setGlobalMode] = useState<"rent" | "buy">("rent");
  const [radius, setRadius] = useState(5);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [recentListings, setRecentListings] = useState<any[]>([]);

  React.useEffect(() => {
    fetchListings("all")
      .then(data => setRecentListings(data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] selection:bg-primary/20">
      
      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] max-w-6xl opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[128px] animate-pulse-glow" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 shadow-sm mb-8 animate-float">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 relative" />
            <span className="text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
              10,000+ Students actively trading
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-[1.1]">
            Secure, hyper-local <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              campus commerce.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-12 font-medium">
            Rent that textbook for the week, or buy that mini-fridge for the semester. Verified peers, zero logistics.
          </p>

          {/* Smart Search Bar */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 p-2 rounded-3xl md:rounded-full border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row items-center gap-2 transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/20">
            
            {/* Mode Toggle */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-full p-1 w-full md:w-auto">
              <button 
                onClick={() => setGlobalMode("rent")}
                className={`flex-1 md:flex-none px-6 py-3 rounded-full text-sm font-bold transition-all ${globalMode === "rent" ? "bg-white dark:bg-zinc-700 shadow-sm text-foreground" : "text-zinc-500"}`}
              >
                Rent
              </button>
              <button 
                onClick={() => setGlobalMode("buy")}
                className={`flex-1 md:flex-none px-6 py-3 rounded-full text-sm font-bold transition-all ${globalMode === "buy" ? "bg-white dark:bg-zinc-700 shadow-sm text-foreground" : "text-zinc-500"}`}
              >
                Buy
              </button>
            </div>

            <div className="hidden md:block h-8 w-px bg-zinc-200 dark:bg-zinc-700 mx-2" />

            {/* Input */}
            <div className="flex-1 flex items-center px-4 w-full">
              <Search className="h-5 w-5 text-zinc-400 mr-3" />
              <input 
                type="text"
                placeholder={globalMode === "rent" ? "What do you need for a few days?" : "What are you looking to buy?"}
                className="w-full bg-transparent border-none outline-none text-foreground font-medium placeholder:text-zinc-400"
              />
            </div>

            {/* Cluster Selector */}
            <div className="flex items-center px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-full w-full md:w-auto border border-zinc-100 dark:border-zinc-700">
              <MapPin className="h-4 w-4 text-primary mr-2" />
              <select className="bg-transparent border-none outline-none text-sm font-semibold text-foreground cursor-pointer">
                <option>IIT Delhi Cluster</option>
                <option>DU North Campus</option>
                <option>IP University</option>
              </select>
            </div>

            <button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white p-4 rounded-full md:rounded-full transition-transform active:scale-95 flex items-center justify-center">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>


      {/* ─── FEATURE BENTO GRID ─── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card A */}
          <BentoCard className="md:col-span-1 p-8 flex flex-col justify-between group bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50">
            <div>
              <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Verified Student Network</h3>
              <p className="text-zinc-500 font-medium">Every user is authenticated via university .edu emails. Zero outsiders, total trust.</p>
            </div>
            <div className="mt-8 p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 shadow-sm flex items-center gap-4 group-hover:scale-[1.02] transition-transform">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">JD</div>
              <div>
                <div className="text-sm font-bold text-foreground flex items-center gap-1">John Doe <CheckCheckIcon className="h-3 w-3 text-emerald-500"/></div>
                <div className="text-xs text-zinc-400">@iitd.ac.in verified</div>
              </div>
            </div>
          </BentoCard>

          {/* Card B */}
          <BentoCard className="md:col-span-1 p-8 flex flex-col justify-between group">
            <div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Secure Meetups & Chat</h3>
              <p className="text-zinc-500 font-medium">Negotiate terms, arrange campus meetups, and pay securely without sharing phone numbers.</p>
            </div>
            <div className="mt-8 space-y-3 group-hover:-translate-y-2 transition-transform">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl rounded-bl-sm text-sm w-3/4 text-zinc-600 dark:text-zinc-300">Is the textbook still available?</div>
              <div className="bg-primary text-white p-3 rounded-2xl rounded-br-sm text-sm w-3/4 ml-auto shadow-md">Yes! Meet at the library at 5?</div>
            </div>
          </BentoCard>

          {/* Card C (Radius Discovery Map Mockup) */}
          <BentoCard className="md:col-span-1 p-0 overflow-hidden relative group min-h-[300px]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 dark:opacity-10 pointer-events-none" />
            <div className="p-8 relative z-10">
              <div className="h-12 w-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Radius Discovery</h3>
              <p className="text-zinc-500 font-medium">Expand your search to nearby cluster colleges instantly.</p>
            </div>
            
            {/* Abstract Map Nodes */}
            <div className="absolute -bottom-10 -right-10 w-72 h-72 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
              <div className="w-48 h-48 border border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50 relative animate-pulse">
                  <div className="absolute -top-8 -left-6 bg-white dark:bg-zinc-800 px-2 py-1 rounded-md text-[9px] font-bold shadow-sm border whitespace-nowrap">Home Campus</div>
                </div>
              </div>
              {/* Surrounding Nodes */}
              <div className="absolute top-10 left-10 w-3 h-3 bg-emerald-500 rounded-full" />
              <div className="absolute bottom-20 left-4 w-2 h-2 bg-blue-500 rounded-full" />
              <div className="absolute top-32 right-12 w-3 h-3 bg-purple-500 rounded-full" />
            </div>
          </BentoCard>
        </div>
      </section>


      {/* ─── INTERACTIVE RADIUS MAP ─── */}
      <section className="py-20 border-y border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-3xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-foreground mb-6 tracking-tight">Your campus is just the <span className="text-primary">beginning.</span></h2>
            <p className="text-lg text-zinc-500 mb-10">Use our cluster technology to discover what students are trading at neighboring universities. Adjust your radius to tap into a massive student liquidity pool.</p>
            
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Search Radius</span>
                  <div className="text-3xl font-extrabold text-foreground mt-1">{radius} km</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Unlocked Nodes</span>
                  <div className="text-xl font-bold text-emerald-500 mt-1">{CLUSTER_CAMPUSES.filter(c => c.dist <= radius).length} Campuses</div>
                </div>
              </div>
              <input 
                type="range" 
                min="1" max="10" step="1"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-zinc-400 mt-3 font-semibold">
                <span>1km</span>
                <span>5km</span>
                <span>10km</span>
              </div>
            </div>
          </div>

          {/* Visual Node Graph representation */}
          <div className="relative h-[400px] bg-zinc-50 dark:bg-zinc-950 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-8 overflow-hidden shadow-inner">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            {CLUSTER_CAMPUSES.map((campus, idx) => {
              const inRadius = campus.dist <= radius;
              return (
                <div 
                  key={campus.name}
                  className={`absolute transition-all duration-700 ease-out flex flex-col items-center gap-2 ${inRadius ? 'opacity-100 scale-100' : 'opacity-20 scale-75 grayscale blur-sm'}`}
                  style={{ top: `${campus.coords.y}%`, left: `${campus.coords.x}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className={`relative flex items-center justify-center rounded-full shadow-lg overflow-hidden ${campus.dist === 0 ? 'h-16 w-16 bg-primary/10 p-1 border-2 border-primary' : 'h-12 w-12 bg-white dark:bg-zinc-800 border-2 border-primary/20'}`}>
                    {campus.dist === 0 ? (
                      <Image src="/logo.png" alt="Logo" width={48} height={48} className="h-full w-full object-contain" />
                    ) : (
                      <span className="font-bold text-sm">{campus.name.charAt(0)}</span>
                    )}
                    {inRadius && campus.dist !== 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[8px] font-bold text-white">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm text-center">
                    <div className="text-[10px] font-bold text-foreground">{campus.name}</div>
                    <div className="text-[9px] text-zinc-500 font-medium">{campus.dist === 0 ? 'Home' : `${campus.dist}km away`}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>


      {/* ─── DYNAMIC FEED ─── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
              Hot on Campus right now.
            </h2>
            <p className="text-zinc-500 font-medium">Browse verified listings within your cluster.</p>
          </div>
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            View full marketplace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentListings.map((item) => {
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
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-zinc-50/50 dark:to-zinc-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className={`p-3 rounded-2xl ${accentColor}`}>
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${tagColor}`}>
                      For {item.mode}
                    </div>
                  </div>

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
      </section>


      {/* ─── STICKY CTA / TRUST BANNER ─── */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b]">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <Lock className="h-7 w-7 text-foreground" />
          </div>
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Lock in your campus access.
          </h2>
          <p className="text-xl text-zinc-500 font-medium max-w-2xl mb-10">
            Join the safest peer-to-peer marketplace designed strictly for university students. No spam, no scams.
          </p>
          
          <button 
            onClick={() => setShowVerifyModal(true)}
            className="group relative inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-2xl shadow-foreground/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">Verify with .edu Email <ChevronRight className="h-5 w-5" /></span>
          </button>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs font-medium text-zinc-400">
          <p>© 2026 Campus Cartel. Built for students.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* ─── MOCKUP AUTH MODAL ─── */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowVerifyModal(false)}
              className="absolute top-6 right-6 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 p-1.5">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="h-full w-full object-contain" />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">Student Verification</h3>
            <p className="text-sm text-zinc-500 font-medium mb-8">Enter your university email to securely access the marketplace.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1 mb-2 block">University Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. jdoe@student.iitd.ac.in"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3.5 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]">
                Send Magic Link
              </button>
            </div>
            <p className="text-[11px] text-zinc-400 text-center mt-6 font-medium">By continuing, you agree to our Terms of Service.</p>
          </div>
        </div>
      )}

    </div>
  );
}

function CheckCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 7 17l-5-5" />
      <path d="m22 10-7.5 7.5L13 16" />
    </svg>
  )
}
