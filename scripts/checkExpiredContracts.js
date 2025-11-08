const { ethers } = require('ethers');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const contractPath = path.join(__dirname, '../abi/Rent.json');
const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf-8'));

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(contractJson.address, contractJson.abi, signer);

async function checkExpiredContracts() {
  const total = await contract.totalContratos();

  console.log(`🔍 Verificando ${total.toString()} contratos...`);

  for (let i = 1; i <= Number(total); i++) {
    const c = await contract.getContract(i);

    const expirado = c.status === 0 && Number(c.proximoVencimento) < Math.floor(Date.now() / 1000);
    if (expirado) {
      console.log(`⚠️ Contrato ${i} atrasado — finalizando automaticamente...`);
      const tx = await contract.finalizarContrato(i);
      await tx.wait();
      console.log(`✅ Contrato ${i} finalizado com sucesso!`);
    }
  }
}

checkExpiredContracts()
  .then(() => console.log('✔️ Verificação concluída.'))
  .catch(console.error);
