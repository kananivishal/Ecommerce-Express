const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Product } = require("../model/Product")
const { User } = require('../model/User')


// Show all products
const product = async (req, res) => {
    try {
        const products = await Product.find({})
        return res.status(200).json({
            message: "All Product",
            products: products
        })
    } catch (error) {
        // console.log(error)
        res.status(400).json({
            message: "Internal Server Error"
        })
    }
}

// Add product
const addproduct = async (req, res) => {
    try {
        let { name, price, image, description, brand, stock } = req.body
        let { token } = req.headers
        let decodedToken = jwt.verify(token, "supersecret")
        let user = await User.findOne({ email: decodedToken.email })

        if (!name || !price || !image || !description || !brand || !stock || !user) {
            res.status(400).json({
                message: "Some fields are missing"
            })
        }


        const product = await Product.create({
            name,
            price,
            image,
            description,
            brand,
            stock,
            user: user._id
        })
        return res.status(200).json({
            message: "Product Created Successfully",
            product: product
        })

    } catch (error) {
        // console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Show single product
const singleproduct = async (req, res) => {
    try {
        let { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id not found"
            })
        }
        let { token } = req.headers
        const decodedToken = jwt.verify(token, "supersecret")
        const user = await User.findOne({ email: decodedToken.email })
        if (user) {
            const product = await Product.findById(id)
            if (!product) {
                res.status(400).json({
                    message: "Product not found"
                })
            }
            return res.status(200).json({
                message: "Product found successfully",
                product: product
            })
        }
    } catch (error) {
        // console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Update product
const updateproduct = async (req, res) => {
    try {
        let { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id not found"
            })
        }
        let { token } = req.headers
        const decodedToken = jwt.verify(token, 'supersecret')
        const user = await User.findOne({ email: decodedToken.email })
        if(user){
            const product = await Product.findById(id)
            if(!product){
                res.status(400).json({
                    message:"Product not found"
                })
            }
            const updatData = req.body
            const updatedProduct =  await Product.findByIdAndUpdate(id, updatData, {
                new:true
            })
            return res.status(200).json({
                message:"Product updated successfully",
                product:updatedProduct
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

// Delete product
const deleteproduct = async (req, res) => {
    try {
        let { id } = req.params
        if (!id) {
            return res.status(400).json({
                message: "Id not found"
            })
        }
        let { token } = req.headers
        const decodedToken = jwt.verify(token, 'supersecret')
        const user = await User.findOne({ email: decodedToken.email })
        if (user) {
            const product = await Product.findById(id)
            if (!product) {
                res.status(400).json({
                    message: "Product not found"
                })
            }
            await Product.deleteOne({
                _id: id
            })
            return res.status(200).json({
                message: "Product deleted successfully"
            })

        }

    } catch (error) {
        // console.log(error)
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

module.exports = { product, addproduct, singleproduct, updateproduct, deleteproduct }