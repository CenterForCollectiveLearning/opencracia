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
  const {locale, politics_id, location_id, education_id, age_id, sex_id, zone_id, universe, user_id, token} = req.body;

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
    "INSERT INTO participant (user_id, ip_hash, sex_id, politics_id, location_id, age_id, zone_id, education_id, universe, score, locale) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", 
    [user_id, hashIp, sex_id, politics_id, location_id, age_id, zone_id, education_id, universe, score, locale], 
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(404).json({message: "error"});
      };
      return res.status(200).json({message: "ok"});
    });
}
  