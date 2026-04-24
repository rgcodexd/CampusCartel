import { ListingCard } from "../../components/listing-card";
import { fetchListings } from "../../lib/api";

type ListingsPageProps = {
  searchParams?: Promise<{ mode?: "rent" | "buy" }>;
};

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const mode = params?.mode === "buy" ? "buy" : "rent";
  const listings = await fetchListings(mode).catch(() => []);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-8">
      <header className="mb-6 rounded-3xl border border-white/40 bg-white/20 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-white/90">Marketplace</p>
        <h1 className="mt-2 font-[var(--font-heading)] text-4xl text-white">
          {mode === "rent" ? "Rent Listings" : "Buy Listings"}
        </h1>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {listings.length === 0 && (
          <p className="card-surface rounded-2xl p-5 text-sm text-ink/80">
            No listings yet. Connect Supabase and seed data to see production inventory.
          </p>
        )}
        {listings.map((item) => (
          <ListingCard key={item.id} {...item} />
        ))}
      </section>
    </main>
  );
}
