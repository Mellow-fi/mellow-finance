import { BrowserProvider, Contract, parseUnits } from "ethers";
import { useState } from "react";
import StableTokenABI from "./cusd-abi.json";
import ValoraNFTABI from "./valora-nft.json";
import CollateralManager from "./abis/CollateralManager.json";
import LoanManager from "./abis/LoanManager.json";

export const useWeb3 = () => {
  const [address, setAddress] = useState<string | null>(null);
  const cUSDTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";
  const VALORA_NFT_CONTRACT = "0xDEd283f8Cc841a53BC2A85AD106b2654E650Cc7f";
  const COLLATERAL_MANAGER = "0x12C017e620320Bee8770Fd95E67ab3f423DeeD3e";
  const LOAN_MANAGER = "0x0bbBBA76b67069da4DA7cd5974Cc138360e62EfC";

  const getUserAddress = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addressFromWallet = await signer.getAddress();
      setAddress(addressFromWallet);
    }
  };

  const sendCUSD = async (to: string, amount: string) => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const cUSDTokenContract = new Contract(
      cUSDTokenAddress,
      StableTokenABI.abi,
      signer
    );
    const amountInWei = parseUnits(amount, 18);
    const tx = await cUSDTokenContract.transfer(to, amountInWei);
    await tx.wait();
    return tx;
  };

  // Function to deposit celo as collateral
  const depositCelloCollateral = async (amount: string) => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const collateralManager = new Contract(
      COLLATERAL_MANAGER,
      CollateralManager.abi,
      signer
    );
    const amountInWei = parseUnits(amount, 18);
    const tx = await collateralManager.depositCeloCollateral(amountInWei);
    await tx.wait();
    return tx;
  };

  const mintValoraNFT = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const valoraNFTContract = new Contract(
      VALORA_NFT_CONTRACT,
      ValoraNFTABI.abi,
      signer
    );
    const userAddress = await signer.getAddress();
    const tx = await valoraNFTContract.safeMint(
      userAddress,
      "https://images.ctfassets.net/19mrfugtt46b/bpsU0fdOwCWTKPNIbBl9t/2ffd1e60b262a7d32a0e7025dfdf307e/Hero.png"
    );
    await tx.wait();
    return tx;
  };

  const getNFTs = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const valoraNFTContract = new Contract(
      VALORA_NFT_CONTRACT,
      ValoraNFTABI.abi,
      signer
    );
    const userAddress = await signer.getAddress();
    const nfts = await valoraNFTContract.getNFTsByAddress(userAddress);
    let tokenURIs = [];
    for (let i = 0; i < nfts.length; i++) {
      const tokenURI = await valoraNFTContract.tokenURI(nfts[i]);
      tokenURIs.push(tokenURI);
    }
    return tokenURIs;
  };

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
    sendCUSD,
    mintValoraNFT,
    getNFTs,
    signTransaction,
    depositCelloCollateral,
  };
};
