const express = require("express")
const app = express()
const PORT = 8080
const connectedDB = require('./DB/connectDB')
const cors =require('cors')
const morgan = require('morgan')
const routes = require('./routes/index')

connectedDB()

// middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//routes
app.use(routes)

// Server Created
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})