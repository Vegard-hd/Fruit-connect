var express = require("express");
var router = express.Router();
const db = require("../models/index");
const fruitService = require("../services/fruits");
const FruitService = new fruitService(db);
const randomFruit = require("../functions/randomFruit");
const {
  fruitLogic,
  calculateEqualFruits,
  calculateRow,
} = require("../functions/checkEqualFruits");

router.post("/", async (req, res, next) => {
  try {
    // 1) Retrieve or create the stored data
    let data = await FruitService.getOne(1);
    if (!data) {
      await FruitService.create();
      data = await FruitService.getOne(1);
    }
    const dataBuffer = Buffer.from(data?.[0]?.fruitgrid ?? data.fruitgrid);
    const bufferToString = dataBuffer.toString("utf-8");
    // gameFruitArr is a 1D array holding all rows consecutively
    const gameFruitArr = JSON.parse(bufferToString);

    // 2) Parse user input
    const clickedFruit = req.body.fruit;
    const convertedInput = await JSON.parse(clickedFruit);
    const clickedId = await JSON.parse(clickedFruit);

    // 4) Option A: locate the clicked fruit by ID if needed
    const clickedIndex = gameFruitArr.findIndex(
      (element) => element?.i?.id === clickedId
    );

    // If the fruit isn't found, handle error
    if (clickedIndex === -1) {
      return res.status(400).json({ message: "Fruit not found" }).end();
    }

    //handle extra check to match backend fruit type with userinput
    const clickedFruitBackend = gameFruitArr[clickedIndex].i.fruit;
    const clickedFruitId = gameFruitArr[clickedIndex].i.id;
    if (clickedFruitId !== clickedId) {
      throw new Error("id user provided is not correct");
    }
    const output = fruitLogic(gameFruitArr, clickedIndex);
    const jsonFruitGrid = JSON.stringify(output);
    await FruitService.update(jsonFruitGrid);

    return res.status(201).json(jsonFruitGrid);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

router.get("/", async (req, res, next) => {
  try {
    let data = await FruitService.getOne(1);
    if (!data) {
      await FruitService.create();
    }
    data = await FruitService.getOne(1);
    // console.log(data);
    // const data = await FruitService.getAll();
    const dataBuffer = Buffer.from(data?.[0]?.fruitgrid ?? data.fruitgrid);
    const bufferToString = dataBuffer.toString("utf-8");
    // console.log(bufferToString);
    res.json(bufferToString);
  } catch (error) {
    console.warn(error);
    res.end();
  }
});

module.exports = router;
