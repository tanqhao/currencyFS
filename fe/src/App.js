
import {useState, useEffect} from 'react';
import axios from 'axios';
import dotenv from 'dotenv';
import uniqid from 'uniqid';

import styles from './App.module.css';
import Currency from "./components/Currency";
import Header from "./components/Header";
import HistoryTable from './components/HistoryTable';

import Loader from 'react-loader-spinner';

dotenv.config();

function App() {

const[currenciesInfo, setCurrenciesInfo] = useState({});  // cuurencies info (code , name)
const[ratesInfo, setRatesInfo] = useState({});  // current rates for base currency
const[ratesHistory, setRatesHistory] = useState({});  // rates for base currency for past 7 days
const[currencyClicked, setcurrencyClicked] = useState(false); // if currency is click to enter history page
const[selectedCurrency, setSelectedCurrency] = useState("");  // which currency code is selected to enter history page
const[selectedName, setSelectedName] = useState(""); // which currency name is selected to enter history page
const[baseCurrency, setBaseCurrency] = useState("SGD"); // current base currency
const[loading, setLoading] = useState(false);
const[errorMsg, setErrorMsg] = useState(undefined);

// on first load
useEffect(() => {
  // get localstorage base currency
  let base;
  if (localStorage.getItem('base') !== null) {
    base = localStorage.getItem('base');
  } else {
    base = "SGD";
  }

  setBaseCurrency(base);
  setLoading(true);

  // fetch currency data from server
  getDataFromServer(base);
}, []);


const isErrorInResponse = res => {
  if (res.data.hasOwnProperty("code")) {
    setErrorMsg(`${res.data.code}  ${res.data.error_type}`)
    return true;
  }
  return false;
}

const getDataFromServer = base => {

  axios.get(`http://localhost:${process.env.REACT_APP_PORT}/query/currentRates/?base=${base}`)
    .then(res => {
      if (!isErrorInResponse(res)) {
        const info = res.data.rates;
        setRatesInfo(info);
        setLoading(false);
      }
    })
    .catch((error) => {
      if (!error.response) {
        setErrorMsg("Network error");
      } else {
        setErrorMsg(`${error.response.status}  ${error.response.statusText}`)
      }
    });

  //fetch currencies infos (name and code)
  axios.get(`http://localhost:${process.env.REACT_APP_PORT}/query/list`)
    .then(res => {
      if (!isErrorInResponse(res)) {
        const info = res.data.fiats;
        setCurrenciesInfo(info);
      }
    })
    .catch((error) => {
      if (!error.response) {
        setErrorMsg("Network error");
      } else {
        setErrorMsg(`${error.response.status}  ${error.response.statusText}`)
      }
    });
}


let today = new Date();

// fetch history rates from base currency for the past 7 days
const getHistoryRates = base => {
  let history = [];
  let promises = [];
  for(let days = 0; days <= 7; days++)
  {
    let date = new Date();;
    date.setDate(today.getDate() - days);
    date = date.toISOString().slice(0, 10);

    promises.push(
      axios.get(`http://localhost:${process.env.REACT_APP_PORT}/query/historicalRates/?base=${base}&date=${date}`)
      .then(res => {
        if (!isErrorInResponse(res)) {
          history.push(res.data);
        }
      })
    )
  }
  // process after all history rates request is fulfiled
  Promise.all(promises).then(res => {
      setRatesHistory(history);
      setLoading(false);
      setcurrencyClicked(true);
    })
    .catch((error) => {
      if (!error.response) {
        setErrorMsg("Network error");
      } else {
        setErrorMsg(`${error.response.status}  ${error.response.statusText}`)
      }
    });
}

const handleClick = (code, name) => {
  setLoading(true);
  setErrorMsg(undefined);
  setSelectedCurrency(code);
  setSelectedName(name);
  getHistoryRates(baseCurrency);
}

// base currency changed
const baseChangedHandler = base => {

  if (base !== baseCurrency) {

    setLoading(true);
    axios.get(`http://localhost:${process.env.REACT_APP_PORT}/query/currentRates/?base=${base}`)
      .then(res => {
        if (!isErrorInResponse(res)) {
          const info = res.data.rates;
          setRatesInfo(info);
        }
        // update history info if inside history page
        if (currencyClicked) {
          getHistoryRates(base);
        }
        setLoading(false);
      })
      .catch((error) => {
        if (!error.response) {
          setErrorMsg("Network error");
        } else {
          setErrorMsg(`${error.response.status}  ${error.response.statusText}`)
        }
      });
    setBaseCurrency(base);
    localStorage.setItem('base', base);
  }
}

// handle retry button
const retryHandler = () => {
  getDataFromServer(baseCurrency);
  setErrorMsg(undefined);
}

// return back to currency list
const backHandler = () => {
  setcurrencyClicked(false);
}
let content;
if(errorMsg)
{
  content = <div className={styles.error}>
  <p>{errorMsg}</p>
  <button type="button" onClick={retryHandler}>
   Retry
   </button>
  </div>
}
else if(loading)
{
  content =
  <div className={styles.loader}>
  <Loader
        type="Oval"
        color="#722F37"
        height={80}
        width={80}/>;
  </div>
}
else if(currencyClicked)
{
    content = <HistoryTable rateHistory={ratesHistory} selected={selectedCurrency} name={selectedName} backHandle={backHandler}/>
}
else
{
      // content for current currencies rate
      if(currenciesInfo)
      {
        content = Object.keys(currenciesInfo).map((info, index) => {
         return <div key={uniqid()} onClick={ () => handleClick(info, currenciesInfo[info].currency_name)}>
         <Currency code={info} name={currenciesInfo[info].currency_name} rate={ratesInfo[info]}/>
         </div>
        });
     }
 }
  return (
    <div className={styles.App}>
       <Header info={currenciesInfo} base={baseCurrency} baseChanged={baseChangedHandler}/>
       {content}
    </div>
  );
}

export default App;
