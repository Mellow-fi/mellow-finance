import hre from "hardhat";

async function main() {
  // Deploy MockUSDT
  //  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  //  const mockUSDT = await MockUSDT.deploy();
    // await mockUSDT.deployed();
  //  await mockUSDT.waitForDeployment();
  //  const mockAddress = mockUSDT.getAddress();
  //  console.log(`contract deployed to ${mockUSDT.target}`);
  
  
  // Deploy Collateral Manager
    const Coll = await hre.ethers.getContractFactory("CollateralManager");
    const coll = await Coll.deploy("0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f"); // cEUR contract address
    // await coll.deployed();
   await coll.waitForDeployment();
    console.log(`Collateral Manager deployed to:" ${coll.target}`);

    // Deploy LoanManager
  const LoanManager = await hre.ethers.getContractFactory("LoanManager");
  const loanManager = await LoanManager.deploy("0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f", coll.target, "");
  await loanManager.waitForDeployment();
  const loanManagerAddress = await loanManager.getAddress();
  console.log(`LoanManager deployed to: ${loanManagerAddress}`);

    // approve the collateral manager to spend USDT
    //await mockUSDT.approve(coll.target, 1000000);
    //console.log("Approved collateral manager to spend USDT");

    console.log("Deployment complete.");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
