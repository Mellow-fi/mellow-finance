import hre from "hardhat";

async function main() {

    
    function logContractDeployed(contractName: string, contract: any) {
        console.log(`${contractName} deployed to: ${contract.target}`);
    }


    // Deploy Loan Manager
    const Loan = await hre.ethers.getContractFactory("LoanManager");
    const loan = await Loan.deploy("0x874069fa1eb16d44d622f2e0ca25eea172369bc1", "0x67986d4bca78DdCCE9Eb77C5c6171b38c89e915b", {});
    await loan.waitForDeployment();
    logContractDeployed("LoanManager", loan);

}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });