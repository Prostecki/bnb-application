import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRouter from "./routes/user.route.js";
import apiRouter from "./routes/api.route.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/users", userRouter);
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
