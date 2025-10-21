const mongoose = require('mongoose');

const rentRequestSchema = new mongoose.Schema({
    property: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property',
        required: true 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    tenant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    tenantWalletAddress: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('RentRequest', rentRequestSchema);