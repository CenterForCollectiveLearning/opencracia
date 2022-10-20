// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");
const hmacSHA512 = require("crypto-js/hmac-sha512");
const {DATABASE_URL} = process.env;
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: DATABASE_URL
});

export default async function handler(req, res) {
  const {userId} = req.body;
  const data = await pool.query("SELECT * FROM individual_participation WHERE userId = $1;", [userId]).then(resp => resp.rows);
  res.status(200).json(data);
}
  