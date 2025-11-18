import React, { useState, useContext } from "react";
import axiosInstance from "../utils/axiosConfig";
import GeneralContext from "./GeneralContext";
import Notification from "./Notification";
import ConfirmDialog from "./ConfirmDialog";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { closeBuyWindow } = useContext(GeneralContext);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleBuyClick = async () => {
    // Validation
    if (stockQuantity <= 0 || stockPrice <= 0) {
      setError("Please enter valid quantity and price");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post(
        "http://localhost:3002/newOrder",
        {
          name: uid,
          qty: stockQuantity,
          price: stockPrice,
          mode: "BUY",
        }
      );

      console.log("✅ Order placed:", response.data);
      showNotification(`Buy order placed successfully for ${uid}`, "success");
      
      setTimeout(() => {
        closeBuyWindow();
      }, 1500);
    } catch (err) {
      console.error("❌ Order failed:", err);
      const errorMsg = err.response?.data?.message || "Failed to place order";
      setError(errorMsg);
      showNotification(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
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

    <div className="container" id="buy-window" draggable="true">
      <div className="header">
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
        <span>Margin required ₹{(stockPrice * stockQuantity).toFixed(2)}</span>
        <div>
          <button
            className="btn btn-blue"
            onClick={handleBuyClick}
            disabled={loading}
          >
            {loading ? "Placing..." : "Buy"}
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

export default BuyActionWindow;