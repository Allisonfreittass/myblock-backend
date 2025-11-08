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
      locatario,
      valor,
      imovel,
      dataInicio,
      dataFim,
      diaVencimento,
      propertyId,
      locador,
    } = req.body;

    if (!locatario || !valor || !imovel || !dataInicio || !dataFim || !diaVencimento)
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });

    const tx = await contratoInstance.createContract(locatario, ethers.parseEther(valor), imovel);
    const receipt = await tx.wait();

    const contractSaved = await Contract.create({
      blockchainId: Number(receipt.logs[0]?.args?.id || 0),
      txHash: receipt.hash,
      propertyId,
      locador,
      locatario,
      valor,
      imovel,
      dataInicio,
      dataFim,
      diaVencimento,
      status: "ativo",
    });

    res.status(201).json({
      message: "Contrato registrado com sucesso.",
      contract: contractSaved,
    });
  } catch (err) {
    console.error("Erro ao criar contrato:", err);
    res.status(500).json({ error: "Erro ao criar contrato na blockchain." });
  }
};


exports.listContract = async (req, res) => {
  try {
    const contracts = await ContractModel.find().sort({ createdAt: -1 });
    res.json(contracts);
  } catch (err) {
    console.error('Erro ao listar contratos:', err);
    res.status(500).json({ error: 'Erro ao buscar contratos.' });
  }
};

exports.cancelContract = async (req, res) => {
  const { id } = req.params;
  try {
    const tx = await contratoInstance.cancelarContrato(id);
    await tx.wait();

    await ContractModel.findOneAndUpdate({ blockchainId: id }, { status: 'cancelado' });

    res.json({
      message: `Contrato ${id} cancelado com sucesso.`,
      txHash: tx.hash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao cancelar contrato' });
  }
};
