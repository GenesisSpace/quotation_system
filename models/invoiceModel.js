const mongoose = require("mongoose");


const invoiceSchema = mongoose.Schema(
    {
        invoiceNumber: {
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
        customerTin: {
            type: String,
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
        status: {
            type: String,
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

const Invoices = mongoose.model("invoices", invoiceSchema);

module.exports = Invoices;