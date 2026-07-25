"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { createListing, CreateListingPayload } from "../../lib/api";
import { ImagePlus, MapPin, Loader2, Search, X } from "lucide-react";

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [session, setSession] = useState<any>(null);

  const [formData, setFormData] = useState<CreateListingPayload>({
    title: "",
    mode: "rent",
    category: "",
    priceLabel: "",
    college: "",
    distanceKm: 0,
    description: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // College Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
      }
    });
  }, [router]);
  
  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: profile } = await supabase.from("profiles").select("is_verified, college").eq("id", session.user.id).maybeSingle();
      if (!profile || !profile.is_verified) {
        router.push("/profile");
      } else if (profile.college) {
        setFormData(prev => ({ ...prev, college: profile.college }));
        setSearchQuery(profile.college);
      }
    })();
  }, [session, router]);

  // Handle outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // College Search Effect
  useEffect(() => {
    const fetchColleges = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/v1/colleges/search?q=${encodeURIComponent(searchQuery)}`);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (userId: string): Promise<string | null> => {
    if (!imageFile) return null;
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `items/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from('listings').upload(filePath, imageFile);
      if (uploadError) throw new Error(uploadError.message);
      
      const { data } = supabase.storage.from('listings').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      throw new Error(`Image upload failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    if (!formData.college) {
      setError("Please select a college from the dropdown.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const studentId = session.user.id;
      const { data: profile } = await supabase.from("profiles").select("college_email").eq("id", studentId).maybeSingle();
      const studentEmail = profile?.college_email || session.user.email || "";

      let uploadedUrl = null;
      if (imageFile) {
        uploadedUrl = await uploadImage(studentId);
      }

      const finalPayload = { ...formData, imageUrl: uploadedUrl || undefined };
      await createListing(finalPayload, studentId, studentEmail);
      router.push(`/marketplace`);
    } catch (err: any) {
      setError(err.message || "Failed to create listing");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "distanceKm" ? parseFloat(value) : value,
    }));
  };

  if (!session) return null;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-[var(--font-heading)] text-4xl font-extrabold text-foreground mb-2 tracking-tight">Post a Listing</h1>
          <p className="text-zinc-500">Sell or rent your items to students on your campus.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Image Upload */}
          <div className="w-full md:w-2/5 bg-zinc-50 dark:bg-zinc-950/50 p-8 flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-lg mb-4">Product Image</h3>
            <div className="flex-1 min-h-[300px] relative rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary/50 hover:bg-primary/5 transition flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg">Change Image</span>
                  </div>
                </>
              ) : (
                <div className="p-6">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-8 h-8" />
                  </div>
                  <p className="font-medium text-foreground mb-1">Click or drag image to upload</p>
                  <p className="text-xs text-zinc-500">PNG, JPG or WEBP (Max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Form Details */}
          <div className="w-full md:w-3/5 p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  minLength={4}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Mini Fridge, Engineering Textbook"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Listing Type</label>
                <select
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="rent">Rent</option>
                  <option value="buy">Sell (One-time)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
                <input
                  name="category"
                  type="text"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics, Books"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Price</label>
                <input
                  name="priceLabel"
                  type="text"
                  required
                  value={formData.priceLabel}
                  onChange={handleChange}
                  placeholder="e.g. ₹50/day or ₹1000"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div className="relative" ref={dropdownRef}>
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">College Campus</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                      if (formData.college && e.target.value !== formData.college) {
                        setFormData(prev => ({ ...prev, college: "" }));
                      }
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search your college..."
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 animate-spin" />
                  )}
                </div>

                {/* College Search Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((college) => (
                      <button
                        key={college.id}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, college: college.name }));
                          setSearchQuery(college.name);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                      >
                        <div className="font-semibold text-sm">{college.name}</div>
                        <div className="text-xs text-zinc-500">{college.city}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item, its condition, and any other details..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-3">
                <X className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-bold rounded-xl px-4 py-4 hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Publishing Listing..." : "Publish Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
