import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, "Route not found"));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Internal server error";

  res.status(status).json({
    error: {
      message,
      status,
    },
  });
}
