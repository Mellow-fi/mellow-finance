import hre from "hardhat";

async function main() {

    
    function logContractDeployed(contractName: string, contract: any) {
        console.log(`${contractName} deployed to: ${contract.target}`);
    }

    // Deploy MellowFiPriceOracle
    const oracles = await hre.ethers.getContractFactory("MellowFiPriceOracle");
    const oracle = await oracles.deploy("0xC0f1567a0037383068B1b269A81B07e76f99710c","0x7bcB65B53D5a7FfD2119449B8CbC370c9058fd52");
    await oracle.waitForDeployment();
    console.log(`Oracles deployed to: ${oracle.target}`);

    // Deploy MockCollateral Token
    const MockCollateral = await hre.ethers.getContractFactory("mellowfiCollatal");
    const mockCollateral = await MockCollateral.deploy();
    await mockCollateral.waitForDeployment();
    logContractDeployed("mellowfiCollatal", mockCollateral);

    // Deploy Collateral Manager
    const Coll = await hre.ethers.getContractFactory("CollateralManager");
    const coll = await Coll.deploy(mockCollateral.target, oracle.target); // cEUR contract address
    await coll.waitForDeployment();
    logContractDeployed("CollateralManager", coll);



}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });