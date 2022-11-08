// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const configFile = require("../opencracia.config.json");
const CSV_URL = configFile["translations"];
const languages = configFile["languages"];
const FileSystem = require("fs");

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

    if (!(key1 in result))
      result[key1] = {};
    

    result[key1][key2] = element;
    
  }
  return result;
}

async function generate_translations() {
  const data = await fetch(CSV_URL).then(resp => resp.text());

  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];

    if (!(lang in allTranslations)){
      const jsonData = csvJSON(data, lang);
      const filename = `../locales/${lang}/translation.json`;

      FileSystem.writeFile(filename, JSON.stringify(jsonData), (error) => {
        if (error) throw error;
      });
    }

  }
}
  