const hre = require('hardhat')
const fs = require('fs')
const path = require('path')
const { error } = require('console')

async function main() {
    const Rent = await hre.ethers.getContractFactory('Rent')
    const rent = await Rent.deploy()

    await rent.waitForDeployment()

    const address = await rent.getAddress();
    console.log(`Contrato implantado em ${address}`)

    //salva o contrato em abi pro front consultar
    const contractData = {
        address,
        abi: JSON.parse(rent.interface.formatJson())
    }

    const outputPath = path.join(__dirname, '..', 'abi', 'Rent.json')
    fs.mkdirSync(path.dirname(outputPath), {recursive: true})
    fs.writeFileSync(outputPath, JSON.stringify(contractData, null, 2))

    console.log('abi salvo com sucesso na pasta abi')
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
