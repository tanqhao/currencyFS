
const axios = require("axios");
const moment = require("moment");

const makeRequest = async (endpoint, parameters) => {
    const config = {
        method: 'get',
        url: `https://api.currencyscoop.com/v1/${endpoint}?api_key=${process.env.API_KEY}&${parameters}`
    }

    let res;
    try
    {
      res = await axios(config)
    }
    catch(error)
    {
      return (`${error.response.status}  ${error.response.headers}`);
    }

    return res.data.response;
}


exports.queryList = async (req) => {

  let type = "fiat";

  try
  {
    let res = await makeRequest("currencies", `type=${type}`);
    return res;
  }
  catch(error)
  {
    return (`${error.response.status}  ${error.response.headers}`);
  }
}


exports.queryCurrentRates = async (req) => {

  let base = req.query.base;
  let symbols = req.query.symbols;

  if (base === undefined)
  {
    base = "SGD";
  }

  try
  {
    if(symbols === undefined)
    {
        let res = await makeRequest("latest", `base=${base}`);
        return res;
    }
    else
    {
        let res = await makeRequest("latest", `base=${base}&symbols=${symbols}`);
        return res;
    }
  }
  catch(error)
  {
    return (`${error.response.status}  ${error.response.headers}`);
  }
}

exports.queryHistoricalRates = async (req) => {

    let base = req.query.base;
    let date = req.query.date;
    let symbols = req.query.symbols;

    if(!moment(date, "YYYY-MM-DD", true).isValid())
    {
      return "Invalid date";
    }

    if (base === undefined)
    {
      base = "SGD";
    }

    try
    {
      if(symbols === undefined)
      {
          let res = await makeRequest("historical", `base=${base}&date=${date}`);
          return res;
      }
      else
      {
          let res = await makeRequest("historical", `base=${base}&date=${date}&symbols=${symbols}`);
          return res;
      }
    }
    catch(error)
    {
      return (`${error.response.status}  ${error.response.headers}`);
    }
  }
