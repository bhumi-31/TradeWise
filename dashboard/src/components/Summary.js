import React, { useState, useEffect } from "react";
import axios from "axios";

const Summary = () => {
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("User"); // ✅ Default username

  useEffect(() => {
    // ✅ Fetch username from localStorage
    const fetchUsername = () => {
      const savedUsername = localStorage.getItem('username');
      const savedUser = localStorage.getItem('user');
      
      if (savedUsername) {
        setUsername(savedUsername);
      } else if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUsername(userData.username || "User");
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
        }
      }
    };

    fetchUsername();
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [holdingsRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:3002/live/livePrices"),
        axios.get("http://localhost:3002/allOrders")
      ]);

      if (holdingsRes.data.success && holdingsRes.data.holdings) {
        setHoldings(holdingsRes.data.holdings);
      }
      setOrders(ordersRes.data);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let totalInvestment = 0;
    let totalCurrentValue = 0;
    let marginUsed = 0;

    holdings.forEach(holding => {
      const avg = Number(holding.avg) || 0;
      const qty = Number(holding.qty) || 0;
      const price = Number(holding.price) || 0;

      totalInvestment += avg * qty;
      totalCurrentValue += price * qty;
    });

    orders.forEach(order => {
      marginUsed += Number(order.qty) * Number(order.price);
    });

    const totalPL = totalCurrentValue - totalInvestment;
    const totalPLPercentage = totalInvestment > 0 
      ? ((totalPL / totalInvestment) * 100).toFixed(2)
      : "0.00";

    const availableMargin = 3740; // Example value

    return { 
      totalInvestment, 
      totalCurrentValue, 
      totalPL, 
      totalPLPercentage,
      marginUsed,
      availableMargin
    };
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <>
      <div className="username">
        {/* ✅ Real username display */}
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      {/* Equity Section */}
      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 style={{ color: totals.availableMargin > 1000 ? '#4caf50' : '#ff9800' }}>
              ₹{totals.availableMargin.toFixed(2)}
            </h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{totals.marginUsed.toFixed(2)}</span>
            </p>
            <p>
              Opening balance <span>₹3,740.00</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {/* Holdings Section */}
      <div className="section">
        <span>
          <p>Holdings ({holdings.length})</p>
        </span>

        {holdings.length > 0 ? (
          <div className="data">
            <div className="first">
              <h3 className={totals.totalPL >= 0 ? "profit" : "loss"}>
                {totals.totalPL >= 0 ? "+" : ""}₹{totals.totalPL.toFixed(2)}{" "}
                <small>
                  {totals.totalPL >= 0 ? "+" : ""}{totals.totalPLPercentage}%
                </small>
              </h3>
              <p>P&L</p>
            </div>
            <hr />

            <div className="second">
              <p>
                Current Value <span>₹{totals.totalCurrentValue.toFixed(2)}</span>
              </p>
              <p>
                Investment <span>₹{totals.totalInvestment.toFixed(2)}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="data text-center py-4">
            <p className="text-muted">No holdings yet. Start investing!</p>
          </div>
        )}
        <hr className="divider" />
      </div>

      {/* Orders Section */}
      <div className="section">
        <span>
          <p>Recent Orders ({orders.length})</p>
        </span>

        {orders.length > 0 ? (
          <div className="data">
            <div className="first">
              <h3 style={{ color: '#2196f3' }}>
                {orders.length}
              </h3>
              <p>Total Orders Today</p>
            </div>
            <hr />

            <div className="second">
              <p>
                Buy Orders{" "}
                <span className="profit">
                  {orders.filter(o => o.mode === "BUY").length}
                </span>
              </p>
              <p>
                Sell Orders{" "}
                <span className="loss">
                  {orders.filter(o => o.mode === "SELL").length}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="data text-center py-4">
            <p className="text-muted">No orders placed today</p>
          </div>
        )}
        <hr className="divider" />
      </div>

      {/* Quick Stats */}
      <div className="section">
        <span>
          <p>Quick Stats</p>
        </span>

        <div className="data">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px',
            padding: '10px 0'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h5 style={{ color: '#666', fontSize: '0.85rem', marginBottom: '5px' }}>
                Portfolio Value
              </h5>
              <h4 style={{ color: '#333', fontWeight: 'bold', margin: 0 }}>
                ₹{totals.totalCurrentValue.toFixed(2)}
              </h4>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h5 style={{ color: '#666', fontSize: '0.85rem', marginBottom: '5px' }}>
                Returns %
              </h5>
              <h4 className={totals.totalPL >= 0 ? "profit" : "loss"} style={{ fontWeight: 'bold', margin: 0 }}>
                {totals.totalPL >= 0 ? "+" : ""}{totals.totalPLPercentage}%
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;