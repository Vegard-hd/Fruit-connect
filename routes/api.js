import { Router } from "express";
const router = Router();

import { randomFruit } from "../functions/randomFruit";
import { FruitService } from "../services/FruitService";
import { CompletedGamesService } from "../services/CompletedGamesService";
const fruitService = new FruitService();
const completedService = new CompletedGamesService();
import MongoService from "../services/MongoClient";
const mongoService = new MongoService();

/* let timerActive;
let currentFruit = randomFruit();
let prevFruit = null;


function bonusFruit() {
  if (!timerActive) {
    timerActive = true;
    console.log("new interval started");
    setInterval(() => {
      prevFruit = currentFruit;
      currentFruit = randomFruit();
      console.log(currentFruit);
      if (prevFruit === currentFruit) currentFruit = randomFruit();
    }, 5000);
  }

  console.log(currentFruit);
  if (!currentFruit) currentFruit = "apple";
  return currentFruit;
}
 */

let fruits = ["Pear", "Mango", "Lemon", "Orange", "Apple", "Plum"];
let lastUpdate = Date.now();
let currentFruit = "Apple";
let interval = 5000;

function bonusFruit() {
  let now = Date.now();

  if (now - lastUpdate >= interval) {
    lastUpdate = now;
    let newFruit;
    do {
      newFruit = randomFruit().fruit;
    } while (newFruit === currentFruit); // Ensures new fruit is different

    currentFruit = newFruit;
    console.log("New fruit:", currentFruit);
  }

  return currentFruit;
}

//start game / landing page render
router.get("/bonusfruit", async (req, res, next) => {
  try {
    const outPutBonusFruit = bonusFruit();
    res.json(JSON.stringify(outPutBonusFruit));
  } catch (error) {
    console.warn(error);
    next(error);
  }
});

export default router;
