const jwt = require('jsonwebtoken')
const { Cart } = require('../model/Cart')
const { User } = require('../model/User')
const { Product } = require('../model/Product')

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

// Add to cart
// const addtocart = async (req, res) => {
//     try {
//         let {productid, quantity } = req.body
//         if (!quantity) {
//             quantity = 1
//         }
//         // let { productid } = req.params
//         const { token } = req.headers
//         const decodedToken = jwt.verify(token, 'supersecret')
//         const user = await User.findOne({ email: decodedToken.email })

//         if (user) {
//             const product = await Product.findById(productid)
//             if (!product) {
//                 return res.status(400).json({
//                     message: "Product not found"
//                 })
//             }
//             const cart = await Cart.findOne({ user: user._id })
//             if (!cart) {
//                 const cart = new Cart({
//                     user: user._id,
//                     products: [],
//                     total: 0
//                 })
//                 await cart.save()
//                 user.cart_id = cart._id
//                 await user.save()
//             }
//             const exists = cart.products.some((p) => { p.product.toString() === productid.toString() })
//             if (exists) {
//                 return res.status(409).json({
//                     message: "GO to cart"
//                 })
//             }
//             cart.products.push({ product: productid, quantity })
//             cart.total += product.price * quantity
//             await cart.save()
//             return res.status(200).json({
//                 message: "Product Add Successfully"
//             })

//         }
//         // return res.status(200).json({
//         //     message: "Product Allready in cart"
//         // })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: "Internal server error"
//         })
//     }
// }
const addtocart = async (req, res) => {
    try {

        let { token } = req.headers
        let { productID, quantity } = req.body
        let decodedToken = jwt.verify(token, "supersecret")
        let user = await User.findOne({ email: decodedToken.email })

        if (!productID || !quantity) {
            res.status(400).json({ message: "Product or Quantity is missing!!" })
        }

        if (user) {

            let product = await Product.findById(productID)
            const cart = await Cart.findOne({ _id: user.cart_id })

            if (cart) {
                const exits = cart.products.some((p) => {
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

            return res.status(200).json({
                message: "Product added to cart"
            })

        }

        if (!user) {
            res.status(400).json({ message: "user not found" })
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}


module.exports = { cart, addtocart }
