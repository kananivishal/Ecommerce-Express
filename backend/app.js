const express = require("express")
const app = express()
const PORT = 8080
const connectedDB = require('./DB/connectDB')

connectedDB()

// Server Created
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})