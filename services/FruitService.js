import fruitGrid from "../functions/fruitGrid";
import { Database } from "bun:sqlite";
const db = new Database(":memory:");
/* Create the fruit table if it doesn't exist */
await db.run(
  "CREATE TABLE IF NOT EXISTS fruit (id TEXT PRIMARY KEY, fruitgrid BLOB NOT NULL, moves INTEGER NOT NULL DEFAULT 10, username TEXT, gamescore INTEGER NOT NULL DEFAULT 0)"
);

var newFruitGrid = new fruitGrid();

export class FruitService {
  constructor() {
    this.db = db;
  }

  async create(gameId) {
    newFruitGrid.initGrid();
    const fruitgrid = newFruitGrid.stringifyFruits();

    const stmt = this.db.prepare(
      "INSERT INTO fruit (id, fruitgrid) VALUES ($1, $2)"
    );
    return await stmt.get(gameId, fruitgrid);
  }

  async createWithUser(gameId, username) {
    newFruitGrid.initGrid();
    const fruitgrid = newFruitGrid.stringifyFruits();

    const stmt = this.db.prepare(
      "INSERT INTO fruit (id, fruitgrid, username) VALUES ($1, $2, $3)"
    );
    return await stmt.get(gameId, fruitgrid, username);
  }

  async update(fruitGrid, gameId) {
    const stmt = this.db.prepare(
      "UPDATE fruit SET fruitgrid = $1 WHERE id = $2"
    );

    return await stmt.run(fruitGrid, gameId);
  }
  async geminiCombined(fruitGrid, gameId, scoreToIncrement) {
    const stmt = this.db.prepare(
      "UPDATE fruit SET fruitgrid = $1, moves = moves - 1, gamescore = gamescore + $3 WHERE id = $2"
    );
    return await stmt.run(fruitGrid, gameId, scoreToIncrement);
  }
  async decrementMoves(gameId) {
    const stmt = this.db.prepare(
      "UPDATE fruit SET moves = moves -1 WHERE id = $1"
    );
    return await stmt.run(gameId);
  }
  async updateScore(scoreToIncrement, gameId) {
    const stmt = this.db.query(
      "UPDATE fruit SET gamescore = gamescore + $1 WHERE id = $2"
    );
    return await stmt.run(scoreToIncrement, gameId);
  }
  async getAll() {
    const stmt = this.db.prepare("SELECT * FROM fruit");
    return await stmt.all();
  }
  async deleteOne(gameId) {
    const stmt = this.db.prepare("DELETE FROM fruit WHERE id = ?");
    return await stmt.run(gameId);
  }

  async getOne(id) {
    const stmt = this.db.prepare("SELECT * FROM fruit WHERE id = ?");
    return await stmt.get(id);
  }
}
