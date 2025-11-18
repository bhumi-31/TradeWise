import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { Link } from "react-router-dom";
import Notification from "./Notification";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/allOrders");
      console.log("✅ Orders data:", response.data);
      setAllOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      showNotification("Order cancelled successfully", "success");
      fetchOrders();
    } catch (err) {
      console.error("❌ Cancel failed:", err);
      showNotification("Failed to cancel order", "error");
    }
  };

  if (loading) {
    return (
      <div className="orders">
        <p className="text-center mt-5">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders">
        <p style={{ color: "red" }} className="text-center mt-5">
          {error}
        </p>
      </div>
    );
  }

  if (allOrders.length === 0) {
    return (
      <>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <div className="orders">
          <div className="no-orders">
            <p>You haven't placed any orders today</p>
            <Link to={"/"} className="btn">
              Get started
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="orders">
        <h3 className="title">Orders ({allOrders.length})</h3>

        <div className="order-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allOrders.map((order) => {
                const orderTime = new Date(order.createdAt || Date.now());
                const timeString = orderTime.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr key={order._id}>
                    <td>{timeString}</td>
                    <td>
                      <span
                        className={order.mode === "BUY" ? "profit" : "loss"}
                        style={{ fontWeight: "600" }}
                      >
                        {order.mode}
                      </span>
                    </td>
                    <td>{order.name}</td>
                    <td>{order.qty}</td>
                    <td>₹{Number(order.price).toFixed(2)}</td>
                    <td>
                      <span style={{ color: "#28a745", fontWeight: "500" }}>
                        {order.status || "Completed"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        style={{
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          padding: "5px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="row mt-4 p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
          <div className="col-6">
            <h5>Total Orders</h5>
            <h4 className="text-muted">{allOrders.length}</h4>
          </div>
          <div className="col-6">
            <h5>Total Value</h5>
            <h4 className="text-muted">
              ₹
              {allOrders
                .reduce((sum, order) => sum + order.qty * order.price, 0)
                .toFixed(2)}
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;