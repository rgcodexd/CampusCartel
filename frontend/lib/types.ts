export type Listing = {
  id: string;
  title: string;
  mode: "rent" | "buy";
  priceLabel: string;
  college: string;
  distanceKm: number;
};
