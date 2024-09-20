import hre from "hardhat";

async function main() {
    const [deployer, addr1] = await hre.ethers.getSigners();
    const udstAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const CollManAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const MockUSDT = await hre.ethers.getContractAt("MockUSDT", udstAddress);
    const CollMan = await hre.ethers.getContractAt("CollateralManager", CollManAddress);

    // pre-convert amounts to wei
    const mintAmount: bigint = hre.ethers.parseUnits("1000",18);
    const approveAmount: bigint = hre.ethers.parseUnits("500",18);
    const depositCeloAmount: bigint = hre.ethers.parseEther("1.0");

    // mint USDT for addr1
    const mintTx = await MockUSDT.connect(deployer).transfer(addr1.address, mintAmount);
    await mintTx.wait();
    console.log(`Minted ${mintAmount} USDT for ${addr1.address}`);
    
    // addr1 deposits 1 Celo
    const depositCeloTx = await CollMan.connect(addr1).depositCeloCollateral({
        value: depositCeloAmount, // 1 CELO
      });
    await depositCeloTx.wait();
    console.log(`Deposited ${depositCeloAmount} CELO for ${addr1.address}`);

    // approve the collateral manager to spend USDT
    const approveTx = await MockUSDT.connect(addr1).approve(CollManAddress, approveAmount);
    await approveTx.wait();
    console.log(`Approved collateral manager to spend ${approveAmount} USDT for ${addr1.address}`);

    // addr1 deposits 500 USDT
    const depositTx = await CollMan.connect(addr1).depositUsdtCollateral(approveAmount);
    await depositTx.wait();
    console.log(`Deposited ${approveAmount} USDT for ${addr1.address}`);

    // Withdraw 0.5 CELO from collateral
    const withdrawCeloTx = await CollMan.connect(addr1).withdrawCeloCollateral(hre.ethers.parseEther("0.5"));
    await withdrawCeloTx.wait();
    console.log(`Withdrew 0.5 CELO from collateral for ${addr1.address}`);

    // Withdraw 250 USDT from collateral
    const withdrawTx = await CollMan.connect(addr1).withdrawUsdtCollateral(hre.ethers.parseUnits("250",18));
    await withdrawTx.wait();
    console.log(`Withdrew 250 USDT from collateral for ${addr1.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
