import hre from "hardhat";

async function main() {

    
    function logContractDeployed(contractName: string, contract: any) {
        console.log(`${contractName} deployed to: ${contract.target}`);
    }

    // Deployer account
    const [deployer] = await hre.ethers.getSigners();

    // Deploy MellowFiPriceOracle
    const oracles = await hre.ethers.getContractFactory("MellowFiPriceOracle");
    const oracle = await oracles.deploy("0xC0f1567a0037383068B1b269A81B07e76f99710c","0x7bcB65B53D5a7FfD2119449B8CbC370c9058fd52");
    await oracle.waitForDeployment();
    console.log(`Oracles deployed to: ${oracle.target}`);

    // Deploy MockCollateral Token
    // const MockCollateral = await hre.ethers.getContractFactory("mellowfiCollatal");
    // const mockCollateral = await MockCollateral.deploy();
    // await mockCollateral.waitForDeployment();
    // logContractDeployed("mellowfiCollateral Token", mockCollateral);

    // Deploy Collateral Manager
    const Coll = await hre.ethers.getContractFactory("CollateralManager");
    const coll = await Coll.deploy("0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f", oracle.target, {});
    await coll.waitForDeployment();
    logContractDeployed("CollateralManager", coll);

    // Deploy MockPaymentToken
    const MockPayment = await hre.ethers.getContractFactory("MellowfiPayout");
    const mockPayment = await MockPayment.deploy();
    await mockPayment.waitForDeployment();
    logContractDeployed("MellowfiPayout Token", mockPayment);

    // Deploy Loan Manager
    const Loan = await hre.ethers.getContractFactory("LoanManager");
    const loan = await Loan.deploy(coll.target, mockPayment.target, oracle.target, {});
    await loan.waitForDeployment();
    logContractDeployed("LoanManager", loan);

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });