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
var indexRouter = require("./routes/index").default;
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
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
  express.static(path.join(__dirname, "node_modules/socket.io/client-dist"))
);
app.use(
  "/public/supabase",
  express.static(
    path.join(__dirname, "node_modules/@supabase/supabase-js/dist/module")
  )
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

async function fetchTopScores() {
  const { data, error } = await supabase
    .from("completedGames")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching top scores:", error);
  } else {
    return data;
  }
}
app.use("/completed", completedRouter);
app.use("/", indexRouter);

// Socket.IO connection handling
io.on("connection", async (socket) => {
  try {
    const newGameId = socket.request.headers.referer.split("?=").at(-1);

    if (!newGameId) {
      throw new Error("Failed to get game id");
    }
    const [data, topScores] = await Promise.all([
      await fruitService.getOne(newGameId),
      await fetchTopScores(),
    ]).catch((e) => {
      console.warn(e);
      throw new Error("Failed to retrieve data");
    });
    console.log("websocket connected");
    socket.emit("initial-data", { data: data.fruitgrid, topScores: topScores });
    let userScore = 0;
    // Handle incoming messages

    supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "completedGames" },
        async (payload) => {
          const topScores = await fetchTopScores();
          socket.emit("message", { topScores: topScores });
        }
      )
      .subscribe();
    socket.on("message", async (message) => {
      try {
        const [result, score, gameEnded, movesLeft] = await calculateFruitsDfs(
          message,
          newGameId
        );
        console.log(gameEnded, movesLeft);
        if (gameEnded === true) {
          //gameEnded
          console.log("inside gameEnded logic....", gameEnded);
          const { supabaseData, error } = await supabase
            .from("completedGames")
            .insert([
              {
                score: userScore,
                gameId: newGameId,
                username: data?.username ?? newGameId,
              },
            ])
            .select();

          if (error)
            throw new Error(
              "Something went wrong with writing to the database"
            );
          socket.emit("message", { gameEnded: true, data: supabaseData });
          socket.disconnect(true);
        } else {
          userScore += score;
          console.log("userScore is ...!", userScore);
          socket.emit("message", {
            result: result,
            score: userScore,
            movesLeft: movesLeft,
          });
        }
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
