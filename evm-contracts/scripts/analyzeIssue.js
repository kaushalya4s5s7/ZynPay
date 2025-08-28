const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Isolating the Issue with SimplePayment");
  console.log("=========================================");

  try {
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer:", deployer.address);
    
    // Test the deployed SimplePayment contract
    const simplePaymentAddress = "0xC1104163A216fd644E070f0D4D8B85DF8D23B27E";
    const SimplePayment = await ethers.getContractFactory("SimplePayment");
    const contract = SimplePayment.attach(simplePaymentAddress);
    
    console.log("📋 Testing SimplePayment at:", simplePaymentAddress);
    
    // Test 1: View functions work
    console.log("\n📊 Testing view functions...");
    try {
      const balance = await contract.getBalance();
      const stats = await contract.getStats();
      console.log("✅ View functions work!");
      console.log("💰 Balance:", ethers.formatEther(balance), "KAIA");
      console.log("📊 Stats:", stats[0].toString(), "payments,", ethers.formatEther(stats[1]), "KAIA volume");
    } catch (viewError) {
      console.error("❌ View functions failed:", viewError.message);
    }
    
    // Test 2: Try just the receive function (send ETH directly)
    console.log("\n💸 Testing receive function...");
    try {
      const testAmount = ethers.parseUnits("0.00000001", 18); // 1 tinybar
      
      const directTx = await deployer.sendTransaction({
        to: simplePaymentAddress,
        value: testAmount,
        gasLimit: 100000
      });
      
      await directTx.wait();
      console.log("✅ Receive function works!");
      
      const newBalance = await contract.getBalance();
      console.log("💰 New balance:", ethers.formatEther(newBalance), "KAIA");
      
    } catch (receiveError) {
      console.error("❌ Receive function failed:", receiveError.message);
    }
    
    // Test 3: Try sendPayment function (the complex one)
    console.log("\n💸 Testing sendPayment function...");
    try {
      const testAmount = ethers.parseUnits("0.00000001", 18); // 1 tinybar
      const recipient = "0x1234567890123456789012345678901234567890"; // dummy address
      
      // First try to estimate gas
      try {
        const gasEstimate = await contract.sendPayment.estimateGas(recipient, {
          value: testAmount
        });
        console.log("⛽ Gas estimate:", gasEstimate.toString());
      } catch (gasError) {
        console.error("⛽ Gas estimation failed:", gasError.reason || gasError.message);
        
        // Try to understand what's failing
        try {
          await contract.sendPayment.staticCall(recipient, {
            value: testAmount
          });
          console.log("✅ Static call succeeded");
        } catch (staticError) {
          console.error("❌ Static call failed:", staticError.reason || staticError.message);
          
          // Let's check what specific issue
          if (staticError.message.includes("InsufficientPayment")) {
            console.log("💡 Issue: Payment amount too small");
          } else if (staticError.message.includes("InvalidRecipient")) {
            console.log("💡 Issue: Invalid recipient address");
          } else if (staticError.message.includes("TransferFailed")) {
            console.log("💡 Issue: Transfer to recipient failed");
          } else {
            console.log("💡 Unknown issue with sendPayment");
          }
        }
      }
      
    } catch (sendError) {
      console.error("❌ SendPayment failed:", sendError.message);
    }
    
    // Test 4: Compare with working minimal contract
    console.log("\n🔄 Testing minimal contract for comparison...");
    const minimalAddress = "0x5d655eF637E0A544360af041aC33a96dB87C2f20";
    const MinimalPayment = await ethers.getContractFactory("MinimalPayment");
    const minimalContract = MinimalPayment.attach(minimalAddress);
    
    try {
      const testAmount = ethers.parseUnits("0.00000001", 18);
      
      const tx = await minimalContract.pay({
        value: testAmount,
        gasLimit: 100000
      });
      
      await tx.wait();
      console.log("✅ Minimal contract still works!");
      
      const minBalance = await minimalContract.getBalance();
      console.log("💰 Minimal balance:", ethers.formatEther(minBalance), "KAIA");
      
    } catch (minError) {
      console.error("❌ Minimal contract now fails too:", minError.message);
    }
    
    console.log("\n📋 ANALYSIS SUMMARY");
    console.log("==================");
    console.log("The issue seems to be with complex contract features:");
    console.log("• MinimalPayment: Works perfectly ✅");
    console.log("• SimplePayment: Has issues with function calls ❌");
    console.log("");
    console.log("Likely culprits:");
    console.log("1. ReentrancyGuard modifier");
    console.log("2. Ownable inheritance");
    console.log("3. External .call() to recipients");
    console.log("4. Custom error handling");
    
  } catch (error) {
    console.error("💥 Error:", error.message);
  }
}

main()
  .then(() => {
    console.log("\n🔍 Analysis complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Failed:", error);
    process.exit(1);
  });
