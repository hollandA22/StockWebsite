import React, { useState, useEffect, useRef } from 'react';
import './StockInfo.css'

function StockInfo() {
    const [ticker, setTicker] = useState('');
    const [stocks, setStocks] = useState([]);
    const intervals = useRef({});
  
    // Update stock prices every minute
    useEffect(() => {
        const interval = setInterval(() => {
          setStocks(stocks => stocks.map(stock => {
            fetch(`http://localhost:5000/get-stock-price?symbol=${stock.ticker}`)
              .then(response => response.json())
              .then(data => {
                stock.price = data.price;
                stock.timestamp = data.timestamp; // Update timestamp here
              });
            return stock;
          }));
        }, 60000);
        return () => clearInterval(interval); // Clear interval on component unmount
      }, []);
  
    const handleAdd = () => {
      fetch(`http://localhost:5000/get-stock-price?symbol=${ticker}`)
        .then(response => response.json())
        .then(data => {
            setStocks(stocks.concat({ticker: ticker, price: data.price, timestamp: data.timestamp}));
            setTicker('');
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
    })
  
    return (
      <div className="container">
        <div className="input-section">
          <input type="text" value={ticker} onChange={(e) => setTicker(e.target.value)} />
          <button onClick={handleAdd}>Add</button>
        </div>
        <div className="stock-list">
          {stocks.map(stock => (
            <div className="stock-item" key={stock.ticker}>
              <button onClick={() => handleRemove(stock.ticker)}>{stock.ticker}</button>
              <div>Price: {stock.price}</div>
              <div>Date: {stock.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export default StockInfo;