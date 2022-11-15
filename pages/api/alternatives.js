// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const configFile = require("../../opencracia.config.json");
const CSV_URL = configFile["alternatives"];

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function csvJSON(csv, delimiter = "\t") {
  const lines = csv.replace(/\r/g, "").split("\n");
  const result = [];
  const headers = lines[0].split(delimiter);

  for (let i = 1; i < lines.length; i++) {        
    if (!lines[i])
      continue;
    const obj = {};
    const currentline = lines[i].split(delimiter);
    
    for (let j = 0; j < headers.length; j++)  
      obj[headers[j]] = isNumeric(currentline[j]) ? currentline[j] * 1 : currentline[j];

    if (obj["id"] !== "")
      result.push(obj);
    
  }
  return result;
}

export default async function handler(req, res) {
  const data = await fetch(CSV_URL)
    .then(resp => resp.text());

  const jsonData = csvJSON(data);

  const headers = Object.keys(jsonData[0]);
  const __multichoice = headers.filter(d => d.includes("_multichoice"));

  jsonData.forEach(d => {
    for (const s of __multichoice) 
      d[s] = d[s] === "" ? null : d[s].split(", ");
    
  });
  
  res.status(200).json(jsonData);
}
  