import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import ShortUniqueId from "short-unique-id";
import { FruitService } from "./services/FruitService";
import { calculateFruitsDfs } from "./functions/checkEqualFruits";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import compression from "compression";
const { randomUUID } = new ShortUniqueId({
  length: 10,
});

// Initialize Express app and services
const app = express();

app.use(morgan("tiny"));
app.use(compression());

const server = createServer(app);
const io = new Server(server, {
  cookie: false,
});
const fruitService = new FruitService();

// Get the directory name using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  "/public/js",
  express.static(path.join(__dirname, "node_modules/socket.io/client-dist"))
);
app.use("/favicon.ico", express.static(path.join(__dirname, "favicon.ico")));

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

import { serialize, parse } from "cookie";

// Socket.IO connection handling
io.on("connection", async (socket) => {
  let userId;
  // called during the handshake
  try {
    const headers = socket.handshake.headers?.cookie ?? null;
    if (headers === null) {
      userId = randomUUID();
      io.engine.on("initial_headers", (headers, request) => {
        console.log(headers);
        headers["set-cookie"] = serialize("uid", userId, {
          sameSite: "strict",
        });
      });
    } else {
      userId = parse(headers).uid;
      console.log("userid in parse is ", userId);
    }

    // Initial data fetch and send
    let data = await fruitService.getOne(userId);
    if (!data) {
      await fruitService.create(userId);
      data = await fruitService.getOne(userId);
    }
    socket.emit("initial-data", data.fruitgrid);

    // Handle incoming messages
    socket.on("message", async (message) => {
      try {
        const result = await calculateFruitsDfs(message, userId);
        socket.emit("message", result);
      } catch (err) {
        socket.emit("error", `Something went wrong, error: ${err}`);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Connection closed");
    });
  } catch (error) {
    console.error("Error in socket connection:", error);
    socket.emit("error", "Internal server error");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
