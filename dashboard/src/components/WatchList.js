import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import { DoughnutChart } from "./DoughnoutChart";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([
    { name: "INFY", price: 1555.45, percent: "-1.60%", isDown: true },
    { name: "ONGC", price: 116.8, percent: "-0.09%", isDown: true },
    { name: "TCS", price: 3194.8, percent: "-0.25%", isDown: true },
    { name: "KPITTECH", price: 266.45, percent: "3.54%", isDown: false },
    { name: "QUICKHEAL", price: 308.55, percent: "-0.15%", isDown: true },
    { name: "WIPRO", price: 577.75, percent: "0.32%", isDown: false },
    { name: "M&M", price: 779.8, percent: "-0.01%", isDown: true },
    { name: "RELIANCE", price: 2112.4, percent: "1.44%", isDown: false },
    { name: "HUL", price: 512.4, percent: "1.04%", isDown: false },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLivePrices();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLivePrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLivePrices = async () => {
    try {
      setLoading(true);
      
      // Get symbols from watchlist
      const symbols = watchlist.map(stock => stock.name);
      
      // You can create a backend endpoint for watchlist live prices
      // For now, we'll use a simple approach
      const promises = symbols.map(async (symbol) => {
        try {
          const formattedSymbol = symbol === 'HUL' ? 'HINDUNILVR' : symbol;
          const response = await axios.get(
            `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}.NS?interval=1d&range=1d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0'
              },
              timeout: 5000
            }
          );

          const data = response.data.chart.result[0];
          const meta = data.meta;
          
          if (meta) {
            const currentPrice = meta.regularMarketPrice;
            const previousClose = meta.chartPreviousClose;
            const change = currentPrice - previousClose;
            const percentChange = (change / previousClose) * 100;

            return {
              name: symbol,
              price: currentPrice,
              percent: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`,
              isDown: percentChange < 0
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error.message);
          return null;
        }
      });

      const results = await Promise.all(promises);
      
      // Update watchlist with live data
      const updatedWatchlist = watchlist.map((stock, index) => {
        if (results[index]) {
          return results[index];
        }
        return stock;
      });

      setWatchlist(updatedWatchlist);
      setLoading(false);
    } catch (error) {
      console.error("Error updating watchlist:", error);
      setLoading(false);
    }
  };

  const labels = watchlist.map((stock) => stock.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlist.length} / 50</span>
      </div>

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '10px', 
          color: '#2196f3',
          fontSize: '0.85rem'
        }}>
          Updating prices...
        </div>
      )}

      <ul className="list">
        {watchlist.map((stock, index) => {
          return <WatchListItem stock={stock} key={index} />;
        })}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchlistActions(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

const WatchListActions = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };

  const handleSellClick = () => {
    generalContext.openSellWindow(uid);
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy">Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleSellClick}
        >
          <button className="sell">Sell</button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};