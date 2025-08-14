import { useState, useCallback } from "react";

interface Web3State {
  isConnected: boolean;
  address?: string;
  chainId?: number;
  isConnecting: boolean;
}

export function useWeb3() {
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    isConnecting: false,
  });

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("No wallet found. Please install MetaMask or another Web3 wallet.");
    }

    setWeb3State(prev => ({ ...prev, isConnecting: true }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      setWeb3State({
        isConnected: true,
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        isConnecting: false,
      });

      return accounts[0];
    } catch (error) {
      setWeb3State(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWeb3State({
      isConnected: false,
      isConnecting: false,
    });
  }, []);

  const switchToBaseNetwork = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("No wallet found");
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2105" }], // Base mainnet
      });
    } catch (switchError: any) {
      // If the chain is not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2105",
              chainName: "Base",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }, []);

  return {
    web3State,
    connectWallet,
    disconnectWallet,
    switchToBaseNetwork,
  };
}
