import hre from "hardhat";

async function main() {
    // Deploy oracles
    const oracles = await hre.ethers.getContractFactory("MellowFiPriceOracle");
    const oracle = await oracles.deploy("0xC0f1567a0037383068B1b269A81B07e76f99710c","0x7bcB65B53D5a7FfD2119449B8CbC370c9058fd52");
    await oracle.waitForDeployment();
    console.log(`Oracles deployed to: ${oracle.target}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });