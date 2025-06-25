const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            required: true
        },
        password: {
            type: String,
            trim: true,
            minlength: 6,
            required: true
        },
        
        role: {
            type: String,
            default: 'user'
        },
        token: {
            type: String,
            required: true
        },
        cart:{
            type:mongoose.Schema.ObjectId,
            ref:'Cart'
        }
    }
)

const User = mongoose.model('User',userSchema)

module.exports = { User }