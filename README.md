# Currency Calculyzer App

A React 2-in-1 application with two powerful features: Currency Calculator + Analyzer = Calculyzer

## Features

### 1. Currency Converter 💱
- Convert between multiple currencies in real-time
- Live exchange rates from exchangerate-api.com
- Support for major currencies (USD, EUR, GBP, INR, JPY, AUD, CAD, CHF, CNY, AED)
- Swap currencies with one click
- Shows current exchange rate

### 2. Historical Value Analyzer 📈
- Calculate how much money from the past is worth today
- Accounts for inflation over time
- Shows total inflation percentage
- Displays average annual inflation rate
- Supports USD, GBP, EUR, CAD, AUD
- Data from 1913 to present

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
```

## APIs Used

- **exchangerate-api.com** - Free currency exchange rates (no API key required)
- **officialdata.org** - Historical inflation data (with fallback calculation)

## Technologies

- React 18
- Axios for API calls
- CSS3 with gradient backgrounds
- Responsive design

## Example Usage

### Currency Converter
- Enter amount: 100
- Select from: USD
- Select to: INR
- Result: ~8,300 INR (varies with live rates)

### Historical Value
- Amount: 100
- Currency: USD
- Start Year: 1982
- End Year: 2024
- Result: Shows what $100 from 1982 is worth today

## Notes

- Currency conversion uses live data and updates automatically
- Historical value analyzer includes fallback calculation if API is unavailable
- All data is fetched from official and verified sources
