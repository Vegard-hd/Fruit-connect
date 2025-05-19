import FruitGrid from "../functions/FruitGrid";
import { Database } from "bun:sqlite";
const db = new Database(":memory:");
/* Create the fruit table if it doesn't exist */
await db.run(
  "CREATE TABLE IF NOT EXISTS fruit (id TEXT PRIMARY KEY, fruitgrid BLOB NOT NULL, moves INTEGER NOT NULL DEFAULT 10, username TEXT, gamescore INTEGER NOT NULL DEFAULT 0)"
);

const fruitGrid = new FruitGrid();

export class FruitService {
  constructor() {
    this.db = db;
  }

  /*   async create(gameId) {
    const newFruitGrid = new fruitGrid.initGrid(true);
    console.log(newFruitGrid);

    const fruitgridStringify = fruitGrid.stringifyFruits(newFruitGrid);

    const stmt = this.db.prepare(
      "INSERT INTO fruit (id, fruitgrid) VALUES ($1, $2)"
    );
    return await stmt.get(gameId, fruitgridStringify);
  } */

  async createWithUser(gameId, username) {
    const newFruitGrid = fruitGrid.initGrid(true);

    const fruitgridStringify = fruitGrid.stringifyFruits(newFruitGrid);

    const stmt = this.db.prepare(
      "INSERT INTO fruit (id, fruitgrid, username) VALUES ($1, $2, $3)"
    );
    return await stmt.get(gameId, fruitgridStringify, username);
  }

  async update(fruitGrid, gameId) {
    const stmt = this.db.prepare(
      "UPDATE fruit SET fruitgrid = $1 WHERE id = $2"
    );

    return await stmt.run(fruitGrid, gameId);
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
