const express = require('express')
const { addInvoiceController, getInvoiceController, getTotalInvoicesController
} = require('../controllers/invoiceController');

const router = express.Router()

//Routes
//Method - get
router.get('/get-invoice', getInvoiceController);

//METHOD-Post
router.post('/add-invoice', addInvoiceController);

// Get total number of invoices
router.get('/get-total', getTotalInvoicesController);

// // //METHOD-Put
// router.put('/edit-invoice', editInvoiceController);

// // //METHOD-Delete
// router.delete('/delete-invoice', deleteInvoiceController);

module.exports = router