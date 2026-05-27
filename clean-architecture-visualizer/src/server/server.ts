import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import chalk from "chalk";
import type { Server } from "http";

import analysis from "./routes/analysis.js"
import codebase from "./routes/codebase.js"
import template from "./routes/template.js"

const API_PORT  = 3131;
const VITE_PORT = 5173;

let server: Server | null = null;

export function startServer() {
  const app = express();
  app.use(express.json());

  // Routes
  app.use("/api", analysis);
  app.use("/api", codebase);
  app.use("/api", template);

  // Requests non - express related
  app.use(
    "/",
    createProxyMiddleware({
      target: `http://localhost:${VITE_PORT}`,
      changeOrigin: true,
      ws: true,           // proxy WebSocket (Vite HMR)
    })
  );

  server = app.listen(API_PORT, () => {
    console.log(chalk.green(`Dev server running at http://localhost:${API_PORT}`));
    console.log(chalk.dim(`  → Proxying frontend from :${VITE_PORT}`));
    console.log(chalk.dim(`  → Session API at /api/session`));
  });

  return server;
}

export function stopServer() {
  if (!server) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    server?.close((err) => {
      if (err) {
        reject(err);
      } else {
        server = null;
        resolve();
      }
    });
  });
}