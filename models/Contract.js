const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  blockchainId: { type: Number, required: true },
  txHash: { type: String, required: true },
  locador: { type: String, required: true },
  locatario: { type: String, required: true },
  valor: { type: String, required: true },
  imovel: { type: String },
  status: { type: String, enum: ['pendente', 'ativo', 'finalizado', 'cancelado'], default: 'pendente' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Contract', ContractSchema);
