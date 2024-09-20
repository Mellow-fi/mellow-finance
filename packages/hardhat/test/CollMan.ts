import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";

describe("CollMan", function () {
    async function deployFixture() {
        const [owner, celo_user, usdt_user] = await ethers.getSigners();
        const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
        const mockUSDT = await MockUSDT.deploy();
        await mockUSDT.waitForDeployment();
        const mockAddress = mockUSDT.getAddress();
        const Coll = await hre.ethers.getContractFactory("CollateralManager");
        const coll = await Coll.deploy(mockAddress);

        return { owner, celo_user, usdt_user, mockUSDT, coll };
    }

    it("Approve Collateral Manager to spend USDT", async function () {
        const { owner, celo_user, usdt_user, mockUSDT, coll } = await loadFixture(deployFixture);
        await mockUSDT.approve(coll.target, 1000000);
        expect(await mockUSDT.allowance(owner.address, coll.target)).to.equal(1000000);
    });

    it("Should revert if Collateral Manager is not approved to spend USDT", async function () {
        const { owner, celo_user, usdt_user, mockUSDT, coll } = await loadFixture(deployFixture);
        await expect(coll.depositUsdtCollateral(1000)).to.be.revertedWith("USDT: transfer amount exceeds allowance");
    });
});