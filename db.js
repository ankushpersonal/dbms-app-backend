const mysql = require("mysql2");

// Creating a sql pool with db details
/**
 * It creates a connection when called with sql.query and ends
 * connection upon response
 */
const sql = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Iam4nkush@!**!",
  database: "newdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = sql;
