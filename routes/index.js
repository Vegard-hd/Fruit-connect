import { Router } from "express";
var router = Router();
import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({
  length: 12,
});
import { FruitService } from "../services/FruitService";
const fruitService = new FruitService();

//redirect endpoint generating a new id
router.get("/creategame", async (req, res, next) => {
  const gameId = randomUUID();
  fruitService.create(gameId); //create game with this id in the DB
  res.redirect(`/game=${gameId}`);
});

//actual websocket game
router.get("/:game", async (req, res, next) => {
  const { game } = req.params;
  const gameId = game.split("=").at(-1);
  console.log(gameId);
  res.render("index");
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
