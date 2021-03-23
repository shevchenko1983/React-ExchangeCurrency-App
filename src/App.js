import './App.css';
import Select from "./components/Select";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {API_URL} from "./api/config";
import CurrencyRateDescription from "./components/CurrencyRateDescription";
import 'currency-flags/dist/currency-flags.css';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [currentRateFrom, setCurrentRateFrom] = useState(null);
  const [currentRateTo, setCurrentRateTo] = useState(null);
  const [result, setResult] = useState(0);
  const inputRef = useRef(0);
  const defaultCurrencyFrom = useRef();
  const defaultCurrencyTo = useRef();

  useEffect(() => {
    if(currencies.length === 0){
        axios(API_URL).then((response) => {
            setCurrencies([...Object.entries(response.data.rates)]);
            setBaseCurrency(response.data.base);
        });
    }
  }, [currencies.length, baseCurrency]);

  //if updated any rates -> call calculateRate func
  useEffect(() => {
      calculateRate(inputRef.current);
  }, [currentRateFrom, currentRateTo]);

  //if currentRateFrom and currentRateTo are set by default
  useEffect(() => {
      if(!currentRateFrom && currencies.length > 0){
          setCurrentRateFrom(currencies[0][1]);
      }
      if(!currentRateTo && currencies.length > 0){
          setCurrentRateTo(currencies[0][1]);
      }
  }, [currentRateFrom, currentRateTo, currencies.length]);

  const getCurrentRateFrom = (currCurrency) => {
      //if found current currency  in array -> return rate of that currency
      currencies.forEach((item) => {
          const rate = item[0] === currCurrency.value && item[1];
          if(rate){
            setCurrentRateFrom(rate);
          }
      });
  };

    const getCurrentRateTo = (currCurrency) => {
        //if found current currency  in array -> return rate of that currency
        currencies.forEach((item) => {
            const rate = item[0] === currCurrency.value && item[1];
            if(rate){
                setCurrentRateTo(rate);
            }
        });
    };

  const calculateRate = (e) => {
     const amount = e.value;
     if(amount && amount > 0){
       setResult(((amount / currentRateFrom) * currentRateTo).toFixed(2));
     }else{
       setResult(0);
     }
  };

  //console.log(currencies, baseCurrency, inputRef)


  return (
    <div className="App">
        <h2>Currency Converter</h2>
        <div className="currency-container">
           <h3><CurrencyRateDescription
              currency={defaultCurrencyFrom.current && defaultCurrencyFrom.current.value}
              value={inputRef.current && inputRef.current.value !== '' ? inputRef.current.value : 0}
          />is equivalent to</h3>
          <CurrencyRateDescription
              currency={defaultCurrencyTo.current && defaultCurrencyTo.current.value}
              value={result}
          />
          <div className="first-currency">
              <input type="number"
                     disabled={false}
                     ref={inputRef}
                     onChange={(e) => calculateRate(e.target)}
              />
              <Select options={currencies}
                      action={getCurrentRateFrom}
                      referrense={defaultCurrencyFrom}
              />
              <div className={`currency-flag currency-flag-${defaultCurrencyFrom.current && defaultCurrencyFrom.current.value.toLowerCase()}`}/>
          </div>

          <div className="second-currency">
              <input type="number"
                     disabled={true}
                     value={result}
              />
              <Select options={currencies}
                      action={getCurrentRateTo}
                      referrense={defaultCurrencyTo}
              />
              <div className={`currency-flag currency-flag-${defaultCurrencyTo.current && defaultCurrencyTo.current.value.toLowerCase()}`}/>
          </div>
        </div>
    </div>
  );
}

export default App;
