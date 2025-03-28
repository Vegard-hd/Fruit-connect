import dotenv from "dotenv";
dotenv.config({ encoding: "latin-1" });

const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;
const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
mongoose
  .connect(uri, {
    dbName: "fruit-connect",
  })
  .then(() => console.log("MongoDB connected!"));

const CompletedGamesSchema = new Schema({
  gameId: String,
  username: String,
  score: Number,
  date: {
    type: Date,
    default: () => new Date(),
  },
});

const CompletedGame = mongoose.model("CompletedGame", CompletedGamesSchema);

class CompletedGamesService {
  async getOne(id) {
    try {
      return await CompletedGame.findOne({ gameId: id }).exec();
    } catch (error) {
      console.error(" Error getting one completed game", error);
      throw error;
    }
  }
  async getTop10() {
    try {
      const top10 = await CompletedGame.find()
        .sort({ score: -1 })
        .limit(10)
        .exec();
      return top10;
    } catch (error) {
      console.error("Error getting top 10 games:", error);
      throw error;
    }
  }

  async saveGame(username, score, gameId) {
    try {
      const newGame = new CompletedGame({ username, score, gameId });
      await newGame.save();
      return newGame;
    } catch (error) {
      console.error("Error saving game:", error);
      throw error;
    }
  }
}

export default CompletedGamesService;
