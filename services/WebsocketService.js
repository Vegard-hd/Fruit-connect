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

  async #getGameTimeRemaining(gameId) {
    const timeleftFromDB = await this.fruitService.getTimeLeft(gameId);
    if (!timeleftFromDB) return false;
    const timeleft = new Date(timeleftFromDB.timeleft).valueOf();
    const currentTime = new Date().valueOf();
    return timeleft - currentTime;
  }
  #gameLoop(handleGameEnded, gameId, socket) {
    let thisIntervalName = `${gameId}-interval`;
    thisIntervalName = setInterval(async () => {
      let timeRemaining = await this.#getGameTimeRemaining(gameId);
      socket.emit("message", {
        timeRemaining: timeRemaining,
      });
      console.log("Game loop", timeRemaining);
      if (timeRemaining <= 0 || !timeRemaining) {
        await handleGameEnded();
        clearInterval(thisIntervalName);
      }
    }, 200);
  }

  async #handleGameEnded(socket, newGameId) {
    //gameEnded
    return await this.fruitService
      .getOne(newGameId)
      .then(async (updatedGameData) => {
        if (
          updatedGameData?.gamescore === 0 ||
          !updatedGameData ||
          !updatedGameData?.gamescore
        ) {
          return;
        }

        Promise.all([
          await this.fruitService.deleteOne(newGameId), //removes from sqlite in memory
          await this.completedGamesService.saveGame(
            //inserts into completed_games.db
            updatedGameData?.username ?? newGameId,
            Number.parseInt(updatedGameData.gamescore, 10),
            newGameId
          ),
        ]);
      })
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

  async #bonusFruitInterval(socket) {
    if (WebsocketService.intervalStarted === true) return;
    var currentTime = new Date().valueOf();
    WebsocketService.intervalStarted = true;
    let currentBonusFruit = bonusFruit();

    socket.broadcast.emit("message", {
      bonusfruit: currentBonusFruit,
    });
    setInterval(() => {
      currentTime = new Date().valueOf();
      currentBonusFruit = bonusFruit();
      socket.broadcast.emit("message", {
        bonusfruit: currentBonusFruit,
      });
    }, 200);
    return currentTime;
  }

  async websocketHandler(socket) {
    try {
      var gameTimeLeft = 10;

      if (socket.request.headers.referer.split("/").at(-1) === "completed") {
        return;
      }
      const newGameId = socket.request.headers.referer.split("?id=").at(-1);

      if (!newGameId) {
        throw new Error("Failed to get game id");
      }
      const [gameData, topScores] = await Promise.all([
        await this.fruitService.getOne(newGameId),
        await this.completedGamesService.getTop10(),
      ]).catch((e) => {
        console.warn(e);
        return;
      });
      if (gameData?.completed === 1) {
        return; //game is completed do nothing
      }
      socket.emit("initial-data", {
        data: gameData?.fruitgrid,
        topScores: topScores,
        movesLeft: gameData?.moves,
        score: gameData?.gamescore,
      });

      await this.#bonusFruitInterval(socket);

      const bindHandleGameComplete = this.#handleGameEnded.bind(
        this,
        socket,
        newGameId
      );

      this.#gameLoop(bindHandleGameComplete, newGameId, socket);

      socket.on("message", async (message) => {
        try {
          const result = await gameCalculationsV1(message, newGameId);

          const updatedGameData = await this.fruitService.getOne(newGameId);

          if (updatedGameData.moves <= 0) {
            gameEnded = true;
            await this.#handleGameEnded(socket, newGameId);
          }

          socket.emit("message", {
            result: result,
            score: updatedGameData.gamescore,
            movesLeft: updatedGameData.moves,
          });
        } catch (err) {
          console.warn(err);
          socket.emit("error", `Something went wrong, error: ${err}`);
        }
      });

      socket.on("disconnect", async () => {
        // await this.#handleGameEnded(socket, newGameId, this.fruitService);
        // Handle disconnection
        // NOTE: if sqlite memory clears in progress games - refreshing does not work
      });
    } catch (error) {
      console.error("Error in socket connection:", error);
      socket.emit("error", "Internal server error");
    }
  }
}
