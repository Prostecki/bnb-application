import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRouter from "./api/index.js";

const app = new Hono();

// Add CORS middleware to allow requests from the frontend
app.use(
  "/api/*",
  cors({
    origin: "http://localhost:8080",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", apiRouter);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

// Trigger CI
