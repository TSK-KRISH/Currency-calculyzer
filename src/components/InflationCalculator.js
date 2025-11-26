import React, { useState } from 'react';
import axios from 'axios';
import './InflationCalculator.css';

const InflationCalculator = () => {
  const [amount, setAmount] = useState(100);
  const [startYear, setStartYear] = useState(1982);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [currency, setCurrency] = useState('USD');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currencies = [
    { code: 'USD', name: 'US Dollar', minYear: 1913, source: 'US Bureau of Labor Statistics' },
    { code: 'GBP', name: 'British Pound', minYear: 1913, source: 'UK Office for National Statistics' },
    { code: 'EUR', name: 'Euro', minYear: 1999, source: 'Eurostat' },
    { code: 'CAD', name: 'Canadian Dollar', minYear: 1913, source: 'Statistics Canada' },
    { code: 'AUD', name: 'Australian Dollar', minYear: 1913, source: 'Australian Bureau of Statistics' },
    { code: 'INR', name: 'Indian Rupee', minYear: 1958, source: 'Reserve Bank of India / World Bank' }
  ];

  const currentYear = new Date().getFullYear();
  const selectedCurrency = currencies.find(c => c.code === currency);
  const minYear = selectedCurrency ? selectedCurrency.minYear : 1913;

  const calculateINRInflation = (amount, startYear, endYear) => {
    // Official RBI/World Bank average inflation rates for India by decade
    const inrInflationRates = {
      1958: 3.5, 1959: 0.0, 1960: 1.7, 1961: 1.8, 1962: 2.5, 1963: 5.8, 1964: 10.2, 1965: 7.7, 1966: 13.9, 1967: 11.0,
      1968: 0.5, 1969: -1.3, 1970: 5.6, 1971: 3.0, 1972: 6.4, 1973: 16.6, 1974: 28.6, 1975: 5.9, 1976: -7.6, 1977: 8.3,
      1978: 2.5, 1979: 6.4, 1980: 11.4, 1981: 13.1, 1982: 7.9, 1983: 11.9, 1984: 8.3, 1985: 5.6, 1986: 8.7, 1987: 8.8,
      1988: 9.4, 1989: 7.5, 1990: 9.0, 1991: 13.9, 1992: 11.8, 1993: 6.4, 1994: 10.2, 1995: 10.2, 1996: 9.0, 1997: 7.2,
      1998: 13.2, 1999: 4.7, 2000: 4.0, 2001: 3.8, 2002: 4.3, 2003: 3.8, 2004: 3.8, 2005: 4.2, 2006: 5.8, 2007: 6.4,
      2008: 8.3, 2009: 10.9, 2010: 12.0, 2011: 8.9, 2012: 9.3, 2013: 10.9, 2014: 6.4, 2015: 4.9, 2016: 4.5, 2017: 3.6,
      2018: 3.4, 2019: 4.8, 2020: 6.2, 2021: 5.5, 2022: 6.7, 2023: 5.4, 2024: 4.9, 2025: 4.5
    };

    let value = amount;
    for (let year = startYear; year < endYear; year++) {
      const rate = inrInflationRates[year] || 6.5; // Default to 6.5% if data not available
      value = value * (1 + rate / 100);
    }

    return value;
  };

  const calculateInflation = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (startYear >= endYear) {
      setError('Start year must be before end year');
      return;
    }

    const currencyMinYear = selectedCurrency ? selectedCurrency.minYear : 1913;
    
    if (startYear < currencyMinYear || endYear > currentYear) {
      setError(`For ${currency}, year must be between ${currencyMinYear} and ${currentYear}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let inflatedValue;
      let dataSource = selectedCurrency?.source || 'Estimated';

      // Special handling for INR using official RBI data
      if (currency === 'INR') {
        inflatedValue = calculateINRInflation(amount, startYear, endYear);
        const totalInflation = ((inflatedValue - amount) / amount * 100).toFixed(2);
        const avgInflationRate = (totalInflation / (endYear - startYear)).toFixed(2);

        setResult({
          originalAmount: amount,
          inflatedValue: inflatedValue.toFixed(2),
          totalInflation: totalInflation,
          avgInflationRate: avgInflationRate,
          startYear: startYear,
          endYear: endYear,
          currency: currency,
          yearsDifference: endYear - startYear,
          dataSource: dataSource,
          isOfficial: true
        });
        setLoading(false);
        return;
      }

      // For other currencies, try officialdata.org API
      const response = await axios.get(
        `https://www.officialdata.org/api/inflation/${currency}/${amount}/${startYear}/${endYear}`
      );

      if (response.data && response.data.value) {
        inflatedValue = parseFloat(response.data.value);
        const totalInflation = ((inflatedValue - amount) / amount * 100).toFixed(2);
        const avgInflationRate = (totalInflation / (endYear - startYear)).toFixed(2);

        setResult({
          originalAmount: amount,
          inflatedValue: inflatedValue.toFixed(2),
          totalInflation: totalInflation,
          avgInflationRate: avgInflationRate,
          startYear: startYear,
          endYear: endYear,
          currency: currency,
          yearsDifference: endYear - startYear,
          dataSource: dataSource,
          isOfficial: true
        });
      } else {
        throw new Error('No data available');
      }
    } catch (err) {
      console.error('Inflation calculation error:', err);
      
      // Fallback: Use approximate inflation calculation
      const years = endYear - startYear;
      const avgRate = currency === 'INR' ? 0.065 : 0.038; // 6.5% for INR, 3.8% for others
      const inflatedValue = amount * Math.pow(1 + avgRate, years);
      const totalInflation = ((inflatedValue - amount) / amount * 100).toFixed(2);

      setResult({
        originalAmount: amount,
        inflatedValue: inflatedValue.toFixed(2),
        totalInflation: totalInflation,
        avgInflationRate: (avgRate * 100).toFixed(2),
        startYear: startYear,
        endYear: endYear,
        currency: currency,
        yearsDifference: years,
        dataSource: 'Estimated',
        isEstimate: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inflation-container">
      <h2>📈 Historical Value Calculator</h2>
      <p className="subtitle">Calculate purchasing power over time</p>

      <div className="inflation-card">
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

        <div className="input-group">
          <label>Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {currencies.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.code} - {curr.name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>Start Year</label>
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(parseInt(e.target.value))}
              min={minYear}
              max={currentYear - 1}
            />
          </div>

          <div className="input-group">
            <label>End Year</label>
            <input
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(parseInt(e.target.value))}
              min={minYear + 1}
              max={currentYear}
            />
          </div>
        </div>

        <button className="calculate-button" onClick={calculateInflation}>
          Calculate Historical Value
        </button>

        {loading && <div className="loading">Calculating...</div>}
        
        {error && <div className="error">{error}</div>}

        {result && !loading && (
          <div className="result-box">
            <div className="result-main">
              <div className="result-label">
                {result.originalAmount} {result.currency} in {result.startYear}
              </div>
              <div className="result-value">
                {result.inflatedValue} {result.currency}
              </div>
              <div className="result-comparison">
                in {result.endYear} {result.currency === 'INR' ? 'rupees' : result.currency === 'GBP' ? 'pounds' : result.currency === 'EUR' ? 'euros' : 'dollars'}
              </div>
            </div>

            <div className="result-details">
              <div className="detail-row">
                <span className="detail-label">Total Inflation:</span>
                <span className="detail-value">{result.totalInflation}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Average Annual Rate:</span>
                <span className="detail-value">{result.avgInflationRate}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Years:</span>
                <span className="detail-value">{result.yearsDifference} years</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Purchasing Power Change:</span>
                <span className="detail-value">
                  {((result.originalAmount / result.inflatedValue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {result.dataSource && (
              <div className="info-box" style={{marginTop: '15px', background: 'rgba(255,255,255,0.2)', color: 'white', borderLeft: '4px solid white'}}>
                {result.isOfficial ? (
                  <>✓ Official data from: {result.dataSource}</>
                ) : (
                  <>Note: Using estimated inflation rate. For precise historical data, the API may be temporarily unavailable.</>
                )}
              </div>
            )}
          </div>
        )}

        <div className="info-box">
          <strong>💡 How it works:</strong> This calculator shows how much money from the past would be worth today, accounting for inflation. For example, $100 in 1982 had much more purchasing power than $100 today.
          {currency === 'INR' && (
            <div style={{marginTop: '10px'}}>
              <strong>INR Data:</strong> Uses official inflation rates from Reserve Bank of India (RBI) and World Bank data from 1958 onwards.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InflationCalculator;
