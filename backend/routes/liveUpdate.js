const express = require('express');
const router = express.Router();
const {HoldingsModel} = require('../model/HoldingsModel');
const {PositionsModel} = require('../model/PositionsModel');
const { getCachedQuotes } = require('../services/yahooFinanceService');

// Get live prices
router.get('/livePrices', async (req, res) => {
  try {
    console.log('\n📊 Live Prices Request Received');
    
    const holdings = await HoldingsModel.find();
    const positions = await PositionsModel.find();

    const holdingSymbols = holdings.map(h => h.name);
    const positionSymbols = positions.map(p => p.name);
    const allSymbols = [...new Set([...holdingSymbols, ...positionSymbols])];

    console.log(`🔍 Symbols to fetch: ${allSymbols.join(', ')}`);

    const liveQuotes = await getCachedQuotes(allSymbols);
    const quotesMap = {};
    
    allSymbols.forEach((symbol, index) => {
      if (liveQuotes[index]) {
        quotesMap[symbol] = liveQuotes[index];
      }
    });

    // Update holdings with live data
    const updatedHoldings = holdings.map(stock => {
      const liveData = quotesMap[stock.name];
      
      if (liveData) {
        const netChange = ((liveData.currentPrice - stock.avg) / stock.avg * 100).toFixed(2);
        return {
          _id: stock._id,
          name: stock.name,
          qty: stock.qty,
          avg: stock.avg,
          price: liveData.currentPrice,
          net: `${netChange >= 0 ? '+' : ''}${netChange}%`,
          day: `${liveData.percentChange >= 0 ? '+' : ''}${liveData.percentChange.toFixed(2)}%`,
          isLoss: liveData.percentChange < 0
        };
      }
      
      // ✅ If live data not available, use database values
      console.log(`⚠️ Using database price for ${stock.name}`);
      return {
        _id: stock._id,
        name: stock.name,
        qty: stock.qty,
        avg: stock.avg,
        price: stock.price || stock.avg,
        net: stock.net || "0.00%",
        day: stock.day || "0.00%",
        isLoss: stock.isLoss || false
      };
    });

    // Update positions
    const updatedPositions = positions.map(stock => {
      const liveData = quotesMap[stock.name];
      
      if (liveData) {
        const netChange = ((liveData.currentPrice - stock.avg) / stock.avg * 100).toFixed(2);
        return {
          _id: stock._id,
          product: stock.product,
          name: stock.name,
          qty: stock.qty,
          avg: stock.avg,
          price: liveData.currentPrice,
          net: `${netChange >= 0 ? '+' : ''}${netChange}%`,
          day: `${liveData.percentChange >= 0 ? '+' : ''}${liveData.percentChange.toFixed(2)}%`,
          isLoss: liveData.percentChange < 0
        };
      }
      
      // Use database values if live data not available
      return {
        _id: stock._id,
        product: stock.product,
        name: stock.name,
        qty: stock.qty,
        avg: stock.avg,
        price: stock.price || stock.avg,
        net: stock.net || "0.00%",
        day: stock.day || "0.00%",
        isLoss: stock.isLoss || false
      };
    });

    console.log('✅ Live prices sent to frontend\n');

    res.json({
      success: true,
      holdings: updatedHoldings,
      positions: updatedPositions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching live prices:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch live prices',
      message: error.message 
    });
  }
});

// Update database prices
router.post('/updatePrices', async (req, res) => {
  try {
    console.log('\n🔄 Background Price Update Started');
    
    const holdings = await HoldingsModel.find();
    const symbols = holdings.map(h => h.name);
    const liveQuotes = await getCachedQuotes(symbols);

    let updated = 0;
    for (let i = 0; i < holdings.length; i++) {
      if (liveQuotes[i]) {
        const netChange = ((liveQuotes[i].currentPrice - holdings[i].avg) / holdings[i].avg * 100).toFixed(2);
        
        holdings[i].price = liveQuotes[i].currentPrice;
        holdings[i].net = `${netChange >= 0 ? '+' : ''}${netChange}%`;
        holdings[i].day = `${liveQuotes[i].percentChange >= 0 ? '+' : ''}${liveQuotes[i].percentChange.toFixed(2)}%`;
        holdings[i].isLoss = liveQuotes[i].percentChange < 0;
        await holdings[i].save();
        updated++;
      }
    }

    // Same for positions
    const positions = await PositionsModel.find();
    const posSymbols = positions.map(p => p.name);
    const posQuotes = await getCachedQuotes(posSymbols);

    for (let i = 0; i < positions.length; i++) {
      if (posQuotes[i]) {
        const netChange = ((posQuotes[i].currentPrice - positions[i].avg) / positions[i].avg * 100).toFixed(2);
        
        positions[i].price = posQuotes[i].currentPrice;
        positions[i].net = `${netChange >= 0 ? '+' : ''}${netChange}%`;
        positions[i].day = `${posQuotes[i].percentChange >= 0 ? '+' : ''}${posQuotes[i].percentChange.toFixed(2)}%`;
        positions[i].isLoss = posQuotes[i].percentChange < 0;
        await positions[i].save();
        updated++;
      }
    }

    console.log(`✅ ${updated} prices updated in database\n`);
    res.json({ 
      success: true, 
      message: `${updated} prices updated`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error updating prices:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update prices',
      message: error.message 
    });
  }
});

module.exports = router;