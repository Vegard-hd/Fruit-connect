var express = require("express");
const fs = require("fs");
var router = express.Router();
const fruitGrid = require("../functions/fruitGrid");
const db = require("../models/index");
const fruitService = require("../services/fruits");
const FruitService = new fruitService(db);

function reviver(key, value) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

/* GET home page. */
var newFruitGrid = new fruitGrid();

router.get("/", function (req, res, next) {
  newFruitGrid.initGrid();
  FruitService.create("Apple");
  res.json(newFruitGrid.stringifyFruits());
});
router.get("/all", async (req, res, next) => {
  try {
    const data = await FruitService.getAll();
    // const readStream = data[0].fruitgrid.toString();
    // console.log(readStream);

    const dataBuffer = Buffer.from(data[0].fruitgrid);
    console.log(dataBuffer);
    const bufferToJson = JSON.stringify(dataBuffer, replacer);
    console.log(bufferToJson);
    res.send("").end();
  } catch (error) {
    console.warn(error);
  }
});

module.exports = router;
