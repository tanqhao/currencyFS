
import styles from './Currency.module.css';
import getSymbolFromCurrency from 'currency-symbol-map';

const Currency = (props) =>  {

  let symbol = getSymbolFromCurrency(props.code);

    return (
      <div className={styles.currency}>
      <h1 className={styles.code}>{props.code}</h1>
      <h3 className={styles.name}>{props.name}</h3>
      <h1 className={styles.rate}>{props.rate}{symbol}</h1>
      </div>
    );
  }

export default Currency;
