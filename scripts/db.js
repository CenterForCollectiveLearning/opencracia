const {Pool} = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("connected to the db");
});

/**
 * Create Tables
 */
const createTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      votes(
        id SERIAL PRIMARY KEY,
        uuid UUID NOT NULL,
        ip_hash VARCHAR NOT NULL,
        option_a INT NOT NULL,
        option_b INT NOT NULL,
        selected INT NOT NULL,
        datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        score DECIMAL NOT NULL
      );
    `;

  const queryParticipants = 
  `
    CREATE TABLE IF NOT EXISTS
      participants(
        id SERIAL PRIMARY KEY,
        uuid UUID NOT NULL,
        ip_hash VARCHAR NOT NULL,
        politica INT NOT NULL,
        location VARCHAR NOT NULL,
        age INT NOT NULL,
        sex VARCHAR NOT NULL,
        datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        score DECIMAL NOT NULL
      );
  `;


  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
  
  // Creates table of participants
  pool.query(queryParticipants)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

/**
 * Drop Tables
 */
const dropTables = () => {
  const queryText = "DROP TABLE IF EXISTS votes";
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

pool.on("remove", () => {
  console.log("client removed");
  process.exit(0);
});

module.exports = {
  createTables,
  dropTables,
};

require("make-runnable");