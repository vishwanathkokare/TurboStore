import sqlite3 from "sqlite3";

const DB_NAME = "TurboStore.db";
const TABLE_NAME = "storage";

const db = new sqlite3.Database(DB_NAME, (err) => {
  if (err) {
    console.error("❌ SQLite3 Connection Error:", err.message);
  } else {
    console.log("✅ Connected to SQLite3 database.");
  }
});

// Create table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    key TEXT PRIMARY KEY,
    value TEXT
  );`,
  (err) => {
    if (err) {
      console.error("❌ SQLite3 Table Creation Error:", err.message);
    } else {
      console.log("✅ SQLite3 Table Ready.");
    }
  }
);

const SQLiteStore = {
  async setItem(key, value) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR REPLACE INTO ${TABLE_NAME} (key, value) VALUES (?, ?);`,
        [key, value],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  },

  async getItem(key) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT value FROM ${TABLE_NAME} WHERE key = ?;`, [key], (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.value : null);
      });
    });
  },

  async removeItem(key) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM ${TABLE_NAME} WHERE key = ?;`, [key], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
};

export default SQLiteStore;
