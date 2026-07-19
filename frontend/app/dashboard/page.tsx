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
  { label: "Browse Items", icon: Search, href: "/browse" },
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
        const { data: profile } = await supabase.from("profiles").select("id").eq("id", session.user.id).maybeSingle();
        if (!profile) {
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
                <Link href="/browse" className="text-xs text-primary font-semibold hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {(listings.length ? listings : myListings).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white dark:bg-surface border rounded-2xl p-4 hover:shadow-sm transition">
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 p-1">
                      <img src={item.image} alt={item.title} className="h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground truncate">{item.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.badge === "Active" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
                        }`}>{item.badge}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground mt-0.5">{item.price}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {item.views} views</span>
                        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" /> {item.chats} Chats</span>
                      </div>
                    </div>
                  </div>
                ))}
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
