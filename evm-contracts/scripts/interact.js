require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
    const [deployer, user] = await ethers.getSigners();

    const tokenAddress = "0xBCF9Ac4d772E6a0dFA5b8795c643eB6a8D2a4C25"; // Replace with deployed token address
    const Token = await ethers.getContractFactory("KIP7");
    const token = Token.attach(tokenAddress);

    // 1. Check deployer's balance
    const deployerBalance = await token.balanceOf(deployer.address);
    console.log("Deployer USDT balance:", ethers.formatUnits(deployerBalance, 18));

    // 2. Transfer 100 USDT to user
    const transferAmount = ethers.parseUnits("100", 18);
    const tx = await token.transfer(user.address, transferAmount);
    await tx.wait();
    console.log(`✅ Transferred 100 USDT to ${user.address}`);

    // 3. Approve dApp contract to spend 50 USDT
    const dappContractAddress = "0x6132B4447D01CD79B5a9D65d7A37Aabcfc8EFC1d"; // Replace with your contract
    const approveTx = await token.approve(dappContractAddress, ethers.parseUnits("50", 18));
    await approveTx.wait();
    console.log(`✅ Approved 50 USDT for dApp contract`);

    // 4. Check user's balance
    const userBalance = await token.balanceOf(user.address);
    console.log("User USDT balance:", ethers.formatUnits(userBalance, 18));
}

main()
    .then(() => process.exit(0))
    .catch(console.error);
