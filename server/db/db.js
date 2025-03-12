const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5433,
  password: "7455",
  database: "vaibhav_db",
});

module.exports = pool;
