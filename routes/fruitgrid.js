var express = require("express");
var router = express.Router();
const db = require("../models/index");
const fruitService = require("../services/fruits");
const FruitService = new fruitService(db);

router.post("/", async (req, res, next) => {
  try {
    const clickedFruit = req.body.clickedFruit;
    console.log(clickedFruit);
  } catch (error) {
    console.warn(error);
    res.end();
  }
});

router.get("/", async (req, res, next) => {
  try {
    let data = await FruitService.getOne(1);
    if (!data) {
      await FruitService.create();
    }
    data = await FruitService.getOne(1);
    // const data = await FruitService.getAll();
    const dataBuffer = Buffer.from(data?.[0]?.fruitgrid ?? data.fruitgrid);
    const bufferToString = dataBuffer.toString("utf-8");
    res.json(bufferToString);
  } catch (error) {
    console.warn(error);
    res.end();
  }
});

module.exports = router;
