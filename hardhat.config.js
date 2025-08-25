require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity:    { compilers: [
      { version: "0.8.20" },
      { version: "0.8.28" }
    ]},
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY],
    },
    localhost: { // Rede local para testes rápidos
      url: "http://127.0.0.1:8545",
    }
  },
};