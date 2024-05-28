// db/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Create Users table
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Create Plants table
  db.run(`
    CREATE TABLE plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      area TEXT NOT NULL,
      variety TEXT NOT NULL,
      number INTEGER NOT NULL
    )
  `);

  // Create PlantRequests table
  db.run(`
    CREATE TABLE plantRequests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      plantId INTEGER,
      area TEXT NOT NULL,
      variety TEXT NOT NULL,
      number INTEGER NOT NULL,
      paymentStatus TEXT DEFAULT 'Pending',
      approvalStatus BOOLEAN DEFAULT 0,
      adminComment TEXT,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (plantId) REFERENCES plants(id)
    )
  `);

  // Insert admin user
  db.run(`INSERT INTO users (username, password) VALUES ('admin', 'admin')`);
});

module.exports = db;
