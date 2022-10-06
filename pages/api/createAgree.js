// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");
const format = require("pg-format");

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
  const {data, token} = req.body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY_V3;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  const recaptchaV3 = await axios.get(url).then((resp) => resp.data);
  const {success, challenge_ts, hostname, score, action} = recaptchaV3;

  const publicIpV4 = req.headers["x-forwarded-for"] ||
     req.socket.remoteAddress ||
     null;
  // const ipData = await axios.get(`http://ip-api.com/json/${publicIpV4}`).then(resp => resp.data);

  const hashIp = hmacSHA512(publicIpV4, SECRET_KEY).toString();

  data.forEach(d => {
    d[6] = hashIp;
    d[7] = score;
  });

  const sql = format("INSERT INTO agree (user_id, proposal_id, agree, universe, locale, option, ip_hash, score) VALUES %L", data);
  pool.query(sql, [], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(404).json({message: "error"});
    };
    return res.status(200).json({message: "ok"});
  });
}
  