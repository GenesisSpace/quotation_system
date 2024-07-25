const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDb = require('./config/config')
const ItemModel = require('./models/itemModel')
const items = require('./utilis/data')
require('colors')

//config
dotenv.config()
connectDb()

//function seeder
const importData = async () => {
    try {
        await ItemModel.deleteMany() // Changed from itemModel to ItemModel
        const itemsData = await ItemModel.insertMany(items) // Changed from itemModel to ItemModel
        console.log('All items added'.bgGreen)
        process.exit()
    } catch (error) {
        console.log(`${error}`.bgRed.inverse)
        process.exit(1)
    }
}

importData();