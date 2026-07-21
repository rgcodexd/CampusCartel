"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { GraduationCap, MapPin, Moon, Sun, ChevronDown, User, LogOut, Settings, LayoutDashboard, Search, ShieldCheck } from "lucide-react";
import { TrustBadge } from "./trust-badge";

export function Nav() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // UI States for Popovers
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Location State
  const [radius, setRadius] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<{id: string, name: string} | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkAdminStatus(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkAdminStatus(session.user.id);
      else setIsAdmin(false);
    });

    const checkAdminStatus = async (userId: string) => {
      const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
      setIsAdmin(data?.role === 'admin');
    };

    // Handle click outside to close popovers
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchColleges = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/colleges/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.items || []);
        }
      } catch (err) {
        console.error(err);
      }
      setIsSearching(false);
    };

    const debounce = setTimeout(fetchColleges, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setIsDark(root.classList.contains("dark"));
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <GraduationCap className="h-5 w-5 text-primary animate-pulse-glow" />
          </div>
          <span className="font-[var(--font-heading)] font-extrabold text-lg uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
            Campus Cartel
          </span>
        </Link>

        {/* Center links – Streamlined */}
        <div className="hidden md:flex items-center gap-6 text-sm font-bold">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
          <Link href="/marketplace" className="text-zinc-500 hover:text-primary transition-colors">Marketplace</Link>
          <Link href="/chats" className="text-zinc-500 hover:text-primary transition-colors">My Chats</Link>
          <Link href="/map" className="text-zinc-500 hover:text-primary transition-colors">Map</Link>
          <Link href="/dashboard" className="text-zinc-500 hover:text-primary transition-colors">Dashboard</Link>
          {isAdmin && (
            <Link href="/admin" className="text-purple-500 hover:text-purple-600 font-bold transition-colors">Admin</Link>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          
          {/* ─── LOCATION POPOVER ─── */}
          <div className="relative hidden lg:block" ref={locationRef}>
            <button 
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className={`flex items-center gap-1.5 bg-white dark:bg-zinc-900 border rounded-full px-3.5 py-1.5 text-sm cursor-pointer transition-all ${isLocationOpen ? 'ring-2 ring-primary/50 border-primary shadow-md' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold text-foreground text-xs truncate max-w-[120px]">{selectedCollege ? selectedCollege.name : 'Select Campus'}</span>
              <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLocationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <div className="mb-4 relative">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Select College</label>
                  <div className="flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2">
                    <Search className="h-4 w-4 text-zinc-400 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Search campus..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-none outline-none text-sm w-full text-foreground"
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-50">
                      {searchResults.map((college) => (
                        <div 
                          key={college.id} 
                          className="px-3 py-2 text-sm text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                          onClick={() => {
                            setSelectedCollege({ id: college.id, name: college.name });
                            setSearchQuery("");
                            setSearchResults([]);
                            setIsLocationOpen(false);
                          }}
                        >
                          <div className="font-semibold truncate">{college.name}</div>
                          <div className="text-[10px] text-zinc-500 truncate">{college.city}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {isSearching && <div className="absolute top-full left-0 right-0 mt-1 px-3 py-2 text-xs text-zinc-500 bg-white dark:bg-zinc-900 border rounded-xl shadow-lg">Searching...</div>}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Search Radius</label>
                    <span className="text-xs font-bold text-primary">{radius} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max="10" step="1"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[9px] text-zinc-400 mt-2 font-bold">
                    <span>1km</span>
                    <span>10km</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-white dark:bg-zinc-900 border rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
          </button>

          {/* ─── AUTH / PROFILE DROPDOWN ─── */}
          {session ? (
            <div className="flex items-center gap-2">
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 flex items-center justify-center overflow-hidden transition-all ${isProfileOpen ? 'border-primary shadow-md' : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                >
                  <User className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/50 mb-2">
                      <p className="text-sm font-extrabold text-foreground line-clamp-1">{session.user.email}</p>
                      <div className="mt-2">
                        <TrustBadge trustScore={4.9} />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-xl transition-colors">
                          <ShieldCheck className="h-4 w-4" /> Admin Portal
                        </Link>
                      )}

                      <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <User className="h-4 w-4" /> My Profile
                      </Link>
                      <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      
                      <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1 mx-2" />
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/25"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
