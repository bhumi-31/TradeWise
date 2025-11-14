import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph"; 

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // ✅ Fetch holdings with live prices
  const fetchHoldings = async () => {
    try {
      const response = await axios.get("http://localhost:3002/live/livePrices");
      console.log("✅ Live holdings data:", response.data);
      
      if (response.data.success && response.data.holdings) {
        setAllHoldings(response.data.holdings);
        setLastUpdate(new Date(response.data.timestamp));
      }
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching holdings:", err);
      // Fallback to regular holdings if live fails
      try {
        const fallbackResponse = await axios.get("http://localhost:3002/allHoldings");
        setAllHoldings(fallbackResponse.data);
      } catch (fallbackErr) {
        setError("Failed to load holdings");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
    
    // ✅ Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchHoldings();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const calculateTotals = () => {
    let totalInvestment = 0;
    let totalCurrentValue = 0;

    allHoldings.forEach(holding => {
      const avg = Number(holding.avg) || 0;
      const qty = Number(holding.qty) || 0;
      const price = Number(holding.price) || 0;

      totalInvestment += avg * qty;
      totalCurrentValue += price * qty;
    });

    const totalPL = totalCurrentValue - totalInvestment;
    const totalPLPercentage = totalInvestment > 0 
      ? ((totalPL / totalInvestment) * 100).toFixed(2)
      : "0.00";

    return { totalInvestment, totalCurrentValue, totalPL, totalPLPercentage };
  };

  if (loading) return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-2">Loading holdings...</p>
    </div>
  );

  if (error) return <p style={{ color: "red" }} className="text-center mt-5">{error}</p>;

  const totals = calculateTotals();

  return (
    <div className="holdings-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="title">Holdings ({allHoldings.length})</h3>
        <div>
          <button 
            onClick={fetchHoldings} 
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

      {allHoldings.length > 0 ? (
        <>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. cost</th>
                  <th>LTP</th>
                  <th>Cur. val</th>
                  <th>P&L</th>
                  <th>Net chg.</th>
                  <th>Day chg.</th>
                </tr>
              </thead>

              <tbody>
                {allHoldings.map((holding) => {
                  const price = Number(holding.price) || 0;
                  const qty = Number(holding.qty) || 0;
                  const avg = Number(holding.avg) || 0;

                  const currentValue = price * qty;
                  const investmentValue = avg * qty;
                  const profitLoss = currentValue - investmentValue;
                  const isProfitable = profitLoss >= 0;

                  return (
                    <tr key={holding._id}>
                      <td>{holding.name}</td>
                      <td>{qty}</td>
                      <td>₹{avg.toFixed(2)}</td>
                      <td>
                        <span className={holding.isLoss ? "loss" : "profit"}>
                          ₹{price.toFixed(2)}
                        </span>
                      </td>
                      <td>₹{currentValue.toFixed(2)}</td>
                      <td className={isProfitable ? "profit" : "loss"}>
                        {isProfitable ? "+" : ""}₹{profitLoss.toFixed(2)}
                      </td>
                      <td className={holding.net?.includes('+') ? "profit" : "loss"}>
                        {holding.net || "0.00%"}
                      </td>
                      <td className={holding.isLoss ? "loss" : "profit"}>
                        {holding.day || "0.00%"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="row mt-5 p-4" style={{ 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div className="col-4">
              <h5 style={{ color: '#666', fontSize: '0.9rem' }}>Total Investment</h5>
              <h4 className="text-muted" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ₹{totals.totalInvestment.toFixed(2)}
              </h4>
            </div>
            <div className="col-4">
              <h5 style={{ color: '#666', fontSize: '0.9rem' }}>Current Value</h5>
              <h4 className="text-muted" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ₹{totals.totalCurrentValue.toFixed(2)}
              </h4>
            </div>
            <div className="col-4">
              <h5 style={{ color: '#666', fontSize: '0.9rem' }}>Total P&L</h5>
              <h4 className={totals.totalPL >= 0 ? "profit" : "loss"} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {totals.totalPL >= 0 ? "+" : ""}₹{totals.totalPL.toFixed(2)} ({totals.totalPLPercentage}%)
              </h4>
            </div>
          </div>

          <div className="holdings-graph mt-5">
            <VerticalGraph data={allHoldings} />
          </div>
        </>
      ) : (
        <div className="no-holdings text-center mt-5">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" 
            alt="No holdings" 
            style={{ width: '150px', opacity: 0.5 }}
          />
          <h5 className="mt-3">You don't have any holdings yet</h5>
          <p className="text-muted">Start investing to see your portfolio here</p>
        </div>
      )}
    </div>
  );
};

export default Holdings;