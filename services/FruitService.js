const fruitGrid = require("../functions/fruitGrid");
const { Database } = require("bun:sqlite");

const db = new Database("fruit_crush.db");

/* Create the fruit table if it doesn't exist */
db.run(
  "CREATE TABLE IF NOT EXISTS fruit (id INTEGER PRIMARY KEY AUTOINCREMENT, fruitgrid BLOB NOT NULL)"
);

var newFruitGrid = new fruitGrid();

class FruitService {
  constructor() {
    this.db = db;
  }

  async create() {
    newFruitGrid.initGrid();
    const fruitgrid = newFruitGrid.stringifyFruits();

    const stmt = this.db.prepare("INSERT INTO fruit (fruitgrid) VALUES (?)");

    return stmt.run(fruitgrid);
  }

  async update(fruitGrid) {
    const stmt = this.db.prepare("UPDATE fruit SET fruitgrid = ? WHERE id = ?");

    return stmt.run(fruitGrid, 1);
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

module.exports = FruitService;
