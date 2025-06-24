const express = require('express')
const router = express.Router()
const userRoute = require('./user')
const productRouter = require('./product')

router.use('/user',userRoute)

router.use('/product',productRouter)

module.exports = router