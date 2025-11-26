import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  // Popular currencies list
  const popularCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' }
  ];

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      convertCurrency();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fromCurrency, toCurrency]);

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      
      const rate = response.data.rates[toCurrency];
      setExchangeRate(rate);
      const convertedAmount = (amount * rate).toFixed(2);
      setResult(convertedAmount);
    } catch (err) {
      setError('Failed to fetch exchange rates. Please try again.');
      console.error('Conversion error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="converter-container">
      <h2>💱 Currency Converter</h2>
      <p className="subtitle">Live exchange rates</p>

      <div className="converter-card">
        <div className="input-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
          />
        </div>

        <div className="currency-group">
          <div className="currency-select">
            <label>From</label>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {popularCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <button className="swap-button" onClick={handleSwap} title="Swap currencies">
            ⇄
          </button>

          <div className="currency-select">
            <label>To</label>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              {popularCurrencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="loading">Converting...</div>}
        
        {error && <div className="error">{error}</div>}

        {result && !loading && (
          <div className="result-box">
            <div className="result-amount">
              <span className="from-amount">{amount} {fromCurrency}</span>
              <span className="equals">=</span>
              <span className="to-amount">{result} {toCurrency}</span>
            </div>
            {exchangeRate && (
              <div className="exchange-rate">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
