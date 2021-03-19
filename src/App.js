import './App.css';
import Select from "./components/Select";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {API_URL} from "./api/config";

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
      currencies.forEach((item) => {
          const rate = item[0] === currCurrency.value && item[1];
          if(rate){
            setCurrentRateFrom(rate);
          }
      });
  };

    const getCurrentRateTo = (currCurrency) => {
        currencies.forEach((item) => {
            const rate = item[0] === currCurrency.value && item[1];
            if(rate){
                setCurrentRateTo(rate);
            }
        });
    };

  const calculateRate = (e) => {
     const amount = e.value;
     if(amount){
       setResult(((amount / currentRateFrom) * currentRateTo).toFixed(2));
     }
  };

  //console.log(currencies, baseCurrency, inputRef)


  return (
    <div className="App">
        <h2>Currency Converter</h2>
        <div className="currency-container">
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
          </div>
        </div>
    </div>
  );
}

export default App;
