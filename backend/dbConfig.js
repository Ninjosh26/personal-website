const sql = require("mssql");
require("dotenv").config(); // Load environment variables from .env file

// Database connection configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // Use encryption for Azure SQL
    enableArithAbort: true,
  },
};

// Create a global pool to reuse across requests
let poolPromise;

const getConnection = () => {
  // If pool is not created yet, create it
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
};

module.exports = { getConnection };
