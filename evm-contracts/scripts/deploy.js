const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Deployer balance:", ethers.formatEther(balance), "KLAY");

    const Token = await ethers.getContractFactory("KIP7");
    const name = "Tether USD";
    const symbol = "USDT";

    console.log(`Deploying KIP7 token with name: ${name}, symbol: ${symbol}`);
    const token = await Token.deploy(name, symbol); // ✅ Removed initialSupply

    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log(`✅ KIP7 Token (USDT) deployed at: ${tokenAddress}`);

    console.log("⚠️ No initial supply minted. You need to call _mint in the contract manually or create a function for it.");
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
