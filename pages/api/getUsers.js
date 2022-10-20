// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const {DATABASE_URL} = process.env;
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: DATABASE_URL
});

const {SECRET_KEY} = process.env;

export default async function handler(req, res) {
  
  const data = await pool.query("SELECT COUNT(DISTINCT user_id) FROM agree").then(resp => resp.rows);
  res.status(200).json(data);
}
  