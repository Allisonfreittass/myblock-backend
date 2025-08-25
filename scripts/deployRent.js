
async function main() {
  const RentContractFactory = await hre.ethers.getContractFactory("Rent");

  console.log("Fazendo deploy do contrato Rent...");
  const rentContract = await RentContractFactory.deploy();

  await rentContract.waitForDeployment();

  console.log(`✅ Contrato Rent deployado em: ${rentContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});