import { ArrowRight, ShieldCheck, ToggleLeft } from "lucide-react";
import Link from "next/link";
import { ListingCard } from "../components/listing-card";
import { fetchListings } from "../lib/api";

export default async function HomePage() {
  const listings = await fetchListings("rent").catch(() => []);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-8">
      <section className="hero-grid rounded-3xl border border-white/40 p-8 md:p-12">
        <p className="font-[var(--font-heading)] text-sm uppercase tracking-[0.2em] text-white/90">Campus Cartel</p>
        <h1 className="mt-4 max-w-3xl font-[var(--font-heading)] text-4xl leading-tight text-white md:text-6xl">
          College-only marketplace for renting, reselling, and trusted peer deals.
        </h1>
        <p className="mt-5 max-w-2xl text-white/90">
          Built for students. Verified with campus identity. Search nearby colleges and close deals fast.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/listings?mode=rent" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white">
            Explore Rentals
          </Link>
          <Link
            href="/listings?mode=buy"
            className="rounded-xl border border-white/70 bg-white/20 px-5 py-3 text-sm font-semibold text-white"
          >
            Explore Buy Listings
           </Link>
         </div>
       </section>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="card-surface rounded-2xl p-5">
          <ShieldCheck className="h-5 w-5 text-mint" />
          <h2 className="mt-3 font-[var(--font-heading)] text-xl">Student Verification</h2>
          <p className="mt-2 text-sm text-ink/80">College-domain email and invite-only onboarding for launch safety.</p>
        </article>
        <article className="card-surface rounded-2xl p-5">
          <ToggleLeft className="h-5 w-5 text-mint" />
          <h2 className="mt-3 font-[var(--font-heading)] text-xl">Rent | Buy Toggle</h2>
          <p className="mt-2 text-sm text-ink/80">Clear mode switching to reduce confusion and speed up transactions.</p>
        </article>
        <article className="card-surface rounded-2xl p-5">
          <ArrowRight className="h-5 w-5 text-mint" />
          <h2 className="mt-3 font-[var(--font-heading)] text-xl">Campus Radius Discovery</h2>
          <p className="mt-2 text-sm text-ink/80">Find items in nearby college clusters for safer handoffs.</p>
        </article>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-[var(--font-heading)] text-2xl text-white">Featured Rentals</h2>
          <Link href="/listings?mode=rent" className="text-sm font-semibold text-white underline underline-offset-4">
            View all
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {listings.slice(0, 3).map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
}
