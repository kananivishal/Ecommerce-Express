const mongoose = require('mongoose');

function connectedDB() {
    // mongoose.connect(process.env.MONGODB_URL)
    mongoose.connect('mongodb://127.0.0.1:27017/MCA')
    .then(() => {
        console.log("DB is Conected")
    }).catch((error) => {
        console.log(error)
        console.log("DB not Conected")
    })
}

module.exports = connectedDB
