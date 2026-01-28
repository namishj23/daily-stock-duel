// NSE Top 100 Stocks for the prediction contest
export const NSE_TOP_100_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd." },
  { symbol: "TCS", name: "Tata Consultancy Services Ltd." },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd." },
  { symbol: "INFY", name: "Infosys Ltd." },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd." },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd." },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd." },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "ITC", name: "ITC Ltd." },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd." },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd." },
  { symbol: "LT", name: "Larsen & Toubro Ltd." },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd." },
  { symbol: "AXISBANK", name: "Axis Bank Ltd." },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd." },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd." },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Ltd." },
  { symbol: "TITAN", name: "Titan Company Ltd." },
  { symbol: "DMART", name: "Avenue Supermarts Ltd." },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd." },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv Ltd." },
  { symbol: "WIPRO", name: "Wipro Ltd." },
  { symbol: "ONGC", name: "Oil and Natural Gas Corporation Ltd." },
  { symbol: "NTPC", name: "NTPC Ltd." },
  { symbol: "POWERGRID", name: "Power Grid Corporation of India Ltd." },
  { symbol: "M&M", name: "Mahindra & Mahindra Ltd." },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd." },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd." },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd." },
  { symbol: "ADANIPORTS", name: "Adani Ports and Special Economic Zone Ltd." },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd." },
  { symbol: "COALINDIA", name: "Coal India Ltd." },
  { symbol: "TECHM", name: "Tech Mahindra Ltd." },
  { symbol: "INDUSINDBK", name: "IndusInd Bank Ltd." },
  { symbol: "HINDALCO", name: "Hindalco Industries Ltd." },
  { symbol: "NESTLEIND", name: "Nestle India Ltd." },
  { symbol: "GRASIM", name: "Grasim Industries Ltd." },
  { symbol: "DIVISLAB", name: "Divi's Laboratories Ltd." },
  { symbol: "BPCL", name: "Bharat Petroleum Corporation Ltd." },
  { symbol: "BRITANNIA", name: "Britannia Industries Ltd." },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp Ltd." },
  { symbol: "CIPLA", name: "Cipla Ltd." },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals Enterprise Ltd." },
  { symbol: "EICHERMOT", name: "Eicher Motors Ltd." },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories Ltd." },
  { symbol: "SBILIFE", name: "SBI Life Insurance Company Ltd." },
  { symbol: "HDFCLIFE", name: "HDFC Life Insurance Company Ltd." },
  { symbol: "TATACONSUM", name: "Tata Consumer Products Ltd." },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto Ltd." },
  { symbol: "SHREECEM", name: "Shree Cement Ltd." },
] as const;

// Contest timing configuration (IST)
export const CONTEST_TIMING = {
  WINDOW_RESET: { hour: 8, minute: 30 }, // 8:30 AM IST - Daily window reset
  MARKET_OPEN: { hour: 9, minute: 15 }, // 9:15 AM IST
  MARKET_CLOSE: { hour: 15, minute: 30 }, // 3:30 PM IST
  RESULT_DECLARATION: { hour: 16, minute: 0 }, // 4:00 PM IST
} as const;

// Prize configuration
export const PRIZE_CONFIG = {
  DAILY_PRIZE: 500, // ₹500 per day
  CURRENCY: "INR",
  CURRENCY_SYMBOL: "₹",
} as const;

// Validation rules
export const VALIDATION_RULES = {
  MIN_JUSTIFICATION_WORDS: 50,
  MIN_AGE: 18,
} as const;

// Contest rules for display
export const CONTEST_RULES = [
  "One prediction per user per day (editable anytime)",
  "24-hour window: 8:30 AM to 8:30 AM next day",
  "Predict for the next trading day's market",
  "Select from any NSE listed stock or ETF",
  "Edit your prediction anytime before window closes",
  "Winner: closest prediction to actual % change",
  "Tie-breaker: earliest final submission",
  "Must be 18+ years to participate",
] as const;
