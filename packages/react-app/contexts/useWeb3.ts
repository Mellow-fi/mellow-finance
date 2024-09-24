import { BrowserProvider, Contract, parseUnits } from "ethers";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import StableTokenABI from "./cusd-abi.json";
import CollateralManagerABI from "./CollateralManager.json";

export const useWeb3 = () => {
  const { address } = useAccount();
  const COLLATERAL_MANAGER_CONTRACT = "0xf3978E55d052124178dBd34729dab91cD39dc23D";
  const cUER_CONTRACT_ADDRESS = "0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f";

  

  const getSigner = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      return await provider.getSigner();
    }
    throw new Error("No Ethereum provider found");
  };

  interface ExecuteTransactionParams {
    contractAddress: string;
    abi: any;
    method: string;
    args: any[];
  }

  const executeTransaction = async ({ contractAddress, abi, method, args }: ExecuteTransactionParams): Promise<any> => {
    const signer = await getSigner();
    const contract = new Contract(contractAddress, abi, signer);
    const tx = await contract[method](...args);
    await tx.wait();
    return tx;
  };

  const depositCeloCollateral = async (amount: string) => {
    const amountInWei = parseUnits(amount, 18);
    return await executeTransaction({ contractAddress: COLLATERAL_MANAGER_CONTRACT, abi: CollateralManagerABI.abi, method: "depositCeloCollateral", args: [{ value: amountInWei }] });
  };

  const depositUsdtCollateral = async (amount: string) => {
    const amountInWei = parseUnits(amount, 18);

    // Approve the collateral manager to spend USDT
    await executeTransaction({ contractAddress: cUER_CONTRACT_ADDRESS, abi: StableTokenABI.abi, method: "approve", args: [COLLATERAL_MANAGER_CONTRACT, amountInWei] });

    // Deposit USDT collateral
    return await executeTransaction({ contractAddress: COLLATERAL_MANAGER_CONTRACT, abi: CollateralManagerABI.abi, method: "depositUsdtCollateral", args: [amountInWei] });
  };

  const signTransaction = async () => {
    const signer = await getSigner();
    const res = await signer.signMessage(`Hello from Celo Composer Valora Template!`);
    console.log("res", res);
    return res;
  };

  return {
    address,
    signTransaction,
    depositCeloCollateral,
    depositUsdtCollateral,
  };
};
