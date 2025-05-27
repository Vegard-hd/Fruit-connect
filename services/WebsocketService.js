import gameCalculationsV1 from "../functions/gameLogic";
import { bonusFruit } from "../functions/bonusFruit";
import { FruitService } from "./FruitService";
import CompletedGamesService from "./MongoClient";

export class WebsocketService {
  constructor() {
    this.fruitService = new FruitService();
    this.completedGamesService = new CompletedGamesService();
  }
  static {
    WebsocketService.intervalStarted = false;
  }

  async #bonusFruitInterval(socket) {
    if (WebsocketService.intervalStarted === false) {
      // game ticker
      WebsocketService.intervalStarted = true;
      let currentBonusFruit = bonusFruit();
      socket.broadcast.emit("message", {
        bonusfruit: currentBonusFruit,
      });
      setInterval(() => {
        currentBonusFruit = bonusFruit();
        socket.broadcast.emit("message", {
          bonusfruit: currentBonusFruit,
        });
      }, 500);
    }
  }
  async websocketHandler(socket) {
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
        await this.fruitService.getOne(newGameId),
        await this.completedGamesService.getTop10(),
      ]).catch((e) => {
        console.warn(e);
        return;
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
      this.#bonusFruitInterval(socket);

      socket.on("message", async (message) => {
        try {
          const result = await gameCalculationsV1(message, newGameId);
          const updatedGameData = await this.fruitService.getOne(newGameId);
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
              await this.fruitService.deleteOne(newGameId), //removes from sqlite in memory
              await this.completedGamesService.saveGame(
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

      socket.on("disconnect", async () => {
        // Handle disconnection
        // NOTE: if sqlite memory clears in progress games - refreshing does not work
      });
    } catch (error) {
      console.error("Error in socket connection:", error);
      socket.emit("error", "Internal server error");
    }
  }
}
