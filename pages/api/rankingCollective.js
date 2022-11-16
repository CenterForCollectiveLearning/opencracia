// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const {combinations} = require("../../helpers/utils");

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
  const {user_id} = req.body;
  
  const query1 = await pool.query("SELECT * FROM agree;").then(resp => resp.rows);
  const query2 = await pool.query("SELECT * FROM rank WHERE rank LIKE '%>%';").then(resp => resp.rows);
  
  const _agree = query1.filter(d => d.agree === 1);
  const _disagree = query1.filter(d => d.agree === 0);
  const _dontknow = query1.filter(d => d.agree === -1);

  // const ids = [... new Set(query1.map(d => d.proposal_id))];


  const data1 = [];
  for (const a of _agree) {
    for (const d of _disagree) {
      data1.push({
        option_a: a.proposal_id,
        option_b: d.proposal_id,
        selected: a.proposal_id
      });
    }
  }

  const data = query2;
  let dataProcessed = data.reduce((all, d) => {
    for (const item of combinations(d.rank.split(">"), 2)) {
      all.push({
        option_a: item[0],
        option_b: item[1],
        selected: item[0]
      });
    }

    return all;
  }, []);

  dataProcessed = dataProcessed.concat(data1);

  const options = dataProcessed.reduce((all, d) => {
    if (!all[d.option_a]) all[d.option_a] = 0;
    if (!all[d.option_b]) all[d.option_b] = 0;
    return all;
  }, {});

  const agreed = Object.assign({}, options);
  const disagreed = Object.assign({}, options);
  const dontknow = Object.assign({}, options);
  const wins = Object.assign({}, options);
  const tie = Object.assign({}, options);
  const losses = Object.assign({}, options);

  for (const a of _agree) {
    agreed[a.proposal_id] += 1;
  }
  for(const d of _disagree) {
    disagreed[d.proposal_id] += 1;
  }
  for(const item of _dontknow) {
    dontknow[item.proposal_id] += 1;
  }

  for(const item of dataProcessed) {
    if (item.option_a === item.selected) {
      wins[item.option_a] += 1;
      losses[item.option_b] += 1;
    }
    else if (item.option_b === item.selected) {
      wins[item.option_b] += 1;
      losses[item.option_a] += 1;
    }
    else 
      tie[item.option_b] += 1;
  }

  const output = Object.keys(options).reduce((all, d) => {
    all.push({
      id: d,
      wins: wins[d],
      losses: losses[d],
      tie: tie[d],
      agreed: agreed[d],
      disagreed: disagreed[d],
      dontknow: dontknow[d],
      value: wins[d]/(wins[d] + losses[d] + tie[d])
    });
    return all;
  }, []);
  output.sort((a, b) => b.value - a.value);

  return res.status(200).json({count: output.length, data: output});
}
  