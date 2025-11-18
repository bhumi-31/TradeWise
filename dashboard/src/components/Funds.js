import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

const Funds = () => {
  const [funds, setFunds] = useState({
    availableMargin: 0,
    usedMargin: 0,
    availableCash: 0,
    openingBalance: 4043.10,
    payin: 4064.00,
  });
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFundsData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchFundsData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchFundsData = async () => {
    try {
      const [holdingsRes, ordersRes] = await Promise.all([
        axiosInstance.get("http://localhost:3002/allHoldings"),
        axiosInstance.get("http://localhost:3002/allOrders")
      ]);

      setHoldings(holdingsRes.data);
      setOrders(ordersRes.data);

      // Calculate used margin from current holdings
      const usedMargin = holdingsRes.data.reduce((sum, holding) => {
        return sum + (holding.avg * holding.qty);
      }, 0);

      const availableMargin = funds.openingBalance + funds.payin - usedMargin;

      setFunds(prev => ({
        ...prev,
        usedMargin: usedMargin,
        availableMargin: availableMargin,
        availableCash: availableMargin
      }));

      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching funds data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="funds">
        <div className="text-center mt-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading funds...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI</p>
        <Link className="btn btn-green">Add funds</Link>
        <Link className="btn btn-blue">Withdraw</Link>
      </div>

      <div className="row">
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored" style={{ 
                color: funds.availableMargin > 1000 ? '#4caf50' : '#ff9800',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                ₹{funds.availableMargin.toFixed(2)}
              </p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">₹{funds.usedMargin.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">₹{funds.availableCash.toFixed(2)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>₹{funds.openingBalance.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Total Holdings Value</p>
              <p>₹{holdings.reduce((sum, h) => sum + (h.price * h.qty), 0).toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>₹{funds.payin.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>₹0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>₹0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>₹{(funds.usedMargin * 0.8).toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>₹{(funds.usedMargin * 0.8).toFixed(2)}</p>
            </div>
          </div>

          {/* Live Stats Summary */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f0f7ff',
            borderRadius: '8px',
            border: '1px solid #2196f3'
          }}>
            <h6 style={{ color: '#2196f3', marginBottom: '10px' }}>📊 Live Statistics</h6>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <small style={{ color: '#666' }}>Total Orders Today</small>
                <p style={{ fontWeight: 'bold', margin: '5px 0', color: '#2196f3' }}>
                  {orders.length}
                </p>
              </div>
              <div>
                <small style={{ color: '#666' }}>Total Stocks Held</small>
                <p style={{ fontWeight: 'bold', margin: '5px 0', color: '#4caf50' }}>
                  {holdings.length}
                </p>
              </div>
              <div>
                <small style={{ color: '#666' }}>Margin Utilization</small>
                <p style={{ fontWeight: 'bold', margin: '5px 0', color: '#ff9800' }}>
                  {((funds.usedMargin / (funds.openingBalance + funds.payin)) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <small style={{ color: '#666' }}>Free Funds</small>
                <p style={{ fontWeight: 'bold', margin: '5px 0', color: '#4caf50' }}>
                  ₹{funds.availableMargin.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <Link className="btn btn-blue">Open Account</Link>
          </div>

          {/* Recent Activity */}
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <h6 style={{ marginBottom: '15px' }}>Recent Activity</h6>
            {orders.slice(0, 5).map((order, index) => (
              <div key={index} style={{
                padding: '10px 0',
                borderBottom: index < 4 ? '1px solid #eee' : 'none',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontWeight: '500' }}>{order.name}</span>
                  <br />
                  <small style={{ color: '#666' }}>
                    {order.qty} shares @ ₹{order.price}
                  </small>
                </div>
                <span className={order.mode === "BUY" ? "profit" : "loss"} style={{
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {order.mode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;