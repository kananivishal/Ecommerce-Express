const express = require('express')
const router = express.Router()
const userRoute = require('./user')
const productRouter = require('./product')
const cartRouter = require('./cart')

router.use('/user',userRoute)

router.use('/product',productRouter)

router.use('/cart',cartRouter)

module.exports = router