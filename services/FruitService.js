import fruitGrid from "../functions/fruitGrid";
import { Database } from "bun:sqlite";
const db = new Database("fruit_crush.db");

/* Create the fruit table if it doesn't exist */
db.run(
  "CREATE TABLE IF NOT EXISTS fruit (id TEXT PRIMARY KEY, fruitgrid BLOB NOT NULL, moves INTEGER NOT NULL DEFAULT 10, username TEXT, completed BOOLEAN default 0 )"
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
    console.log(stmt);
    return stmt.get(gameId, fruitgrid);
  }

  async createWithUser(gameId, username) {
    newFruitGrid.initGrid();
    const fruitgrid = newFruitGrid.stringifyFruits();

    const stmt = this.db.prepare(
      "INSERT INTO fruit (id, fruitgrid, username) VALUES ($1, $2, $3)"
    );
    console.log(stmt);
    return stmt.get(gameId, fruitgrid, username);
  }

  async update(fruitGrid, userId) {
    const stmt = this.db.prepare(
      "UPDATE fruit SET fruitgrid = $1, moves = moves - 1 WHERE id = $2"
    );

    return stmt.run(fruitGrid, userId);
  }

  async getAll() {
    const stmt = this.db.prepare("SELECT * FROM fruit");
    return stmt.all();
  }

  async getOne(id) {
    const stmt = this.db.prepare("SELECT * FROM fruit WHERE id = ?");
    return stmt.get(id);
  }
}
