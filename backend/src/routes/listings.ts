import { Router } from "express";
import { z } from "zod";
import { listingsSeed } from "../data/seed-colleges.js";
import { AppError } from "../middleware/error-handler.js";
import { requireStudentVerification } from "../middleware/student-auth.js";

const querySchema = z.object({
  mode: z.enum(["rent", "buy"]).optional(),
  q: z.string().optional(),
});

const createListingSchema = z.object({
  title: z.string().min(4),
  mode: z.enum(["rent", "buy"]),
  category: z.string().min(2),
  priceLabel: z.string().min(2),
  college: z.string().min(2),
  distanceKm: z.number().min(0),
});

const listingsStore = [...listingsSeed];

export const listingsRouter = Router();

listingsRouter.get("/api/v1/listings", (req, res, next) => {
  try {
    const query = querySchema.parse(req.query);
    const normalizedQ = query.q?.toLowerCase().trim();

    const filtered = listingsStore.filter((item) => {
      const modeMatch = query.mode ? item.mode === query.mode : true;
      const textMatch = normalizedQ ? item.title.toLowerCase().includes(normalizedQ) : true;
      return modeMatch && textMatch;
    });

    res.status(200).json({ items: filtered });
  } catch (error) {
    next(error);
  }
});

listingsRouter.post("/api/v1/listings", requireStudentVerification, (req, res, next) => {
  try {
    const payload = createListingSchema.parse(req.body);
    const ownerStudentId = req.header("x-student-id");

    if (!ownerStudentId) {
      throw new AppError(401, "Missing x-student-id header");
    }

    const newItem = {
      id: `lst-${Date.now()}`,
      ...payload,
      ownerStudentId,
    };

    listingsStore.unshift(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});
