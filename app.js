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
import { serialize, parse } from "cookie";
import supabase from "./supabase";
const { randomUUID } = new ShortUniqueId({
  length: 10,
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app and services
const app = express();

var completedRouter = require("./routes/completed");
var indexRouter = require("./routes/index");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(compression());

const server = createServer(app);
const io = new Server(server, {
  cookie: false,
});
const fruitService = new FruitService();

// Get the directory name using ES modules

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(
  "/public/js",
  express.static(path.join(__dirname, "node_modules/socket.io/client-dist"))
);
app.use(
  "/public/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/public/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/public/js/jquery.slim.min.js",
  express.static(
    path.join(__dirname, "node_modules/jquery/dist/jquery.slim.min.js")
  )
);

app.use("/favicon.ico", express.static(path.join(__dirname, "favicon.ico")));

// Serve index.html for root path

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });
app.use("/", indexRouter);
app.use("/completed", completedRouter);

// Socket.IO connection handling
io.on("connection", async (socket) => {
  let userId;
  // called during the handshake
  try {
    const headers = socket.handshake.headers?.cookie ?? null;
    if (headers === null) {
      userId = randomUUID();
      io.engine.on("initial_headers", (headers, request) => {
        headers["set-cookie"] = serialize("uid", userId, {
          sameSite: "strict",
        });
      });
    } else {
      userId = parse(headers).uid;
    }

    // Initial data fetch and send
    let data = await fruitService.getOne(userId);
    if (!data) {
      await fruitService.create(userId);
      data = await fruitService.getOne(userId);
    }
    socket.emit("initial-data", data.fruitgrid);
    let userScore = 0;
    let scoreCount = 0;
    // Handle incoming messages
    socket.on("message", async (message) => {
      try {
        const [result, score] = await calculateFruitsDfs(message, userId);

        if (scoreCount >= 10) {
          const { data, error } = await supabase
            .from("completedGames")
            .insert([{ score: userScore, gameId: userId, username: "admin" }])
            .select();

          if (error)
            throw new Error(
              "Something went wrong with writing to the database"
            );
          socket.emit("message", { gameEnded: true, data: data });
          userScore = 0;
          scoreCount = 0;
          //write to DB
          //end game
          //reset userScore and scoreCount
          //new ID
        }
        userScore += score;
        scoreCount++;
        console.log("userScore is ...!", userScore);
        socket.emit("message", { result: result, score: userScore });
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

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
