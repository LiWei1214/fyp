require('dotenv').config();
const { Pool } = require("pg");

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connection
pool.connect()
  .then(client => {
    console.log("✅ PostgreSQL Connected Successfully!");
    client.release();
  })
  .catch(err => {
    console.error("❌ PostgreSQL Connection Failed:", err);
  });

module.exports = pool;
