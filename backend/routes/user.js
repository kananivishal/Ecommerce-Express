const express = require('express')
const { sign } = require('jsonwebtoken')
const { singup, login } = require('../controllers/user.controller')
const router = express.Router()

//singup route
router.post('/register', singup)

//login route
router.post('/login', login)

module.exports = router