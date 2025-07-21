import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { FruitService } from "./services/FruitService";

import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import compression from "compression";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from "./routes/index";
import apiRouter from "./routes/api";
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

//init WebsocketService
import { WebsocketService } from "./services/WebsocketService";
const websocketService = new WebsocketService();

// Serve static files
app.use("/", express.static(path.join(__dirname, "public")));
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
  express.static(path.join(__dirname, "node_modules/socket.io/client-dist"))
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
app.use("/api", apiRouter);
app.use("/", indexRouter);

io.on("connection", async (socket) => {
  //TODO: Add a timer function for each game
  // giving players more time / moves on 3 equal fruits

  //TODO: Add 1 more fruit to increase the difficulty. (banana)

  websocketService.websocketHandler(socket);
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
