const express = require('express')
const router = express.Router()
const { product, addproduct, singleproduct, updateproduct, deleteproduct } = require('../controllers/product.controller')

// Task:1 see all the product
router.get('/products', product)

// Task:2 Add product
router.post("/addproduct", addproduct)

// Task:3 Single product show
router.get('/product/:id', singleproduct)

// Task:4 Update product
router.patch('/updateproduct/:id', updateproduct)

// Task:5 Delete product
router.delete('/deleteproduct/:id', deleteproduct)

module.exports = router