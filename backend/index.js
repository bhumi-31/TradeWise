require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require('./model/PositionsModel');
const { OrdersModel } = require("./model/OrdersModel");
const liveUpdateRoutes = require('./routes/liveUpdate');

const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

// ✅ CORS properly configured
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// DB connect
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log("✅ DB connected successfully");
    
    setupRoutes();
    
    app.listen(PORT, () => {
        console.log(`🚀 App started on port ${PORT}!`);
    });
    
    startAutoUpdate();
})
.catch((err) => {
    console.error("❌ DB connection error:", err);
    process.exit(1);
});

function setupRoutes() {
    // ⭐ PUBLIC ROUTES - No authentication needed
    app.use('/api/auth', authRoutes);
    
    // ✅ DASHBOARD ROUTES - Auth removed for testing
    
    // Holdings
    app.get("/allHoldings", async(req, res) => {
        try {
            let allHoldings = await HoldingsModel.find({});
            console.log("✅ Sent holdings:", allHoldings.length);
            res.json(allHoldings);
        } catch (error) {
            console.error("❌ Holdings error:", error);
            res.status(500).json({ error: error.message });
        }
    });

    // Positions
    app.get("/allPositions", async(req, res) => {
        try {
            let allPositions = await PositionsModel.find({});
            console.log("✅ Sent positions:", allPositions.length);
            res.json(allPositions);
        } catch (error) {
            console.error("❌ Positions error:", error);
            res.status(500).json({ error: error.message });
        }
    });

    // Token verification (optional - can keep auth here)
    app.get("/verifyToken", auth, async (req, res) => {
        try {
            res.status(200).json({
                success: true,
                message: "Token is valid",
                user: req.user,
            });
        } catch (error) {
            console.error("❌ Token verification error:", error.message);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    });

    // ⭐ NEW ORDER - AUTH REMOVED
    app.post("/newOrder", async(req, res) => {
        try {
            console.log("\n📝 NEW ORDER REQUEST");
            console.log("Order details:", req.body);
            
            const { name, qty, price, mode } = req.body;

            // Validation
            if (!name || !qty || !price || !mode) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                });
            }
            
            // Save order
            let newOrder = new OrdersModel({
                name: name,
                qty: parseInt(qty),
                price: parseFloat(price),
                mode: mode,
            });
            await newOrder.save();
            console.log("✅ Order saved to DB");

            // Update Holdings for BUY
            if (mode === "BUY") {
                const existingHolding = await HoldingsModel.findOne({ name: name });
                
                if (existingHolding) {
                    const newQty = existingHolding.qty + parseInt(qty);
                    const totalCost = (existingHolding.avg * existingHolding.qty) + (parseFloat(price) * parseInt(qty));
                    const newAvg = totalCost / newQty;
                    
                    await HoldingsModel.updateOne(
                        { name: name },
                        { 
                            qty: newQty,
                            avg: newAvg,
                            price: parseFloat(price)
                        }
                    );
                    console.log(`✅ Updated holding: ${name}`);
                } else {
                    const newHolding = new HoldingsModel({
                        name: name,
                        qty: parseInt(qty),
                        avg: parseFloat(price),
                        price: parseFloat(price),
                        net: "+0.00%",
                        day: "+0.00%",
                        isLoss: false
                    });
                    await newHolding.save();
                    console.log(`✅ Created new holding: ${name}`);
                }
            } 
            // Update Holdings for SELL
            else if (mode === "SELL") {
                const existingHolding = await HoldingsModel.findOne({ name: name });
                
                if (!existingHolding) {
                    return res.status(400).json({
                        success: false,
                        message: "You don't own this stock"
                    });
                }

                if (existingHolding.qty < parseInt(qty)) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient quantity. You only have ${existingHolding.qty} shares`
                    });
                }
                
                const newQty = existingHolding.qty - parseInt(qty);
                
                if (newQty <= 0) {
                    await HoldingsModel.deleteOne({ name: name });
                    console.log(`✅ Deleted holding: ${name} (sold all)`);
                } else {
                    await HoldingsModel.updateOne(
                        { name: name },
                        { 
                            qty: newQty,
                            price: parseFloat(price)
                        }
                    );
                    console.log(`✅ Updated holding after sell: ${name}`);
                }
            }

            res.json({ 
                success: true, 
                message: "Order placed successfully",
                order: newOrder
            });
            
        } catch (error) {
            console.error("❌ Error in newOrder:", error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    });

    // All Orders
    app.get("/allOrders", async(req, res) => {
        try {
            let allOrders = await OrdersModel.find({}).sort({ _id: -1 });
            console.log("✅ Sent orders:", allOrders.length);
            res.json(allOrders);
        } catch (error) {
            console.error("❌ Orders error:", error);
            res.status(500).json({ error: error.message });
        }
    });

    // ⭐ DELETE ORDER - Fixed route
    app.delete("/orders/:id", async(req, res) => {
        try {
            const orderId = req.params.id;
            console.log(`🗑️ Deleting order: ${orderId}`);
            
            const result = await OrdersModel.findByIdAndDelete(orderId);
            
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found"
                });
            }

            console.log("✅ Order deleted successfully");
            res.json({ 
                success: true, 
                message: "Order cancelled successfully" 
            });
        } catch (error) {
            console.error("❌ Delete error:", error);
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    });

    // Live update routes
    app.use('/live', liveUpdateRoutes);

    console.log("✅ All routes setup complete (auth disabled for testing)");
}

function startAutoUpdate() {
    setInterval(async () => {
        try {
            console.log('\n⏰ Auto-update started...');
            await axios.post('http://localhost:3002/live/updatePrices');
            console.log('✅ Auto-update completed\n');
        } catch (error) {
            console.error('❌ Auto-update failed:', error.message);
        }
    }, 300000); // 5 minutes
    
    console.log("✅ Auto-update timer started (every 5 minutes)");
}

// Global error handler
app.use((err, req, res, next) => {
    console.error("❌ Global error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message
    });
});