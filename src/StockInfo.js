import React, { useState, useEffect, useRef } from 'react';
import './StockInfo.css'

function StockInfo() {
  const [ticker, setTicker] = useState('');
  const [stocks, setStocks] = useState([]);
  const intervals = useRef({});
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
      const interval = setInterval(() => {
        setStocks(stocks => stocks.map(stock => {
          fetch(`http://localhost:5000/get-stock-price?symbol=${stock.ticker}`)
            .then(response => response.json())
            .then(data => {
              stock.price = Number(data.price.toFixed(2));
              stock.timestamp = data.timestamp;
            // Update price history
              if (stock.priceHistory.length === 10) {
                stock.priceHistory.shift();  // Remove the oldest price
              }
              stock.priceHistory.push(data.price.toFixed(2));  // Add the new price
            });
          return stock;
        }));
      }, 60000);
      return () => clearInterval(interval);
    }, []);

  const handleAdd = (suggestionToAdd = { ticker: ticker, name: '' }) => {
    fetch(`http://localhost:5000/get-stock-price?symbol=${suggestionToAdd.ticker}`)
      .then(response => response.json())
      .then(data => {
        setStocks(stocks.concat({
          ticker: suggestionToAdd.ticker,
          name: suggestionToAdd.name,
          price: Number(data.price.toFixed(2)),  // round to 2 decimal places
          timestamp: data.timestamp,
          priceHistory: [Number(data.price.toFixed(2))]  // round and add the new price
        }));
        setTicker('');
        setSuggestions([]);
      });
  };

  const handleRemove = (removeTicker) => {
    setStocks(stocks.filter(stock => stock.ticker !== removeTicker));
    clearInterval(intervals.current[removeTicker]);
    delete intervals.current[removeTicker];
  };

  useEffect(() => {
      return() => {
          for (let ticker in intervals.current) {
              clearInterval(intervals.current[ticker]);
          }
      }
  });

  const handleSearch = (event) => {
    const value = event.target.value;
    setTicker(value);

    if(value.length > 2) {
        fetch(`http://localhost:5000/get-ticker-suggestions?query=${value}`)
        .then(response => response.json())
        .then(data => {
            setSuggestions(data);
        });
    } else {
        setSuggestions([]);
    }
  }

  const selectSuggestion = (suggestion) => {
    setTicker(suggestion.ticker);
    setSuggestions([]);
    handleAdd(suggestion);
  }

  return (
    <div className="container">
      <div className="input-section">
        <input type="text" value={ticker} onChange={handleSearch} />
        <button onClick={() => handleAdd({ ticker: ticker, name: '' })}>Add</button>
        {suggestions.map(suggestion => (
          <div key={suggestion.ticker} onClick={() => selectSuggestion(suggestion)}>
            {suggestion.name} ({suggestion.ticker})
          </div>
        ))}
      </div>
      <div className="stock-list">
        {stocks.map(stock => (
          <div className="stock-item" key={stock.ticker}>
            <button onClick={() => handleRemove(stock.ticker)}>{stock.name} ({stock.ticker})</button>
            <div>Price: {stock.price}</div>
            <div>Price History: {stock.priceHistory.join(', ')}</div>
            <div>Date: {stock.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
  
  export default StockInfo;