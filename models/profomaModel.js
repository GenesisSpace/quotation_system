const mongoose = require("mongoose");


const profomaSchema = mongoose.Schema(
    {
        profomaNumber: {
            type: String,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },

        customerName: {
            type: String,
            required: true,
        },
        customerNumber: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        subTotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            required: true,
        },
        paymentMode: {
            type: String,
            required: true,
        },
        cartItems: {
            type: Array,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    },
    { timestamp: true }
);

const Profomas = mongoose.model("profomas", profomaSchema);

module.exports = Profomas;