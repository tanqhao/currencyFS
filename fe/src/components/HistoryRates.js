
import getSymbolFromCurrency from 'currency-symbol-map';

const HistoryRates = (props) =>  {

  let symbol = getSymbolFromCurrency(props.code);

  let date = new Date(props.date);

    return (
      <tbody>
      <tr>
      <td>{date.toDateString()}</td>
      <td>{props.rate}{symbol}</td>
      </tr>
      </tbody>
    );
  }

export default HistoryRates;
