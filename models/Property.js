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
    imageUrl: {
        type: String, 
        required: true 
    },
    rentAmount: {
        type: String, 
        required: true 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    status: { 
        type: String, 
        enum: ['available', 'rented'],
        default: 'available' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);