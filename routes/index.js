import { Router } from "express";
var router = Router();
import supabase from "../supabase";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({
  length: 12,
});
import { FruitService } from "../services/FruitService";
import { CompletedGamesService } from "../services/CompletedGamesService";
const fruitService = new FruitService();
const completedService = new CompletedGamesService();

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
    if (!game) next(error);
    const [gameData, top20] = await Promise.all([
      await supabase.from("completedGames").select("*").ilike("gameId", game),
      await supabase
        .from("completedGames")
        .select("*")
        .order("score", { ascending: false })
        .limit(20),
    ]).catch((e) => {
      throw new Error("Failed to get data from the supabase database");
    });

    res.render("completed", {
      gameData: gameData?.data[0],
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
