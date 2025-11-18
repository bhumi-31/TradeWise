// backend/schemas/OrdersSchema.js
const { Schema } = require('mongoose');

const OrdersSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true  // For faster queries
    },
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
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