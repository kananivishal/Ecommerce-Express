const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { addtocart, cart, updatecart } = require('../controllers/cart.controller')

// route to get cart
router.get('/allCart', cart)

// route add to cart
router.post('/addCart', addtocart)

// route update cart
router.put('/updateCart', updatecart)


module.exports = router