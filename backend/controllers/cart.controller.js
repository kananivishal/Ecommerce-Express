const jwt = require('jsonwebtoken')
const { Cart } = require('../model/Cart')
const { User } = require('../model/User')
const { Product } = require('../model/User')

const cart = async (req, res) => {
    try {
        const { token } = req.headers
        const decodedToken = jwt.verify(token, 'supersecret')
        const user = await User.findOne({ email: decodedToken.email }).populate({
            path: 'cart',
            populate: {
                path: 'products',
                model: 'Product'
            }
        })
        if (!user) {
            res.status(400).json({
                message: "user not found"
            })
        }

        res.status(200).json({
            message: "Cart creadted successfully",
            cart: user.cart
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = { cart }