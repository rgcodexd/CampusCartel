type ListingCardProps = {
  title: string;
  mode: "rent" | "buy";
  priceLabel: string;
  college: string;
  distanceKm: number;
};

export function ListingCard({ title, mode, priceLabel, college, distanceKm }: ListingCardProps) {
  return (
    <article className="card-surface rounded-2xl border p-5 shadow-soft transition-transform duration-300 hover:-translate-y-1">
      <span className={`inline-block rounded-full px-3 py-1 text-xs uppercase tracking-wide font-bold ${mode === 'rent' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-600'}`}>
        {mode === 'rent' ? 'For Rent' : 'For Sale'}
      </span>
      <h3 className="mt-4 font-[var(--font-heading)] text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-lg font-bold text-foreground">{priceLabel}</p>
      <p className="mt-3 text-sm text-muted-foreground font-medium">
        {distanceKm} km away - {college}
      </p>
    </article>
  );
}

