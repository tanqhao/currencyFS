import styles from './HistoryTable.module.css';
import uniqid from 'uniqid';
import {Line} from 'react-chartjs-2';
import {useState} from 'react';

import HistoryRates from './HistoryRates';
import getSymbolFromCurrency from 'currency-symbol-map';

const HistoryTable = (props) =>  {

  const[showChart, setShowChart] = useState(true);

  const handleClick = (chart) =>{
    setShowChart(chart);
}

  const backClick = () =>
  {
    props.backHandle();
  }

  let symbol = getSymbolFromCurrency(props.rateHistory[0].base);

  let content, chartData;
  let rates = [];
  let dates = [];
  if(props.rateHistory)
  {
    // sort the history dates
    props.rateHistory.sort((a,b) => {
        a = a.date.split('-').reverse().join('');
        b = b.date.split('-').reverse().join('');
        return a > b ? 1 : a < b ? -1 : 0;
    });

    content = Object.entries( props.rateHistory).map((item, index) => {
      let rate = item[1].rates;
      rates.push(rate[props.selected]);
      dates.push(item[1]["date"]);
      return <HistoryRates key={uniqid()} date={item[1]["date"]} rate={rate[props.selected]} code={props.selected}/>
    });

    chartData = {
    labels: dates,
    datasets: [
      {
        label: `${symbol}1 ${props.rateHistory[0].base}`,
        data: rates,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
        },
      ]
    };
  }
    return (
      <div className={styles.historyTable}>
      <div className={styles.header}>
        {props.selected}
      </div>
      <p>{props.name}</p>
      <table className={styles.day}>
      <tbody>
      <tr>
      <th onClick={ () => handleClick(true)}>Line</th>
      <th onClick={ () => handleClick(false)}>Table</th>
      </tr>
      </tbody>
      </table>
      {showChart ? (<Line data={chartData}/>) : (
        <table>
      <tbody>
      <tr>
       <th>Dates</th>
       <th>Exchange Rate</th>
       </tr>
       </tbody>
       {content}
       </table>)
      }
       <button type="button" onClick={backClick}>
        Back
        </button>
       </div>
    );
  }

export default HistoryTable;
