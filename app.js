import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { FruitService } from "./services/FruitService";
// import { CompletedGamesService } from "./services/CompletedGamesService";
import gameCalculationsV1 from "./functions/gameLogic";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import compression from "compression";

import fetchTopScores from "./functions/fecthSupaData";

import CompletedGamesService from "./services/MongoClient";
const completedGamesService = new CompletedGamesService();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from "./routes/index";
// import { router } from "./routes/index";
const app = express();

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
// const completedService = new CompletedGamesService();

// Get the directory name using ES modules

// Serve static files
app.use("/", express.static(path.join(__dirname, "public")));
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
  express.static(path.join(__dirname, "node_modules/socket.io/client-dist"))
);
app.use(
  "/supabase",
  express.static(
    path.join(__dirname, "node_modules/@supabase/supabase-js/dist/module")
  )
);
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js/jquery.slim.min.js",
  express.static(
    path.join(__dirname, "node_modules/jquery/dist/jquery.slim.min.js")
  )
);

app.use("/favicon.ico", express.static(path.join(__dirname, "favicon.ico")));

app.use("/", indexRouter);

io.on("connection", async (socket) => {
  let gameEnded;
  try {
    if (socket.request.headers.referer.split("/").at(-1) === "completed") {
      return;
    }
    const newGameId = socket.request.headers.referer.split("?id=").at(-1);

    if (!newGameId) {
      throw new Error("Failed to get game id");
    }
    const [data, topScores] = await Promise.all([
      await fruitService.getOne(newGameId),
      await completedGamesService.getTop10(),
    ]).catch((e) => {
      console.warn(e);
      throw new Error("Failed to retrieve data");
    });
    if (data?.completed === 1) {
      return; //game is completed do nothing
    }
    socket.emit("initial-data", {
      data: data?.fruitgrid,
      topScores: topScores,
      movesLeft: data?.moves,
      score: data?.gamescore,
    });

    socket.on("message", async (message) => {
      try {
        const result = await gameCalculationsV1(message, newGameId);
        const updatedGameData = await fruitService.getOne(newGameId);
        if (updatedGameData.moves <= 0) {
          gameEnded = true;
        }
        socket.emit("message", {
          result: result,
          score: updatedGameData.gamescore,
          movesLeft: updatedGameData.moves,
        });
        if (gameEnded === true) {
          //gameEnded
          await Promise.all([
            await fruitService.deleteOne(newGameId), //removes from sqlite in memory
            await completedGamesService.saveGame(
              //inserts into completed_games.db
              data?.username ?? newGameId,
              Number.parseInt(updatedGameData.gamescore, 10),
              newGameId
            ),
          ])
            .catch((e) => {
              console.warn(e);
            })
            .then(() => {
              socket.emit("message", { gameEnded: true });
            })
            .finally(() => {
              socket.disconnect(true);
            });
        }
      } catch (err) {
        console.warn(err);
        socket.emit("error", `Something went wrong, error: ${err}`);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {});
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
