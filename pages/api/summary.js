// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const {DATABASE_URL} = process.env;
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: DATABASE_URL
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
  