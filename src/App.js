import React, { useState } from 'react';
import './App.css';
import CurrencyConverter from './components/CurrencyConverter';
import InflationCalculator from './components/InflationCalculator';

function App() {
  const [activeTab, setActiveTab] = useState('converter');

  return (
    <div className="App">
      <header className="app-header">
        <h1>💰 Currency & Value Calculator</h1>
        <p>Convert currencies and calculate historical value</p>
      </header>

      <div className="tab-container">
        <button 
          className={`tab ${activeTab === 'converter' ? 'active' : ''}`}
          onClick={() => setActiveTab('converter')}
        >
          Currency Converter
        </button>
        <button 
          className={`tab ${activeTab === 'inflation' ? 'active' : ''}`}
          onClick={() => setActiveTab('inflation')}
        >
          Historical Value
        </button>
      </div>

      <div className="content">
        {activeTab === 'converter' ? <CurrencyConverter /> : <InflationCalculator />}
      </div>

      <footer className="app-footer">
        <p>Data provided by exchangerate-api.com and officialdata.org</p>
      </footer>
    </div>
  );
}

export default App;
