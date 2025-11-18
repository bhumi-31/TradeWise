// backend/schemas/PositionsSchema.js
const { Schema } = require("mongoose");

const PositionsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true  // For faster queries
    },
    product: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    avg: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    net: {
        type: String,
        default: "0.00%"
    },
    day: {
        type: String,
        default: "0.00%"
    },
    isLoss: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = { PositionsSchema };