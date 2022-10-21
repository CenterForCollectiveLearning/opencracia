// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");
const hmacSHA512 = require("crypto-js/hmac-sha512");
const {DATABASE_URL} = process.env;
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: DATABASE_URL
});

const {SECRET_KEY} = process.env;

export default async function handler(req, res) {
// const data = await pool.query("SELECT TOP (1) proposal_id, candidate_ids FROM game ORDER BY created_at DESC").then(resp => resp.rows);

  // const {gameKey} = req.body;
  var gameKey = "2022_4_6_2";
  const data = await pool.query("SELECT * FROM game WHERE start_date = $1;", [gameKey]).then(resp => resp.rows);
  res.status(200).json(data);
}
  