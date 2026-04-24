import { z } from "zod";

const listingSchema = z.object({
  id: z.string(),
  title: z.string(),
  mode: z.enum(["rent", "buy"]),
  priceLabel: z.string(),
  college: z.string(),
  distanceKm: z.number(),
});

const responseSchema = z.object({
  items: z.array(listingSchema),
});

export async function fetchListings(mode: "rent" | "buy") {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const response = await fetch(`${api}/api/v1/listings?mode=${mode}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch listings (${response.status})`);
  }

  const json = await response.json();
  return responseSchema.parse(json).items;
}
