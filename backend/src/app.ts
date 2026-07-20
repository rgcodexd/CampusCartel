import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { requestIdMiddleware } from "./middleware/request-id.js";
import { collegesRouter } from "./routes/colleges.js";
import { healthRouter } from "./routes/health.js";
import { listingsRouter } from "./routes/listings.js";
import { profilesRouter } from "./routes/profiles.js";
import { chatsRouter } from "./routes/chats.js";
import { leaderboardRouter } from "./routes/leaderboard.js";
import { moderationRouter } from "./routes/moderation.js";

import pinoHttpMod from "pino-http";
const pinoHttp = pinoHttpMod.pinoHttp || pinoHttpMod;

const logger = pinoHttp({
  transport: process.env.NODE_ENV !== "production"
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
});

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestIdMiddleware);
  app.use(logger);

  app.use(healthRouter);
  app.use(collegesRouter);
  app.use(profilesRouter);
  app.use(listingsRouter);
  app.use(chatsRouter);
  app.use(leaderboardRouter);
  app.use(moderationRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
