// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");
const {DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT} = process.env;

const Pool = require("pg").Pool;
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT
});

export default async function handler(req, res) {

  pool.query(
    "SELECT COUNT(*) FROM preferences;", 
    [], 
    (error, result) => {
      if (error) throw error;
      const data = result.rows;

      return res.status(200).json(data[0]);
    });
}
  