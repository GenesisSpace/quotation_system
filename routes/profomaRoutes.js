const express = require('express')
const { getProfomaController, addProfomaController } = require('../controllers/profomaController');

const router = express.Router()

//Routes
//Method - get
router.get('/get-profoma', getProfomaController);

//METHOD-Post
router.post('/add-profoma', addProfomaController);

module.exports = router