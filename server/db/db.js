require('dotenv').config();
const mysql = require('mysql2');

// MySQL connection settings
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Failed:', err);
    return;
  }
  console.log('✅ MySQL Connected Successfully!');
});

module.exports = db;
