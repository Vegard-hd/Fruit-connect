import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();

// Serve all static files from the "static" directory
app.use("/public/*", serveStatic({ root: "./" }));
app.use("/favicon.ico", serveStatic({ path: "./favicon.ico" }));

// Serve index.html directly from the static folder for the root path
app.get("/", serveStatic({ path: "/public/index.html" }));

// Fallback route for all other paths
// app.get("*", serveStatic({ path: "./public/fallback.txt" }));

export default {
  port: 3000,
  fetch: app.fetch,
};
