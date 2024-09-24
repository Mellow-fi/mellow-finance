import { BrowserProvider, Contract, parseUnits } from "ethers";
import { useAccount } from "wagmi";
import { useState } from "react";
import StableTokenABI from "./cusd-abi.json";
import ValoraNFTABI from "./valora-nft.json";
import CollateralManagerABI from "./CollateralManager.json";
import LoanManagerABI from "./LoanManager.json";





export const useWeb3 = () => {
  const [address, setAddress] = useState<string | null>(null);
  const cUSDTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";
  const COLLATERAL_MANAGER_CONTRACT = "0xf3978E55d052124178dBd34729dab91cD39dc23D";
  const Loan_contract_address = "0x20dc701Ef6265C7Fb6a81680aB662205Ce5d10D8";
  const cUER_CONTRACT_ADDRESS = "0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f";
  const cusd_CONTRACT_ADDRESS = "0x874069fa1eb16d44d622f2e0ca25eea172369bc1";


  const getUserAddress = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addressFromWallet = await signer.getAddress(); 
      setAddress(addressFromWallet);
    }
  };



  const depositCeloCollateral = async (amount: string) => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const collateralManagerContract = new Contract(
        COLLATERAL_MANAGER_CONTRACT,
        CollateralManagerABI.abi,
        signer
      );
      // const amountInWei = parseUnits(amount, 18);
      const tx = await collateralManagerContract.depositCeloCollateral({
        value: parseUnits(amount, 18), // converting amount to wei
      });
      await tx.wait();
      return tx;
    }
    }

    const depositUsdtCollateral = async (amount: string) => {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const collateralManagerContract = new Contract(
          COLLATERAL_MANAGER_CONTRACT,
          CollateralManagerABI.abi,
          signer
        );
        // const amountInWei = parseUnits(amount, 18);
        const cUSDTokenContract = new Contract(
          cUER_CONTRACT_ADDRESS,
          StableTokenABI.abi,
          signer
        );

        const approveTx = await cUSDTokenContract.approve(COLLATERAL_MANAGER_CONTRACT, parseUnits(amount, 18));

        await approveTx.wait();
        const tx = await collateralManagerContract.depositUsdtCollateral(parseUnits(amount, 18));
        await tx.wait();
        return tx;
      }
  }

  const signTransaction = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const res = await signer.signMessage(
      `Hello from Celo Composer Valora Template!`
    );
    console.log("res", res);
    return res;
  };

  return {
    address,
    getUserAddress,
    signTransaction,
    depositCeloCollateral,
    depositUsdtCollateral,
  };
};
