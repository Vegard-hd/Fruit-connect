import fruitGrid from "../functions/fruitGrid";
import { Database } from "bun:sqlite";
import { randomFruit } from "../functions/randomFruit";
const db = new Database("fruit_crush.db");

/* Create the fruit table if it doesn't exist */
db.run(
  "CREATE TABLE IF NOT EXISTS fruit (id TEXT PRIMARY KEY, fruitgrid BLOB NOT NULL)"
);

var newFruitGrid = new fruitGrid();

export class FruitService {
  constructor() {
    this.db = db;
  }

  async create(userid) {
    newFruitGrid.initGrid();
    const fruitgrid = newFruitGrid.stringifyFruits();

    const stmt = this.db.prepare(
      "INSERT INTO fruit (id, fruitgrid) VALUES ($1, $2)"
    );
    console.log(stmt);
    return stmt.get(userid, fruitgrid);
  }

  async update(fruitGrid, userId) {
    const stmt = this.db.prepare(
      "UPDATE fruit SET fruitgrid = $1 WHERE id = $2"
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
