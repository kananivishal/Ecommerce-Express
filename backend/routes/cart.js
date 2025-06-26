const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { addtocart } = require('../controllers/cart.controller')

// route to get cart
// router.get('/userCart',)

router.post('/addCart', addtocart)


module.exports = router