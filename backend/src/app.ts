import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { collegesRouter } from "./routes/colleges.js";
import { healthRouter } from "./routes/health.js";
import { listingsRouter } from "./routes/listings.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestIdMiddleware);
  app.use(morgan("combined"));

  app.use(healthRouter);
  app.use(collegesRouter);
  app.use(listingsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
