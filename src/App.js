import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from './Header';
import StockInfo from './StockInfo';
import HomePage from './HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/stocks" element={<StockInfo />} />
          <Route path="/" element={<HomePage />} />  // This will be your home page component
        </Routes>
      </div>
    </Router>
  );
}

export default App;
