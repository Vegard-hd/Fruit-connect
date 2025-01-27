var express = require("express");
var router = express.Router();

const FruitService = require("../services/FruitService");
const fruitService = new FruitService();

const randomFruit = require("../functions/randomFruit");
const {
  removeAndShiftFruits,
  findConnectedFruits,
} = require("../functions/checkEqualFruits");

router.post("/", async (req, res, next) => {
  try {
    // 1) Retrieve or create the stored data
    let data = await fruitService.getOne(1);
    if (!data) {
      await fruitService.create();
      data = await fruitService.getOne(1);
    }
    const dataBuffer = Buffer.from(data?.[0]?.fruitgrid ?? data.fruitgrid);
    const bufferToString = dataBuffer.toString("utf-8");
    const gameFruitArr = JSON.parse(bufferToString);

    const clickedId = req.body.fruit;

    const clickedIndex = gameFruitArr.findIndex(
      (element) => element?.i?.id === clickedId
    );

    // If the fruit isn't found, handle error
    if (clickedIndex === -1) {
      return res.status(400).json({ message: "Fruit not found" }).end();
    }

    //handle extra check to match backend fruit type with userinput

    const connectedIndices = await findConnectedFruits(
      gameFruitArr,
      clickedIndex,
      10,
      12
    );
    const indexPlusNewFruit = [...connectedIndices].map((element) => {
      return {
        index: element,
        newFruit: randomFruit(),
      };
    });

    const finishedArr = await removeAndShiftFruits(
      gameFruitArr,
      indexPlusNewFruit,
      randomFruit
    );
    const jsonFruitGrid = JSON.stringify(finishedArr);
    await fruitService.update(jsonFruitGrid); //rewrites entire fruitGameArr

    const jsonNewDataAndFruit = JSON.stringify(indexPlusNewFruit); // sends only indexes to remove + newFruits
    return res.status(201).json(jsonNewDataAndFruit);
  } catch (error) {
    console.warn(error);
    return res.status(500).end();
  }
});

router.get("/", async (req, res, next) => {
  try {
    let data = await fruitService.getOne(1);

    if (!data) {
      await fruitService.create();
      data = await fruitService.getOne(1);
    }
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
