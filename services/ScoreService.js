const { Database } = require("bun:sqlite");

const db = new Database("fruit_crush.db");

/* Create the fruit table if it doesn't exist */
db.run(
  "CREATE TABLE IF NOT EXISTS score (id INTEGER PRIMARY KEY AUTOINCREMENT, gamescore INTEGER NOT NULL)"
);

class FruitService {
  constructor() {
    this.db = db;
  }

  async create() {
    const stmt = this.db.prepare("INSERT INTO score (gamescore) VALUES (0)");

    return stmt.run();
  }

  async update(scoreToIncrement, id) {
    const stmt = this.db.prepare(
      "UPDATE score SET gamescore = gamescore + ?1 WHERE id = ?2"
    );
    return stmt.run(scoreToIncrement, id);
  }

  async getAll() {
    const stmt = this.db.prepare("SELECT * FROM fruit");
    return stmt.all();
  }

  async getOne(id) {
    const stmt = this.db.prepare("SELECT * FROM score WHERE id = ?");
    return stmt.get(id);
  }
}

module.exports = FruitService;
