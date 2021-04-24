import styles from './HistoryTable.module.css';
import uniqid from 'uniqid';

import {useState} from 'react';

import HistoryRates from './HistoryRates';

const HistoryTable = (props) =>  {

  const[history, setHistory] = useState([]);
  const[itemLoaded, setItemLoaded] = useState(false);

  const handleClick = (days) =>{
    setItemLoaded(true);
    setHistory(content.slice(0, days));
  }

  const backClick = () =>
  {
    props.backHandle();
  }

  let content;

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
      return <HistoryRates key={uniqid()} date={item[1]["date"]} rate={rate[props.selected]} code={props.selected}/>
    });
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
      <th onClick={ () => handleClick(1)}>Today</th>
      <th onClick={ () => handleClick(4)}>Last 3 days</th>
      <th onClick={ () => handleClick(8)}>Last 7 days</th>
      </tr>
      </tbody>
      </table>
      <table>
      <tbody>
      <tr>
       <th>Dates</th>
       <th>Exchange Rate</th>
       </tr>
       </tbody>
       {itemLoaded ? history :content}
       </table>
       <button type="button" onClick={backClick}>
        Back
        </button>
       </div>
    );
  }

export default HistoryTable;
