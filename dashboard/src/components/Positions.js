import React, { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchPositions = async () => {
    try {
      const response = await axios.get("http://localhost:3002/live/livePrices");
      console.log("✅ Live positions data:", response.data);
      
      if (response.data.success && response.data.positions) {
        setPositions(response.data.positions);
        setLastUpdate(new Date(response.data.timestamp));
      }
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching positions:", err);
      // Fallback to regular positions
      try {
        const fallbackResponse = await axios.get("http://localhost:3002/allPositions");
        setPositions(fallbackResponse.data);
      } catch (fallbackErr) {
        setError("Failed to load positions");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPositions, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateTotals = () => {
    let totalPL = 0;
    let totalValue = 0;

    positions.forEach(position => {
      const curValue = position.price * position.qty;
      const investValue = position.avg * position.qty;
      totalPL += curValue - investValue;
      totalValue += curValue;
    });

    return { totalPL, totalValue };
  };

  if (loading) {
    return (
      <div className="positions">
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2">Loading positions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="positions">
        <p style={{ color: "red" }} className="text-center mt-5">{error}</p>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="positions">
        <h3 className="title">Positions (0)</h3>
        <div className="text-center mt-5" style={{ padding: '50px 20px' }}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" 
            alt="No positions" 
            style={{ width: '120px', opacity: 0.5 }}
          />
          <h5 className="mt-3">No open positions</h5>
          <p className="text-muted">Your intraday positions will appear here</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="positions">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="title">Positions ({positions.length})</h3>
        <div>
          <button 
            onClick={fetchPositions} 
            className="btn btn-sm btn-outline-primary"
            style={{ marginRight: '10px' }}
          >
            🔄 Refresh
          </button>
          {lastUpdate && (
            <small className="text-muted">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </small>
          )}
        </div>
      </div>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Net Chg.</th>
              <th>Day Chg.</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const investValue = stock.avg * stock.qty;
              const profitLoss = curValue - investValue;
              const isProfit = profitLoss >= 0;
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>₹{stock.avg.toFixed(2)}</td>
                  <td>
                    <span className={stock.isLoss ? "loss" : "profit"}>
                      ₹{stock.price.toFixed(2)}
                    </span>
                  </td>
                  <td className={isProfit ? "profit" : "loss"}>
                    {isProfit ? "+" : ""}₹{profitLoss.toFixed(2)}
                  </td>
                  <td className={stock.net?.includes('+') ? "profit" : "loss"}>
                    {stock.net || "0.00%"}
                  </td>
                  <td className={dayClass}>{stock.day || "0.00%"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="row mt-4 p-4" style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div className="col-6">
          <h5 style={{ color: '#666', fontSize: '0.9rem' }}>Total P&L</h5>
          <h4 className={totals.totalPL >= 0 ? "profit" : "loss"} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {totals.totalPL >= 0 ? "+" : ""}₹{totals.totalPL.toFixed(2)}
          </h4>
        </div>
        <div className="col-6">
          <h5 style={{ color: '#666', fontSize: '0.9rem' }}>Total Value</h5>
          <h4 className="text-muted" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ₹{totals.totalValue.toFixed(2)}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Positions;