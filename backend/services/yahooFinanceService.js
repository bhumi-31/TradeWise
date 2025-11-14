const axios = require('axios');

// Stock symbol mapping for Yahoo Finance
const SYMBOL_MAP = {
  'HUL': 'HINDUNILVR',  // HUL ka correct symbol
  'M&M': 'M&M',         // M&M as is
  'SGBMAY29': null      // Gold bonds Yahoo pe nahi milte
};

// Yahoo Finance API
const getStockQuote = async (symbol) => {
  try {
    // Check if symbol needs mapping
    const mappedSymbol = SYMBOL_MAP[symbol] !== undefined ? SYMBOL_MAP[symbol] : symbol;
    
    // Skip if symbol is not available
    if (mappedSymbol === null) {
      console.log(`⚠️ ${symbol}: Not available on Yahoo Finance (using last known price)`);
      return null;
    }

    const formattedSymbol = mappedSymbol.includes('.NS') ? mappedSymbol : `${mappedSymbol}.NS`;
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}?interval=1d&range=1d`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });

    const data = response.data.chart.result[0];
    const meta = data.meta;
    const quote = data.indicators.quote[0];

    if (!meta || !quote) {
      console.log(`⚠️ No data for ${symbol}`);
      return null;
    }

    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const change = currentPrice - previousClose;
    const percentChange = (change / previousClose) * 100;

    console.log(`✅ ${symbol}: ₹${currentPrice.toFixed(2)} (${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%)`);

    return {
      currentPrice: currentPrice,
      change: change,
      percentChange: percentChange,
      high: meta.regularMarketDayHigh,
      low: meta.regularMarketDayLow,
      open: quote.open[quote.open.length - 1],
      previousClose: previousClose,
      volume: meta.regularMarketVolume
    };
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`⚠️ ${symbol}: Symbol not found on Yahoo Finance`);
    } else {
      console.error(`❌ Error fetching ${symbol}:`, error.message);
    }
    return null;
  }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getBulkQuotes = async (symbols) => {
  console.log(`🔄 Fetching prices for ${symbols.length} stocks...`);
  const results = [];
  
  for (const symbol of symbols) {
    try {
      const data = await getStockQuote(symbol);
      results.push(data);
      await delay(500); // 500ms delay between requests
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error.message);
      results.push(null);
    }
  }
  
  const successCount = results.filter(r => r !== null).length;
  console.log(`✅ Fetched ${successCount}/${symbols.length} stocks successfully`);
  
  return results;
};

// Cache mechanism
let priceCache = {};
let lastUpdateTime = null;
const CACHE_DURATION = 60000; // 1 minute

const getCachedQuotes = async (symbols) => {
  const now = Date.now();
  
  if (lastUpdateTime && (now - lastUpdateTime) < CACHE_DURATION) {
    console.log('📦 Using cached prices (valid for ' + Math.round((CACHE_DURATION - (now - lastUpdateTime)) / 1000) + 's)');
    return symbols.map(s => priceCache[s] || null);
  }

  console.log('🔄 Fetching fresh prices from Yahoo Finance...');
  const quotes = await getBulkQuotes(symbols);
  
  symbols.forEach((symbol, index) => {
    if (quotes[index]) {
      priceCache[symbol] = quotes[index];
    }
  });
  
  lastUpdateTime = now;
  console.log('✅ Cache updated! Valid for 60 seconds.');
  return quotes;
};

module.exports = {
  getStockQuote,
  getBulkQuotes,
  getCachedQuotes
};