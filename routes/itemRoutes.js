const express = require('express')
const { getItemController,
    addItemController,
    editItemController,
    deleteItemController, } = require('./../controllers/itemController');

const router = express.Router()

//Routes
//Method - get
router.get('/get-items', getItemController);

//METHOD-Post
router.post('/add-items', addItemController);

//METHOD-Put
router.put('/edit-items', editItemController);

//METHOD-Delete
router.delete('/delete-items', deleteItemController);

module.exports = router