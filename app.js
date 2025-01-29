import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { createBunWebSocket } from "hono/bun";
import { ServerWebSocket } from "bun";
import {
  findConnectedFruits,
  removeAndShiftFruits,
  calculateFruitsDfs,
} from "./functions/checkEqualFruits";

import { FruitService } from "./services/FruitService";
const fruitService = new FruitService();

const app = new Hono();
const { upgradeWebSocket, websocket } = createBunWebSocket();

// Serve all static files from the "static" directory
app.use("/public/*", serveStatic({ root: "./" }));
app.use("/favicon.ico", serveStatic({ path: "./favicon.ico" }));

// Serve index.html directly from the static folder for the root path
app.get("/", serveStatic({ path: "/public/index.html" }));

app.get(
  "/ws",
  upgradeWebSocket((c) => {
    return {
      async onOpen(event, ws) {
        let data = await fruitService.getOne(1);
        if (!data) {
          await fruitService.create();
          data = await fruitService.getOne(1);
        }
        ws.send(data.fruitgrid);
      },
      async onMessage(event, ws) {
        await calculateFruitsDfs(event.data)
          .then((data) => {
            ws.send(data);
          })
          .catch((err) => {
            ws.send(`Something went wrong, error: ${err}`);
          });
      },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  })
);

// Fallback route for all other paths
// app.get("*", serveStatic({ path: "./public/fallback.txt" }));

// ...

export default {
  port: 3000,
  fetch: app.fetch,
  websocket,
};
