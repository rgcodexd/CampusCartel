export type ListingMode = "rent" | "buy";

export type Listing = {
  id: string;
  title: string;
  mode: ListingMode;
  category: string;
  priceLabel: string;
  college: string;
  distanceKm: number;
  ownerStudentId: string;
};

export type College = {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
};
