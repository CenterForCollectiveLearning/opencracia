// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");
const hmacSHA512 = require("crypto-js/hmac-sha512");
const {DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT} = process.env;

const Pool = require("pg").Pool;
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT
});

const {SECRET_KEY} = process.env;

export default async function handler(req, res) {
  const {userId} = req.body;
  const data = await pool.query("SELECT * FROM individual_participation WHERE userId = $1;", [userId]).then(resp => resp.rows);
  res.status(200).json(data);
}
  