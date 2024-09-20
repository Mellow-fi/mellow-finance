import hre from "hardhat";

async function main() {
  // Deploy MockUSDT
    const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
    const mockUSDT = await MockUSDT.deploy();
    // await mockUSDT.deployed();
    await mockUSDT.waitForDeployment();
    const mockAddress = mockUSDT.getAddress();
    console.log(`contract deployed to ${mockUSDT.target}`);
  
  
    const Coll = await hre.ethers.getContractFactory("CollateralManager");
    const coll = await Coll.deploy(mockAddress);
    // await coll.deployed();
    await mockUSDT.waitForDeployment();
    console.log(`Coll deployed to:", ${coll.target}`);

    // approve the collateral manager to spend USDT
    await mockUSDT.approve(coll.target, 1000000);
    console.log("Approved collateral manager to spend USDT");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });