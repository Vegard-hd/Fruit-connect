import { Router } from "express";
var router = Router();
import supabase from "../supabase";
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({
  length: 12,
});
import { FruitService } from "../services/FruitService";
const fruitService = new FruitService();

router.get("/completed", async (req, res, next) => {
  try {
    console.log("req params in completed router is .... ", req.query);
    const { game } = req.query;
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
    console.log(top20.data);
    res.render("completed", { gameData: gameData?.data[0], top20: top20 });
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
  console.log("username is ...", username);
  const gameId = randomUUID();
  fruitService.createWithUser(gameId, username); //create game with this id in the DB
  res.redirect(`/game?=${gameId}`);
});

//actual websocket game
router.get("/:game", async (req, res, next) => {
  const { game } = req.params;
  const gameId = game.split("=").at(-1);
  if (gameId) {
    return res.render("index", { gameId: gameId });
  } else {
    next(error);
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
