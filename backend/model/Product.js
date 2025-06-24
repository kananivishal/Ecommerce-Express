const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        price: {
            type: Number,
            require: true
        },
        image: {
            type: String
        },
        description: {
            type: String
        },
        brand: {
            type: String
        },
        stock: {
            type: Number
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    }
)

const Product = mongoose.model("Product", productSchema)
module.exports = { Product }