const jwt = require('jsonwebtoken')
const { Cart } = require('../model/Cart')
const { User } = require('../model/User')
const { Product } = require('../model/Product')
const { model } = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const sendEmail = require('../utils/userEmatl')

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
            return res.status(200).json({ message: "No Cart Items" })
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

            console.log(user.cart)

            if (user.cart) {

                const cart = await Cart.findOne({ _id: user.cart })

                if (cart) {
                    const exists = cart.products.some((p) => {
                        console.log(p)
                        p.product.toString() === productID.toString()
                    })
                    console.log(exists)

                    if (exists) {
                        return res.status(404).json({ message: "go to cart" })
                    }

                    cart.products.push({ product: productID, quantity })
                    cart.total += product.price * quantity
                    await cart.save()
                }

            } else {
                const newCart = await Cart.create({
                    products: [
                        {
                            product: productID,
                            quantity: quantity
                        }
                    ],
                    total: product.price * quantity
                })
                user.cart = newCart._id
                await user.save()
            }

        }
        else {
            return res.status(404).json({ message: "Error" })
        }


        return res.status(200).json({ message: "Product added successfully" })

        //  else {
        //     return res.status(404).json({ message: "Invalid Credentials" })
        // }

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

const payment = async (req, res) => {
    try {

        const { token } = req.headers
        const decodedToken = jwt.verify(token, 'supersecret')
        const user = await User.findOne({ email: decodedToken.email }).populate({
            path: 'cart',
            populate: {
                path: "products.product",
                model: "Product"
            }
        })
        if (!user || !user.cart || user.cart.products.length === 0) {
            res.status(404).json({ message: "User or cartnot found" })
        }
        // Payment
        const lineItems = user.cart.products.map((item) => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.product.name,
                    },
                    unit_amount: item.product.price * 100
                },
                quantity: item.quantity
            }
        })
        const currentUrl = process.env.CLIENT_URL
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${currentUrl}/success`,
            cancel_url: `${currentUrl}/cancel`
        })

        // send email to user
        await sendEmail(
            user.email,
            user.cart.products.map((item) => ({
                name: item.product.name,
                price: item.product.price
            }))
        )

        // Empty cart
        user.cart.products = []
        user.cart.total = 0
        await user.cart.save()
        await user.save()
        res.status(200).json({ message: "get the payment url", url: session.url })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


module.exports = { cart, addtocart, updatecart, payment }
