// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const axios = require("axios");
const hmacSHA512 = require("crypto-js/hmac-sha512");

const {DATABASE_URL, SECRET_KEY} = process.env;
const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: DATABASE_URL
});

export default async function handler(req, res) {
  const {option_a, option_b, selected, uuid, token} = req.body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY_V3;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  const recaptchaV3 = await axios.get(url).then((resp) => resp.data);
  const {success, challenge_ts, hostname, score, action} = recaptchaV3;

  const publicIpV4 = req.headers["x-forwarded-for"] ||
     req.socket.remoteAddress ||
     null;
  // const ipData = await axios.get(`http://ip-api.com/json/${publicIpV4}`).then(resp => resp.data);

  const hashIp = hmacSHA512(publicIpV4, SECRET_KEY).toString();
  
  pool.query(
    "INSERT INTO preferences (uuid, ip_hash, option_a, option_b, selected, score) VALUES ($1, $2, $3, $4, $5, $6)", 
    [uuid, hashIp, option_a, option_b, selected, score], 
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(404).json({message: "error"});
      };
      return res.status(200).json({message: "ok"});
    });
}
  