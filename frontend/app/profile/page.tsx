"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UploadCloud, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  
  const [stateName, setStateName] = useState("");
  const [college, setCollege] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [colleges, setColleges] = useState<Array<any>>([]);
  
  const [phone, setPhone] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return;
      try {
        const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();
        if (mounted && data) {
          setProfile(data);
          setName(data.full_name || "");
          setCollege(data.college || "");
          setPhone(data.phone || "");
          setCollegeEmail(data.college_email || "");
          setStudentId(data.student_id || "");
        }
      } catch (err) {
        // ignore
      }
    });

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/colleges/states`)
      .then((r) => r.json())
      .then((j) => setStates(j.items || []))
      .catch(() => {});

    return () => { mounted = false };
  }, []);

  useEffect(() => {
    if (!stateName) {
      setColleges([]);
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/v1/colleges?state=${encodeURIComponent(stateName)}`)
      .then((r) => r.json())
      .then((j) => setColleges(j.items || []))
      .catch(() => {});
  }, [stateName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadIdCard = async (userId: string): Promise<string | null> => {
    if (!file) return null;
    setUploading(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Math.random()}.${fileExt}`;
    const filePath = `ids/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage.from('verifications').upload(filePath, file);
      if (uploadError) throw new Error("Upload failed: " + uploadError.message);
      
      const { data } = supabase.storage.from('verifications').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      console.error("Error uploading file:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      setMessage("You must be logged in to save your profile.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = profile?.verification_image_url;
      if (file) {
        const newUrl = await uploadIdCard(session.user.id);
        if (newUrl) imageUrl = newUrl;
      }

      if (!imageUrl && !profile?.verification_image_url) {
        setMessage("Please upload your student ID card to proceed.");
        setLoading(false);
        return;
      }

      const payload = {
        id: session.user.id,
        full_name: name,
        college,
        phone,
        college_email: collegeEmail,
        student_id: studentId,
        email: session.user.email,
        verification_image_url: imageUrl,
        verification_status: profile?.verification_status === 'approved' ? 'approved' : 'pending'
      };

      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;
      
      setProfile({ ...profile, ...payload });
      setMessage("Profile saved successfully. Your ID is pending verification.");
      setIsSuccess(true);
    } catch (err: any) {
      setMessage(err.message || "Failed to save profile");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 pt-10 pb-20 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="font-[var(--font-heading)] text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-2">Student Verification</h1>
        <p className="text-zinc-500 max-w-xl mx-auto">Verify your student status to unlock exclusive premium features and access your campus marketplace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-950 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-primary/5">
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Full Name</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                  <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">State</label>
                  <select required value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors appearance-none">
                    <option value="">Select your state</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">College</label>
                  <select required value={college} onChange={(e) => setCollege(e.target.value)} disabled={!stateName} className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors appearance-none disabled:opacity-50">
                    <option value="">{stateName ? "Select your college" : "Select state first"}</option>
                    {colleges.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">College Email</label>
                  <input required type="email" value={collegeEmail} onChange={(e) => setCollegeEmail(e.target.value)} placeholder="student@college.edu.in" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Student ID / Roll No</label>
                  <input required value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 2023CS1001" className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
                </div>
              </div>

              <div className="mt-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors relative">
                <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-1">Upload Student ID Card</h3>
                  <p className="text-sm text-zinc-500 mb-4">Must clearly show your name, photo, and college name</p>
                  
                  {file ? (
                    <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> {file.name}
                    </div>
                  ) : profile?.verification_image_url ? (
                    <div className="px-4 py-2 bg-green-500/10 text-green-600 rounded-xl font-medium text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> ID Card Already Uploaded
                    </div>
                  ) : (
                    <div className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-medium text-sm">
                      Browse Files
                    </div>
                  )}
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl text-sm flex items-center gap-3 ${isSuccess ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {isSuccess ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  {message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || uploading} 
                className="w-full bg-gradient-to-r from-primary to-purple-600 text-white font-bold rounded-2xl px-4 py-4 hover:opacity-90 transition-opacity disabled:opacity-50 mt-2 shadow-lg shadow-primary/25"
              >
                {loading || uploading ? 'Processing...' : 'Submit for Verification'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-8 border border-zinc-800 text-white sticky top-24">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              Status 
              {profile?.verification_status === 'approved' && <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full ml-auto">Verified</span>}
              {profile?.verification_status === 'pending' && <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full ml-auto">Pending</span>}
              {profile?.verification_status === 'rejected' && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full ml-auto">Rejected</span>}
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4 opacity-100">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Create Account</h4>
                  <p className="text-xs text-zinc-400 mt-1">Sign up with your email address</p>
                </div>
              </div>

              <div className={`flex gap-4 ${profile?.verification_image_url ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${profile?.verification_image_url ? 'bg-primary' : 'border-2 border-zinc-700'}`}>
                  {profile?.verification_image_url && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">Upload ID</h4>
                  <p className="text-xs text-zinc-400 mt-1">Provide a valid student ID card</p>
                </div>
              </div>

              <div className={`flex gap-4 ${profile?.verification_status === 'approved' ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${profile?.verification_status === 'approved' ? 'bg-primary' : profile?.verification_status === 'pending' ? 'bg-yellow-500 text-white' : 'border-2 border-zinc-700'}`}>
                  {profile?.verification_status === 'approved' && <CheckCircle className="w-4 h-4 text-white" />}
                  {profile?.verification_status === 'pending' && <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-sm">Verification</h4>
                  <p className="text-xs text-zinc-400 mt-1">Admin reviews your application</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10">
              <h4 className="font-bold text-sm mb-3">Why verify?</h4>
              <ul className="text-xs text-zinc-400 space-y-2">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-primary" /> Access to exclusive listings</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-primary" /> Connect with peers safely</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-primary" /> Unlock premium discounts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
