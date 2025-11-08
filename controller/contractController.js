const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const Contract = require("../models/Contract");

const contratoPath = path.join(__dirname, "../abi/Rent.json");
const contratoJson = JSON.parse(fs.readFileSync(contratoPath, "utf-8"));
const contratoAddress = contratoJson.address;
const contratoAbi = contratoJson.abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contratoInstance = new ethers.Contract(contratoAddress, contratoAbi, signer);

exports.createContract = async (req, res) => {
  try {
    const {
      blockchainId,
      txHash,
      locatario,
      valor,
      imovel,
      dataInicio,
      dataFim,
      diaVencimento,
      propertyId,
      locador
    } = req.body;

    if (!blockchainId || !txHash || !locatario) {
       return res.status(400).json({ error: "Missing blockchain transaction data." });
    }

    const contractSaved = await Contract.create({
      blockchainId,
      txHash,
      propertyId,
      landlord: locador,
      tenant: locatario,
      rentAmount: valor,
      propertyDescription: imovel,
      startDate: dataInicio,
      endDate: dataFim,
      dueDay: diaVencimento,
      status: "active",
    });

    res.status(201).json({
      message: "Contract registered successfully.",
      contract: contractSaved,
    });
  } catch (err) {
    console.error("Error saving contract to DB:", err);
    if (err.code === 11000) {
        return res.status(409).json({ error: "Contract already registered." });
    }
    res.status(500).json({ error: "Failed to register contract." });
  }
};


exports.listContract = async (req, res) => {
  try {
    const contracts = await Contract.find().sort({ createdAt: -1 });
    res.json(contracts);
  } catch (err) {
    console.error('Erro ao listar contratos:', err);
    res.status(500).json({ error: 'Erro ao buscar contratos.' });
  }
};

exports.cancelContract = async (req, res) => {
  const { id } = req.params;    // ID do contrato na Blockchain
  const { txHash } = req.body;  // Hash da transação de cancelamento feita no front

  try {
    const updatedContract = await Contract.findOneAndUpdate(
      { blockchainId: id },
      { status: 'cancelado', cancelTxHash: txHash },
      { new: true }
    );

    if (!updatedContract) {
        return res.status(404).json({ error: 'Contrato não encontrado no sistema.' });
    }

    res.json({
      message: `Status do contrato ${id} atualizado para cancelado.`,
      contract: updatedContract
    });
  } catch (err) {
    console.error("Erro ao atualizar cancelamento:", err);
    res.status(500).json({ error: 'Falha ao atualizar status do contrato.' });
  }
};
