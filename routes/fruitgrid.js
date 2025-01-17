var express = require("express");
var router = express.Router();
const db = require("../models/index");
const fruitService = require("../services/fruits");
const FruitService = new fruitService(db);
const randomFruit = require("../functions/randomFruit");
const {
  threeEqual,
  fourEqual,
  fiveEqual,
  calculateEqualFruits,
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
    const clickedFruit = req.body.fruitData;
    const convertedInput = JSON.parse(clickedFruit);
    const mappedBody = {
      clickedRow: Number.parseInt(convertedInput.clickedRow, 10), // e.g. 1..12
      fruitId: convertedInput.fruitId, // e.g. 'OWUVRL'
      yAxis: Number.parseInt(convertedInput.yAxis, 10), // e.g. 0..9
    };

    // 3) Calculate row/column indices (if you store rows contiguously in a 1D array)
    const fruitsPerRow = 10; // number of vertical fruits per row
    const rowIndex = mappedBody.clickedRow - 1; // zero-based row index
    const rowStart = rowIndex * fruitsPerRow; // start index in the array for this row
    const rowEnd = rowStart + fruitsPerRow - 1; // end index in the array for this row

    console.log(
      `rowstart: ${rowStart}, rowend: ${rowEnd}, rowindex: ${rowIndex}`
    );

    // 4) Option A: locate the clicked fruit by ID if needed
    const clickedIndex = gameFruitArr.findIndex(
      (element) => element?.i?.id === mappedBody.fruitId
    );

    // If the fruit isn't found, handle error
    if (clickedIndex === -1) {
      return res.status(400).json({ message: "Fruit not found" }).end();
    }

    // 5) Invert the shifting direction
    //    Example: If you want to remove the clicked fruit and shift everything
    //    *above* it “up”, you loop from clickedIndex upward.
    //
    //    For example, if yAxis=9 (topmost) is removed, everything else gets lifted
    //    toward the top, and you insert a new fruit at the *bottom*.
    //
    //    This loop copies the element just above i down into position i.
    let score = calculateEqualFruits(
      gameFruitArr,
      clickedIndex,
      rowIndex,
      rowStart,
      rowEnd
    );
    console.log("score is .... ", score);

    for (let i = clickedIndex; i > rowStart; i--) {
      gameFruitArr[i] = gameFruitArr[i - 1];
    }
    const rFruit = randomFruit();
    // 6) Insert new fruit at the top or bottom as needed:
    //    - If you want the new fruit at the *bottom* after shifting, do:
    gameFruitArr[rowStart] = { i: rFruit };

    //    - Alternatively, if you want the new fruit at the *top* after shifting, invert the logic:
    //      for (let i = clickedIndex; i < rowEnd; i++) { ... }
    //      gameFruitArr[rowEnd] = { i: randomFruit() };

    // 7) Save updated array back to DB
    const jsonFruitGrid = JSON.stringify(gameFruitArr);
    await FruitService.update(jsonFruitGrid);

    return res.status(201).json(JSON.stringify(rFruit)).end();
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
