import { createApp } from "./app.js";
import { env } from "./config/env.js";
import http from "http";
import { Server } from "socket.io";
import { registerChatHandlers } from "./sockets/chatHandler.js";

const app = createApp();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

registerChatHandlers(io);

server.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Campus Cartel API running on port ${env.PORT}`);
});
