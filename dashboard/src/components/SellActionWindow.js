import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { closeSellWindow } = useContext(GeneralContext);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleSellClick = async () => {
    if (stockQuantity <= 0 || stockPrice <= 0) {
      setError("Please enter valid quantity and price");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "SELL",
      });

      console.log("✅ Sell order placed:", response.data);
      showNotification(`Sell order placed successfully for ${uid}`, "success");
      
      setTimeout(() => {
        closeSellWindow();
      }, 1500);
    } catch (err) {
      console.error("❌ Sell order failed:", err);
      const errorMsg = err.response?.data?.message || "Failed to place sell order";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="container" id="sell-window" draggable="true">
        <div className="header" style={{ background: "#e53935" }}>
          <h3>
            {uid} <span>NSE</span>
          </h3>
          <div className="market-options">
            <label>
              <input type="radio" name="order-type" defaultChecked />
              Market
            </label>
            <label>
              <input type="radio" name="order-type" />
              Limit
            </label>
          </div>
        </div>

        <div className="regular-order">
          {error && (
            <div style={{ color: "red", marginBottom: "10px", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <div className="inputs">
            <fieldset>
              <legend>Qty.</legend>
              <input
                type="number"
                name="qty"
                id="qty"
                min="1"
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                value={stockQuantity}
              />
            </fieldset>
            <fieldset>
              <legend>Price</legend>
              <input
                type="number"
                name="price"
                id="price"
                step="0.05"
                min="0"
                onChange={(e) => setStockPrice(Number(e.target.value))}
                value={stockPrice}
              />
            </fieldset>
          </div>

          <div className="order-validity">
            <label>
              <input type="radio" name="validity" defaultChecked />
              Day <span>(Default)</span>
            </label>
            <label>
              <input type="radio" name="validity" />
              IOC
            </label>
          </div>
        </div>

        <div className="buttons">
          <span>Est. proceeds ₹{(stockPrice * stockQuantity).toFixed(2)}</span>
          <div>
            <button 
              className="btn" 
              style={{ background: "#e53935" }}
              onClick={handleSellClick}
              disabled={loading}
            >
              {loading ? "Placing..." : "Sell"}
            </button>
            <button 
              className="btn btn-grey" 
              onClick={handleCancelClick}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellActionWindow;