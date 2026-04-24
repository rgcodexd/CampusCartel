import type { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = req.header("x-request-id") ?? uuidv4();
  req.headers["x-request-id"] = requestId;
  res.setHeader("x-request-id", requestId);
  next();
}
