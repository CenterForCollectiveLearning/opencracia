// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const {combinations} = require("../../helpers/utils");


export default async function handler(req, res) {
  
 const {proposals_values, module, aggregation_method} = req.body;

  let function_values;
  if (module === "approval") {
    function_values = wins[d]/(wins[d] + losses[d] + tie[d]);
  }else if (module === "") {
    function_values = wins[d]/(wins[d] + losses[d] + tie[d]);
  }else if (module === "") {
    function_values = wins[d]/(wins[d] + losses[d] + tie[d]);
  }else{
    // default win rate
    function_values = wins[d]/(wins[d] + losses[d] + tie[d]);
  }

  const output = Object.keys(options).reduce((proposals_values, d) => {
    all.push({
      value: wins[d]/(wins[d] + losses[d] + tie[d])
    });
    return all;
  }, []);

  output.sort((a, b) => b.value - a.value);

  return res.status(200).json({count: output.length, data: output});
}
  