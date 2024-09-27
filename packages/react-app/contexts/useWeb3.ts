import { BrowserProvider, Contract, parseUnits } from "ethers";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import StableTokenABI from "./cusd-abi.json";
import CollateralManagerABI from "./CollateralManager.json";
import LoanManagerABI from "./LoanManager.json"
import { Address } from "viem";

export const useWeb3 = () => {
  const { address } = useAccount();
  const COLLATERAL_MANAGER_CONTRACT = "0x514633B5944537B7496A5Ed6e3cD009ffDE091f5";
  const cUER_CONTRACT_ADDRESS = "0x10c892a6ec43a53e45d0b916b4b7d383b1b78c0f";
  const LOAN_MANAGER_CONTRACT = "0xce06e1EF981987B683e548b006A54df1d332b3Ce";
  const cKES_MOCK_TOCKEN = "0x874069fa1eb16d44d622f2e0ca25eea172369bc1";

  

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

  const executeReadOnly = async ({ contractAddress, abi, method, args }: ExecuteTransactionParams): Promise<any> => {
    const signer = await getSigner();
    const contract = new Contract(contractAddress, abi, signer);
    const result = await contract[method](...args);  // Call the read-only method
    return result;  // Return the result directly
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

  const getMaxLoanAmount = async () => {
    return await executeReadOnly({ contractAddress: LOAN_MANAGER_CONTRACT, abi: LoanManagerABI.abi, method: "getMaxLoanAmount", args: [] });
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
    getMaxLoanAmount,
  };
};
