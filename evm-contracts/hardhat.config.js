require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const OPERATOR_KEY = process.env.OPERATOR_KEY;

module.exports = {
  solidity: "0.8.27",
  networks: {
    kairos: {
      url: "https://public-en-kairos.node.kaia.io", // Kaia Kairos RPC endpoint
      chainId: 1001, // Kaia Kairos chain ID
      accounts: [OPERATOR_KEY], // Your ECDSA private key
    },
  },
};
