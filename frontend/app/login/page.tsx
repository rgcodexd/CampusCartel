"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Signup successful! Please check your email to verify your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        window.location.href = "/";
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err?.message || String(err)}`);
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-md px-4 pt-20">
      <div className="card-surface rounded-3xl p-8 border shadow-xl shadow-primary/5">
        <h1 className="font-[var(--font-heading)] text-3xl text-foreground mb-2">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="text-muted-foreground mb-6 text-sm">
          {isSignUp 
            ? "Sign up with your college email and password." 
            : "Sign in with your email and password."}
        </p>
        
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              College Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              className="w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-semibold rounded-xl px-4 py-3 hover:bg-primary/90 transition disabled:opacity-50 mt-2 shadow-soft"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up with Email" : "Sign In with Email"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary hover:underline"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-2">
          <div className="relative my-6 flex items-center">
            <div className="flex-grow h-px bg-border" />
            <span className="px-3 text-sm text-muted-foreground">or</span>
            <div className="flex-grow h-px bg-border" />
          </div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border rounded-xl px-4 py-3 hover:bg-muted/50 transition disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="w-5 h-5">
              <path fill="#4285f4" d="M533.5 278.4c0-18.5-1.5-36.3-4.3-53.6H272v101.4h146.9c-6.3 34-25.4 62.8-54 82v68h87.1c51-46.9 80.5-116.3 80.5-197.8z"/>
              <path fill="#34a853" d="M272 544.3c73.6 0 135.4-24.4 180.6-66.1l-87.1-68c-24.2 16.2-55.4 25.7-93.5 25.7-71.9 0-132.9-48.6-154.7-114.1h-91.8v71.6C79.6 479.6 168.6 544.3 272 544.3z"/>
              <path fill="#fbbc04" d="M117.3 321.8c-10.6-31.6-10.6-65.9 0-97.5V152.7h-91.8C5.8 207.5 0 238.8 0 272s5.8 64.5 25.5 119.3l91.8-69.5z"/>
              <path fill="#ea4335" d="M272 107.7c39.9 0 75.7 13.7 104 40.6l78.1-78.1C403 24.9 335.6 0 272 0 168.6 0 79.6 64.7 41.8 152.7l91.8 71.6C139.1 156.3 200.1 107.7 272 107.7z"/>
            </svg>
            <span className="text-sm font-medium">Continue with Google</span>
          </button>
        </div>
        {message && (
          <div className="mt-4 p-4 rounded-xl bg-muted border text-sm text-foreground">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}

