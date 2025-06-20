const mongoose = require('mongoose');

function connectedDB() {
    mongoose.connect('mongodb://127.0.0.1:27017/test')
        .then(() => {
            console.log("DB is Conected")
        }).catch(() => {
            console.log("DB not Conected")
        })
}

module.exports = connectedDB
