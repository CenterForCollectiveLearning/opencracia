const {DATABASE_URL} = process.env;
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: DATABASE_URL
});

export default async function handler(req, res) {

  const {user_id} = req.body;
  
  const convert = (data, bool) => data.reduce((all, d) => {
    if (d.agree === bool) all.push(d.proposal_id);
    return all;
  }, []);

  const data1 = await pool.query("SELECT proposal_id, agree FROM agree WHERE user_id = $1;", [user_id])
    .then(result => result.rows);
  
  const data2 = await pool.query("SELECT rank, universe FROM rank WHERE user_id = $1;", [user_id])
    .then(result => result.rows);
  
  const p1 = [...new Set(convert(data1, -1))];
  const p2 = [...new Set(convert(data1, 0))];
  const p3 = [...new Set(convert(data1, 1))];

  return res.status(200).json({
    "-1": p1,
    0: p2,
    1: p3,
    panelA: p1.length + p2.length + p3.length,
    panelB: data2.length,
    rank: data2
  });

}
  