import FruitGrid from "../functions/fruitGrid.js";
import { Database } from "bun:sqlite";
const db = new Database(":memory:");

await db.run(`CREATE TABLE IF NOT EXISTS fruit
  (id TEXT PRIMARY KEY, fruitgrid BLOB NOT NULL,
  moves INTEGER NOT NULL DEFAULT 10, username TEXT,
  gamescore INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME,
  timeleft DATETIME 
  )`);

const fruitGrid = new FruitGrid();

export class FruitService {
  constructor() {
    this.db = db;
  }

  async getTimeLeft(gameId) {
    const stmt = this.db.prepare(
      "SELECT created_at, timeleft FROM fruit WHERE id = ?"
    );
    return await stmt.get(gameId);
  }

  async createWithUser(gameId, username) {
    const currentTime = new Date();

    const defaultExpireTime = new Date(currentTime.getTime() + 10 * 1000);

    const newFruitGrid = fruitGrid.initGrid(true);

    const fruitgridStringify = fruitGrid.stringifyFruits(newFruitGrid);

    const stmt = this.db.prepare(
      "INSERT INTO fruit (id, fruitgrid, username, created_at, timeleft) VALUES ($1, $2, $3, $4, $5)"
    );
    return await stmt.get(
      gameId,
      fruitgridStringify,
      username,
      currentTime.toISOString(),
      defaultExpireTime.toISOString()
    );
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
