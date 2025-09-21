import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { PendulumManager } from "./simulation/pendulum-manager.js";
import { createPendulumRoutes } from "./routes/pendulum.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const PORT = Number(process.env.PORT) || 3001;
const WS_PORT = Number(process.env.WS_PORT) || PORT + 1000;
const ID = process.env.ID || `pendulum-${PORT}`;

// --- Pendulum Manager ---
const manager = new PendulumManager(ID);

// --- Express server ---
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

// --- Swagger config ---
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pendulum API",
      version: "1.0.0",
      description: "API docs for the pendulum simulation",
    },
  },
  apis: [path.resolve("./src/routes/*.ts")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---
app.use("/api/v1/pendulum", createPendulumRoutes(manager));

server.listen(PORT, () => console.log(`HTTP server listening on ${PORT}`));

// --- WebSocket server ---
const wss = new WebSocketServer({ port: WS_PORT });
wss.on("connection", (ws) => {
  console.log("Frontend connected");
  ws.on("close", () => console.log("Frontend disconnected"));
});

// --- Start pendulum loop ---
manager.stepAndPublish(wss.clients);
