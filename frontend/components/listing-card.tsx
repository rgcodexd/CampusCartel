type ListingCardProps = {
  title: string;
  mode: "rent" | "buy";
  priceLabel: string;
  college: string;
  distanceKm: number;
};

export function ListingCard({ title, mode, priceLabel, college, distanceKm }: ListingCardProps) {
  return (
    <article className="card-surface rounded-2xl border border-white/60 p-5 shadow-soft transition-transform duration-300 hover:-translate-y-1">
      <span className="inline-block rounded-full bg-ink/90 px-3 py-1 text-xs uppercase tracking-wide text-white">
        {mode}
      </span>
      <h3 className="mt-4 font-[var(--font-heading)] text-xl text-ink">{title}</h3>
      <p className="mt-2 text-lg font-semibold text-ember">{priceLabel}</p>
      <p className="mt-3 text-sm text-ink/80">
        {distanceKm} km away - {college}
      </p>
    </article>
  );
}
