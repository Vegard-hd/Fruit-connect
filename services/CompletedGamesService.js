import { Database } from "bun:sqlite";
const db = new Database("completed_games.db");
/* Create the fruit table if it doesn't exist */
await db.run(
  "CREATE TABLE IF NOT EXISTS games (id TEXT PRIMARY KEY, fruitgrid BLOB NOT NULL, username TEXT, completed BOOLEAN NOT NULL, completed_at DATETIME NOT NULL)"
);

export class CompletedGamesService {
  constructor() {
    this.db = db;
  }

  async create(gameId, username, fruitGrid) {
    const stmt = this.db.prepare(
      "INSERT INTO games (id, fruitgrid, username, completed, completed_at) VALUES ($1, $2, $3, $4, $5 )"
    );
    return await stmt.run(
      gameId,
      fruitGrid,
      username,
      1,
      new Date().toISOString()
    );
  }

  async getOne(gameId) {
    const stmt = this.db.prepare("SELECT * FROM games WHERE id = ?");
    return await stmt.get(gameId);
  }
}
