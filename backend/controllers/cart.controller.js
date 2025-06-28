const jwt = require('jsonwebtoken')
const { Cart } = require('../model/Cart')
const { User } = require('../model/User')
const { Product } = require('../model/Product')
const { model } = require('mongoose')

const cart = async (req, res) => {
    try {
        const { token } = req.headers
        const decodedToken = jwt.verify(token, 'supersecret')
        const user = await User.findOne({ email: decodedToken.email }).populate({
            path: 'cart',
            populate: {
                path: 'products.product',
                model: 'Product'
            }
        })
        if (!user) {
            res.status(400).json({
                message: "user not found"
            })
        }

        if (!user.cart || user.cart.products.length === 0) {
            return res.status(204).json({ message: "No Cart Items" })
        }

        res.status(200).json({
            message: "Cart Items retrieved successfully",
            cart: user.cart
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Add to cart
const addtocart = async (req, res) => {
    try {

        let { productID, quantity } = req.body
        if (!productID || !quantity) {
            res.status(400).json({ message: "Product or Quantity is missing!!" })
        }
        let { token } = req.headers
        let decodedToken = jwt.verify(token, "supersecret")
        let user = await User.findOne({ email: decodedToken.email })


        if (user) {

            const product = await Product.findById(productID)
            const cart = await Cart.findOne({ _id: user.cart_id })

            if (cart) {
                const exits = cart.products.some(p => {
                    p.product.toString() === productID.toString()
                })

                if (exits) {
                    return res.status(409).json({ message: "go to cart" })
                }

                cart.products.push({ product: productID, quantity })
                cart.total += product.price * quantity
                await cart.save()

            } else {
                const newCart = await Cart.create({
                    products: [
                        {
                            products: productID,
                            quantity: quantity
                        }
                    ],
                    total: product.price * quantity
                })
                user.cart = newCart._id
                await user.save()
            }

            return res.status(200).json({ message: "Product added to cart" })

        } else {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        // if (!user) {
        //     res.status(400).json({ message: "user not found" })
        // }



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

// Update Cart
const updatecart = async (req, res) => {
    try {
        const { productID, action } = req.body
        const { token } = req.headers
        const decodedToken = jwt.verify(token, "supersecret")
        const user = await User.findOne({ email: decodedToken.email }).populate({
            path: "cart",
            populate: {
                path: "products.product",
                model: "Product"
            }
        })
        if (!user || !user.cart) {
            return res.status(400).json({ message: "Cart not found" })
        }
        const cart = user.cart
        const item = cart.products.find(p => p.product._id.toString() === productID)
        if (!item) {
            return res.status(400).json({ message: "Product not found" })
        }
        const price = item.product.price

        // Action logic
        if (action === "increase") {
            item.quantity += 1
            cart.total += price
        } else if (action === "decrease") {
            if (item.quantity > 1) {
                item.quantity -= 1
                cart.total -= price
            } else {
                cart.total -= price
                cart.products = cart.products.filter(p => p.product._id.toString() !== productID)
            }
        } else if (action === "remove") {
            cart.total -= price * item.quantity
            cart.products = cart.products.filter(p => p.product._id.toString() !== productID)
        } else {
            return res.status(400).json({ message: "Invalid action" })
        }
        await cart.save()
        return res.status(200).json({
            message: "Cart updated",
            cart
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Intrnal server error" })
    }
}


module.exports = { cart, addtocart, updatecart }
