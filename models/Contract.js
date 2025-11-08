const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  blockchainId: { type: Number, required: true, unique: true },
  txHash: { type: String, required: true },
  
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  dueDay: { type: Number, required: true },

  landlord: { type: String, required: true, lowercase: true },
  tenant: { type: String, required: true, lowercase: true },
  rentAmount: { type: String, required: true },
  propertyDescription: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['pending', 'active', 'finished', 'cancelled'], 
    default: 'pending' 
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Contract', ContractSchema);