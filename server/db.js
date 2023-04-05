const mysql = require("mysql2/promise");

async function connectDB() {
  try {
    return await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;
