const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  // ⚡ CRITICAL TIMING SETTINGS
  connectionTimeoutMillis: 30000, // Wait up to 30s to connect
  idleTimeoutMillis: 30000,       // Keep idle connections open for 30s
  max: 10                         // Maintain up to 10 connections in the pool
});

pool.connect()
  .then(() => console.log("Connected to PostgreSQL ✅"))
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
    // If it fails on start, wait 5 seconds and try one more time
    setTimeout(() => pool.connect(), 5000); 
  });

module.exports = pool;