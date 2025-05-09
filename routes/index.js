import { Router } from "express";
var router = Router();
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({
  length: 12,
});
import { FruitService } from "../services/FruitService";
import { CompletedGamesService } from "../services/CompletedGamesService";
const fruitService = new FruitService();
const completedService = new CompletedGamesService();
import MongoService from "../services/MongoClient";
const mongoService = new MongoService();

function convertDateString(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleDateString("en-DE", options);
}

router.get("/completed", async (req, res, next) => {
  try {
    const { game } = req.query;

    if (!game) next("Game does not exist");
    const [gameData, top20] = await Promise.all([
      await mongoService.getOne(game),
      await mongoService.getTop10(),
    ]).catch((e) => {
      throw new Error("Failed to get data in /completed router", error);
    });
    res.render("completed", {
      gameData: gameData,
      top20: top20,
      convertDateString: convertDateString,
    });
  } catch (error) {
    next(error);
  }
});

//redirect endpoint generating a new id
router.get("/creategame", async (req, res, next) => {
  let username;
  if (req.query?.username) {
    username = req.query?.username;
  }
  const gameId = randomUUID();
  await fruitService.createWithUser(gameId, username); //create game with this id in the DB
  res.redirect(`/game?id=${gameId}`);
});

//actual websocket game
router.get("/game", async (req, res, next) => {
  const { id } = req.query;
  try {
    // const gameId
    if (id) {
      const gameData = await fruitService.getOne(id);
      if (!gameData) {
        const gameCompleted = await completedService.getOne(id);
        return res.redirect(`/completed?game=${gameCompleted.id}`);
      }
      return res.render("index", {
        gameId: id,
        movesLeft: gameData?.moves,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.warn(error);
    res.redirect("/");
  }
});

//start game / landing page render
router.get("/", async (req, res, next) => {
  try {
    res.render("landingPage.ejs");
  } catch (error) {
    next(error);
  }
});

export default router;
