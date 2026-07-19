import { z } from "zod";

const rawListingSchema = z.object({
  id: z.string(),
  title: z.string(),
  mode: z.enum(["rent", "buy"]),
  price_label: z.string(),
  college: z.string(),
  distance_km: z.number().nullable().optional(),
  owner_student_id: z.string().optional(),
});

const responseSchema = z.object({
  items: z.array(rawListingSchema),
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
  const raw = responseSchema.parse(json).items;

  // Map backend snake_case -> frontend camelCase and keep owner id
  return raw.map((r) => ({
    id: r.id,
    title: r.title,
    mode: r.mode,
    priceLabel: r.price_label,
    college: r.college,
    distanceKm: r.distance_km ?? 0,
    ownerStudentId: r.owner_student_id ?? null,
  }));
}

export type CreateListingPayload = {
  title: string;
  mode: "rent" | "buy";
  category: string;
  priceLabel: string;
  college: string;
  distanceKm: number;
};

export async function createListing(payload: CreateListingPayload, studentId: string, studentEmail: string) {
  const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const response = await fetch(`${api}/api/v1/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-student-id": studentId,
      "x-student-email": studentEmail,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create listing (${response.status})`);
  }

  return response.json();
}
