const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    walletAddress: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: ''
    },
    zipCode: {
        type: String,
        default: ''
    },
    profilePictureUrl: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('User', userSchema);