import { Router } from "express";
import { colleges } from "../data/seed-colleges.js";

export const collegesRouter = Router();

collegesRouter.get("/api/v1/colleges", (_req, res) => {
  res.status(200).json({ items: colleges });
});
