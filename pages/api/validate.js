const {DATABASE_URL} = process.env;
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: DATABASE_URL
});

export default async function handler(req, res) {

  return res.status(200).json({});

  const {user_id} = req.body;

  pool.query(
    "SELECT universe FROM consent WHERE user_id = $1;", 
    [user_id], 
    (error, result) => {
      if (error) throw error;
      const data = result.rows;

      return res.status(200).json(data);
    });
}
  