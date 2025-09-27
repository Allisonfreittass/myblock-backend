const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true
    },
    description: {
        type: String, 
        required: true 
    },
    imageUrls: [{
        type: String, 
        required: true 
    }],
    location: {
        cep: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        neighborhood: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    details: {
        PropertyType: {
            type: String,
            required: true,
            enum: ['Apartamento', 'Casa', 'Kitnet', 'Loft']},
        area: {
            type: Number,
            required: true
        },
        bedrooms: {
            type: Number,
            required: true
        },
        bathrooms: {
            type: Number,
            required: true
        },
        garageSpots: {
            type: Number,
            default: 0
        },
        isFurnished: {
            type: Boolean,
            default: false
        }
    },
    rules: {
        petsAllowed: {
            type: Boolean,
            default: false
        },
        minLeaseMonths: {
            type: Number,
            default: 12
        }
    },
    fees: {
        rentAmount: {
            type: String, 
            required: true 
        },
        securityDeposit: {
            type: String,
            required: true
        },
        condoFee: {
            type: Number, 
            default: 0
        }
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    ownerWalletAddress: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['available', 'rented'],
        default: 'available' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);