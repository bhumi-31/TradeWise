import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import axios from "axios";

const TopBar = () => {
  const [nifty, setNifty] = useState({ price: 0, change: 0, percent: 0 });
  const [sensex, setSensex] = useState({ price: 0, change: 0, percent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIndices();
    
    // Update every 60 seconds
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchIndices = async () => {
    try {
      // Fetch NIFTY 50
      const niftyRes = await axios.get(
        'https://query1.finance.yahoo.com/v8/finance/chart/^NSEI?interval=1d&range=1d',
        {
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        }
      );

      // Fetch SENSEX
      const sensexRes = await axios.get(
        'https://query1.finance.yahoo.com/v8/finance/chart/^BSESN?interval=1d&range=1d',
        {
          headers: {
            'User-Agent': 'Mozilla/5.0'
          }
        }
      );

      // Process NIFTY data
      if (niftyRes.data?.chart?.result?.[0]) {
        const niftyData = niftyRes.data.chart.result[0];
        const niftyMeta = niftyData.meta;
        const niftyPrice = niftyMeta.regularMarketPrice;
        const niftyPrevClose = niftyMeta.chartPreviousClose;
        const niftyChange = niftyPrice - niftyPrevClose;
        const niftyPercent = (niftyChange / niftyPrevClose) * 100;

        setNifty({
          price: niftyPrice.toFixed(2),
          change: niftyChange.toFixed(2),
          percent: niftyPercent.toFixed(2)
        });
      }

      // Process SENSEX data
      if (sensexRes.data?.chart?.result?.[0]) {
        const sensexData = sensexRes.data.chart.result[0];
        const sensexMeta = sensexData.meta;
        const sensexPrice = sensexMeta.regularMarketPrice;
        const sensexPrevClose = sensexMeta.chartPreviousClose;
        const sensexChange = sensexPrice - sensexPrevClose;
        const sensexPercent = (sensexChange / sensexPrevClose) * 100;

        setSensex({
          price: sensexPrice.toFixed(2),
          change: sensexChange.toFixed(2),
          percent: sensexPercent.toFixed(2)
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching indices:", error);
      setLoading(false);
    }
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">
            {loading ? "..." : nifty.price}
          </p>
          <p className={`percent ${parseFloat(nifty.change) >= 0 ? 'profit' : 'loss'}`}>
            {loading ? "" : `${parseFloat(nifty.change) >= 0 ? '+' : ''}${nifty.change} (${nifty.percent}%)`}
          </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">
            {loading ? "..." : sensex.price}
          </p>
          <p className={`percent ${parseFloat(sensex.change) >= 0 ? 'profit' : 'loss'}`}>
            {loading ? "" : `${parseFloat(sensex.change) >= 0 ? '+' : ''}${sensex.change} (${sensex.percent}%)`}
          </p>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;