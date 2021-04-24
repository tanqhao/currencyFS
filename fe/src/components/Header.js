
import {useState} from 'react';
import styles from './Header.module.css';
import uniqid from 'uniqid';


const Header = props => {
const [clickState, setClickState] = useState(false);

  const handleClick = () =>{
    setClickState(prevState => !prevState);
  }

  const handleBaseClick = (event) => {
    props.baseChanged(event.target.innerHTML);
  }

let content;
if(props.info)
{
   content = Object.keys(props.info).map((item) => {
        return <li key={uniqid()}>{item}</li>
     });
 }

return (
  <div className={styles.Header}>
<header>
  <h1>Currencies
  <div>
  <button type="button" onClick={handleClick}>
  Base: {props.base}   ▼
  {clickState && (
  <ul onClick={handleBaseClick}>
  {content}
  </ul>
  )}
  </button>
  </div>
  </h1>
</header>
</div>
);
}

export default Header;
