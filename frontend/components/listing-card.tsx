import { Star } from "lucide-react";

type ListingCardProps = {
  title: string;
  mode: "rent" | "buy";
  priceLabel: string;
  college: string;
  distanceKm: number;
  image?: string;
  rating?: number;
  reviews?: number;
};

export function ListingCard({
  title,
  mode,
  priceLabel,
  college,
  distanceKm,
  image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
  rating = 4.5,
  reviews = 12,
}: ListingCardProps) {
  // Parse pricing for premium display (if it contains a slash, it's a rental rate)
  const [amount, suffix] = priceLabel.split("/");

  return (
    <article className="group bg-white dark:bg-surface rounded-2xl border overflow-hidden shadow-sm hover:shadow-floating transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-44 bg-muted flex items-center justify-center p-4">
        <img src={image} alt={title} className="h-full max-w-full object-contain" />
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${
            mode === "rent" ? "bg-primary/10 text-primary" : "bg-green-500/10 text-green-600"
          }`}
        >
          {mode === "rent" ? "For Rent" : "For Sale"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition truncate">
          {title}
        </h3>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="font-bold text-foreground">{amount}</span>
          {suffix && <span className="text-xs text-muted-foreground">/ {suffix}</span>}
        </div>
        <div className="flex justify-between items-center mt-2 text-[11px] text-muted-foreground">
          <span>
            {distanceKm > 0 ? `${distanceKm.toFixed(1)} km away - ` : ""}
            {college}
          </span>
          <span className="flex items-center text-amber-500 font-semibold">
            <Star className="h-3 w-3 fill-amber-500 mr-0.5" /> {rating} ({reviews})
          </span>
        </div>
      </div>
    </article>
  );
}

