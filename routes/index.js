var express = require("express");
var router = express.Router();
const ScoreService = require("../services/ScoreService");
const scoreService = new ScoreService();

router.get("/", async (req, res, next) => {
  let score = await scoreService.getOne(1);
  if (!score) {
    await scoreService.create();
    score = scoreService.getOne(1);
  }
  res.render("index", { score: score });
});

module.exports = router;
