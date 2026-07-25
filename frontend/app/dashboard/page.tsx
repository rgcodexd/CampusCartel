"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, ListChecks, Heart, MessageCircle, ShoppingBag, Bell, User, Settings, Star, Eye, MapPin, ChevronDown, Plus, Search } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { fetchListings } from "../../lib/api";

const sideLinks = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "My Listings", icon: ListChecks, href: "/dashboard" },
  { label: "Favorites", icon: Heart, href: "/dashboard" },
  { label: "My Chats", icon: MessageCircle, href: "/chats" },
  { label: "My Orders", icon: ShoppingBag, href: "/dashboard" },
  { label: "Notifications", icon: Bell, href: "/dashboard" },
  { label: "Profile", icon: User, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/dashboard" },
];

type MyListing = {
  id: string;
  title: string;
  priceLabel: string;
  views?: number;
  chats?: number;
  image?: string;
  badge?: string;
};

const myListings: MyListing[] = [];

const quickActions = [
  { label: "Post a New Listing", icon: Plus, href: "/create", primary: true },
  { label: "Marketplace", icon: Search, href: "/marketplace" },
];

export default function DashboardPage() {
  const [listings, setListings] = useState<MyListing[]>([]);
  const [userName, setUserName] = useState("")

  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      // display name from auth metadata
      setUserName(session.user.user_metadata?.full_name || session.user.email || "");

      try {
        const all = await fetchListings("rent");
        const mine = all.filter((l: any) => l.ownerStudentId === session.user.id).map((l: any) => ({
          id: l.id,
          title: l.title,
          priceLabel: l.priceLabel,
          views: 0,
          chats: 0,
          image: l.image || undefined,
          badge: "Active",
        }));
        if (mounted) setListings(mine);
        // If no profile exists, ask user to complete profile
        const { data: profile } = await supabase.from("profiles").select("id,is_verified").eq("id", session.user.id).maybeSingle();
        if (!profile || !profile.is_verified) {
          router.push("/profile");
        }
      } catch (err) {
        console.error("Failed to load listings", err);
      }
    });
    return () => { mounted = false };
  }, []);
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-4 md:px-8">
      <div className="flex gap-6">
        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
          <div className="bg-white dark:bg-surface border rounded-2xl p-4 sticky top-24">
            {sideLinks.map(({ label, icon: Icon, href, active }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition mb-1 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="border-t mt-3 pt-3">
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/5 transition w-full">
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main Dashboard ── */}
        <div className="flex-1 min-w-0">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="font-[var(--font-heading)] text-2xl font-bold text-foreground">Welcome back, {userName || "Student"}! 👋</h1>
            <p className="text-sm text-muted-foreground mt-1">Here&apos;s what&apos;s happening.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Listings", value: "12", sub: "" },
              { label: "Chats", value: "8", sub: "" },
              { label: "Items Sold/Rented", value: "23", sub: "" },
              { label: "Trust Score (Beta)", value: "4.8", sub: "" },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-surface border rounded-2xl p-5">
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* My Active Listings */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-[var(--font-heading)] text-lg font-bold text-foreground">My Active Listings</h2>
                <Link href="/marketplace" className="text-xs text-primary font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-4">
                {(listings.length ? listings : myListings).length === 0 ? (
                  <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    <p className="text-zinc-500 font-medium">You don't have any active listings yet.</p>
                  </div>
                ) : (
                  (listings.length ? listings : myListings).map((item, i) => (
                    <Link href={`/listings/${item.id}`} key={item.id || i} className="group flex flex-col sm:flex-row sm:items-center gap-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[1.5rem] p-5 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
                      
                      {/* Icon Container instead of Image */}
                      <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center flex-shrink-0 border border-zinc-100 dark:border-zinc-800 group-hover:scale-105 transition-transform duration-300">
                        <ShoppingBag className="w-6 h-6 text-primary/70" />
                      </div>
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="font-extrabold text-base text-foreground truncate group-hover:text-primary transition-colors">{item.title}</h3>
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                            item.badge === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                          }`}>{item.badge || "Active"}</span>
                        </div>
                        
                        <p className="text-sm font-black text-foreground mb-3">{item.priceLabel}</p>
                        
                        <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                          <span className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md"><Eye className="h-3.5 w-3.5" /> {item.views || 0} views</span>
                          <span className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md"><MessageCircle className="h-3.5 w-3.5" /> {item.chats || 0} chats</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-4 sm:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="px-4 py-2 text-xs font-extrabold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-foreground rounded-xl transition-colors">
                          Edit
                        </button>
                        <button className="px-4 py-2 text-xs font-extrabold bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl transition-colors">
                          Delete
                        </button>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions + College Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-[var(--font-heading)] text-lg font-bold text-foreground mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {quickActions.map((a) => (
                    <Link
                      key={a.label}
                      href={a.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                        a.primary
                          ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                          : "bg-white dark:bg-surface border text-foreground hover:bg-muted"
                      }`}
                    >
                      <a.icon className="h-4 w-4" />
                      {a.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* College Info */}
              <div className="bg-white dark:bg-surface border rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-foreground mb-3">Your College</h3>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Delhi University</span>
                  <button className="text-[10px] text-primary font-semibold hover:underline ml-auto">Change</button>
                </div>
                <div className="border-t mt-3 pt-3">
                  <h3 className="font-semibold text-sm text-foreground mb-2">Radius</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Within 5 km</span>
                    <button className="text-[10px] text-primary font-semibold hover:underline ml-auto">Change</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
