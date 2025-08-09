const fs = require('fs')
const path = require('path')
const { ethers } = require('ethers')

const contratoPath = path.join(__dirname, '../abi/Rent.json')
const contratoJson = JSON.parse(fs.readFileSync(contratoPath, 'utf-8'))
const contratoAddress = contratoJson.address
const contratoAbi = contratoJson.abi

// Cria o provider e signer com a chave privada e RPC
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

const contratoInstance = new ethers.Contract(
  contratoAddress,
  contratoAbi,
  signer
)

// Função: criar contrato na blockchain
exports.createContract = async (req, res) => {
  const { locatario, valor, imovel } = req.body

  if (!locatario || !valor || !imovel) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' })
  }

  try {
    const tx = await contratoInstance.createContract(locatario, ethers.parseEther(valor), imovel)
    await tx.wait()

    res.status(201).json({
      message: 'Contrato criado na blockchain com sucesso.',
      transactionHash: tx.hash
    })
  } catch (err) {
    console.error('Erro ao criar contrato:', err)
    res.status(500).json({ error: 'Erro ao criar contrato na blockchain.' })
  }
}

// Função: listar todos os contratos cadastrados (por ID)
exports.listContract = async (req, res) => {
  try {
    const total = await contratoInstance.totalContratos()
    const contratos = []

    for (let i = 1; i <= Number(total); i++) {
      const contrato = await contratoInstance.getContract(i)
      contratos.push({
        id: Number(contrato.id),
        locador: contrato.locador,
        locatario: contrato.locatario,
        valor: contrato.valor.toString(),
        imovel: contrato.imovel,
        createdAt: contrato.createdAt.toString(),
      })
    }


    res.json(contratos)
  } catch (err) {
    console.error('Erro ao listar contratos:', err)
    res.status(500).json({ error: 'Erro ao buscar contratos da blockchain.' })
  }
}