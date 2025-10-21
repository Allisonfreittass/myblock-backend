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
    address: {
        zipCode: { 
            type: String, 
            default: '' 
        },
        street: { 
            type: String, 
            default: '' 
        },
        number: { 
            type: String, 
            default: '' 
        },
        neighborhood: { 
            type: String, 
            default: '' 
        },
        city: { 
            type: String, 
            default: ''
        },
        state: { 
            type: String, 
            default: '' 
        },
    },
    geoLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
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

userSchema.index({ geoLocation: '2dsphere' });

module.exports = mongoose.model('User', userSchema);