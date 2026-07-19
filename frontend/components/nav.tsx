"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { GraduationCap, MapPin, Moon, Sun, ChevronDown, User } from "lucide-react";

export function Nav() {
  const [session, setSession] = useState<Session | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setIsDark(root.classList.contains("dark"));
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <span className="font-[var(--font-heading)] font-bold text-lg uppercase tracking-wide text-foreground">
            Campus Cartel
          </span>
        </Link>

        {/* Center links – always visible */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="text-foreground hover:text-primary transition">Home</Link>
          <Link href="/browse" className="text-muted-foreground hover:text-primary transition">Browse</Link>
          <Link href="/browse?type=rent" className="text-muted-foreground hover:text-primary transition">Rent</Link>
          <Link href="/browse?type=buy" className="text-muted-foreground hover:text-primary transition">Buy</Link>
          <Link href="/chats" className="text-muted-foreground hover:text-primary transition">My Chats</Link>
          <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition">Dashboard</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* University Selector */}
          <div className="hidden lg:flex items-center gap-1.5 bg-white dark:bg-surface border rounded-full px-3.5 py-1.5 text-sm cursor-pointer hover:bg-muted transition">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-foreground text-xs">Delhi University</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-surface border rounded-full hover:bg-muted transition"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
          </button>

          {/* Auth button */}
          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/create"
                className="text-xs font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition shadow-sm"
              >
                Post Listing
              </Link>
              {/* User avatar */}
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary/50 transition"
                title="Logout"
              >
                <User className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition shadow-sm"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
