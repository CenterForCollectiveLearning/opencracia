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
  const {user_id, universe, locale, url} = req.body;
  
  const publicIpV4 = req.headers["x-forwarded-for"] ||
     req.socket.remoteAddress ||
     null;
  // const ipData = await axios.get(`http://ip-api.com/json/${publicIpV4}`).then(resp => resp.data);

  const hashIp = hmacSHA512(publicIpV4, SECRET_KEY).toString();
  
  pool.query(
    "INSERT INTO consent (user_id, ip_hash, universe, locale, url) VALUES ($1, $2, $3, $4, $5)", 
    [user_id, hashIp, universe, locale, url], 
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(404).json({message: "error"});
      };
      return res.status(200).json({message: "ok"});
    });
}
  