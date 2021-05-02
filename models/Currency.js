
const axios = require("axios");
const moment = require("moment");

const NodeCache = require('node-cache');

const myCache = new NodeCache();

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
      return (error.response.data.meta);
    }
    return res.data.response;
}


exports.queryList = async (req) => {

  let res;

  if (myCache.has("list")) {
    res = myCache.get("list");
    console.log("list data in cache");
    return res;
  }
  else
  {
    let type = "fiat";
    try
    {
      res = await makeRequest("currencies", `type=${type}`);
      myCache.set('list', res);

      return res;
    }
    catch(error)
    {
      return (error);
    }
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
    return (error);
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

    let cacheKey = `${date}:${base}`;

    if (myCache.has(cacheKey)) {
      res = myCache.get(cacheKey);
      console.log("history data in cache" + cacheKey);
      return res;
    }
    else
    {
      try
      {
        if(symbols === undefined)
        {
            let res = await makeRequest("historical", `base=${base}&date=${date}`);
            myCache.set(cacheKey, res);
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
        return (error);
      }
    }
  }
