// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const configFile = require("../../opencracia.config.json");
const CSV_URL = configFile["translations"];
const languages = configFile["languages"];
const pathToTranslations = configFile["pathToTranslations"];
const FileSystem = require("fs");

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}


function csvJSON(csv, lang, delimiter = "\t") {

  const lines = csv.replace(/\r/g, "").split("\n");
  const result = {};
  const headers = lines[0].split(delimiter);
  // const langIndex = lang.toString().indexOf(headers);

  const langIndex = headers.findIndex((h,i) => headers[i] === lang);

  for (let i = 1; i < lines.length; i++) {        
    if (!lines[i])
      continue;

    const currentline = lines[i].split(delimiter);
    const key1 = currentline[0].split(".")[0];
    const key2 = currentline[0].split(".")[1];
    const element = currentline[langIndex];

    if (!(key1 in result)){
      result[key1] = {}
    }

    result[key1][key2] = element;
    
  }
  return result;
}

export default async function handler(req, res) {

  const allTranslations = {};
  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];

    if (!(lang in allTranslations)){
      const data = await fetch(CSV_URL).then(resp => resp.text());
      const jsonData = csvJSON(data, lang);

      FileSystem.writeFile(pathToTranslations+lang+'/translation.json', JSON.stringify(jsonData), (error) => {
          if (error) throw error;
        });
      allTranslations[lang] = pathToTranslations+lang+'/translation.json';
    }

  }
  
  res.status(200).json(allTranslations);
  
}
  