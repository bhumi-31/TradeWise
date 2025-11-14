const { Schema } = require('mongoose');

const OrdersSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    price: {
        type: Number,  // Changed from String to Number
        required: true
    },
    mode: {
        type: String,
        required: true,
        enum: ['BUY', 'SELL']
    },
    status: {
        type: String,
        default: "Completed"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt
});

module.exports = { OrdersSchema };