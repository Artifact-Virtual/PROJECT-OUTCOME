import { useState, useEffect } from 'react';

interface Web3State {
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ContractState {
  marketplaceContract: any;
  nftContract: any;
  escrowContract: any;
  isLoading: boolean;
  error: string | null;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWeb3() {
  const [web3State, setWeb3State] = useState<Web3State>({
    account: null,
    chainId: null,
    isConnected: false,
    isLoading: false,
    error: null,
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      setWeb3State(prev => ({
        ...prev,
        error: 'MetaMask not installed. Please install MetaMask to continue.'
      }));
      return;
    }

    try {
      setWeb3State(prev => ({ ...prev, isLoading: true, error: null }));
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      setWeb3State({
        account: accounts[0],
        chainId: parseInt(chainId, 16),
        isConnected: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setWeb3State(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet'
      }));
    }
  };

  const disconnectWallet = () => {
    setWeb3State({
      account: null,
      chainId: null,
      isConnected: false,
      isLoading: false,
      error: null,
    });
  };

  const switchToBaseNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }], // Base Mainnet
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org'],
            },
          ],
        });
      }
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setWeb3State(prev => ({
              ...prev,
              account: accounts[0],
              isConnected: true
            }));
          }
        });

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWeb3State(prev => ({
            ...prev,
            account: accounts[0]
          }));
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        setWeb3State(prev => ({
          ...prev,
          chainId: parseInt(chainId, 16)
        }));
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    ...web3State,
    connectWallet,
    disconnectWallet,
    switchToBaseNetwork,
  };
}

export function useContracts() {
  const [contractState, setContractState] = useState<ContractState>({
    marketplaceContract: null,
    nftContract: null,
    escrowContract: null,
    isLoading: false,
    error: null,
  });

  const initializeContracts = async (web3Provider: any) => {
    try {
      setContractState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Contract addresses for Base Network (these would be actual deployed contracts)
      const MARKETPLACE_ADDRESS = process.env.VITE_MARKETPLACE_CONTRACT_ADDRESS || '0x...';
      const NFT_ADDRESS = process.env.VITE_NFT_CONTRACT_ADDRESS || '0x...';
      const ESCROW_ADDRESS = process.env.VITE_ESCROW_CONTRACT_ADDRESS || '0x...';

      // ABI definitions (simplified for demonstration)
      const MARKETPLACE_ABI = [
        'function listItem(uint256 tokenId, uint256 price, address nftContract) external',
        'function buyItem(uint256 listingId) external payable',
        'function cancelListing(uint256 listingId) external',
        'function createAuction(uint256 tokenId, uint256 startPrice, uint256 duration) external',
        'function placeBid(uint256 auctionId) external payable',
        'event ItemListed(uint256 indexed listingId, address indexed seller, uint256 tokenId, uint256 price)',
        'event ItemSold(uint256 indexed listingId, address indexed buyer, uint256 price)',
      ];

      const NFT_ABI = [
        'function ownerOf(uint256 tokenId) external view returns (address)',
        'function approve(address to, uint256 tokenId) external',
        'function transferFrom(address from, address to, uint256 tokenId) external',
        'function tokenURI(uint256 tokenId) external view returns (string)',
        'function balanceOf(address owner) external view returns (uint256)',
        'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
        'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
      ];

      const ESCROW_ABI = [
        'function createEscrow(address buyer, address seller, uint256 amount, bytes32 itemHash) external payable returns (uint256)',
        'function completeEscrow(uint256 escrowId) external',
        'function disputeEscrow(uint256 escrowId, string reason) external',
        'function resolveDispute(uint256 escrowId, bool favorBuyer) external',
        'function getEscrow(uint256 escrowId) external view returns (tuple(address buyer, address seller, uint256 amount, uint8 status))',
        'event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount)',
        'event EscrowCompleted(uint256 indexed escrowId)',
        'event EscrowDisputed(uint256 indexed escrowId, string reason)',
      ];

      // Initialize contracts (would use actual web3 provider)
      const mockContract = {
        // Mock contract methods for development
        listItem: async (tokenId: string, price: string) => {
          console.log(`Listing item ${tokenId} for ${price} ETH`);
          return { hash: '0x...' };
        },
        buyItem: async (listingId: string) => {
          console.log(`Buying item listing ${listingId}`);
          return { hash: '0x...' };
        },
        createEscrow: async (buyer: string, seller: string, amount: string) => {
          console.log(`Creating escrow: ${buyer} -> ${seller}, amount: ${amount}`);
          return { hash: '0x...' };
        },
        completeEscrow: async (escrowId: string) => {
          console.log(`Completing escrow ${escrowId}`);
          return { hash: '0x...' };
        },
        transfer: async (to: string, tokenId: string) => {
          console.log(`Transferring token ${tokenId} to ${to}`);
          return { hash: '0x...' };
        },
        approve: async (spender: string, tokenId: string) => {
          console.log(`Approving ${spender} for token ${tokenId}`);
          return { hash: '0x...' };
        },
      };

      setContractState({
        marketplaceContract: mockContract,
        nftContract: mockContract,
        escrowContract: mockContract,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setContractState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to initialize contracts'
      }));
    }
  };

  return {
    ...contractState,
    initializeContracts,
  };
}

// Trading contract interactions
export function useTradingContracts() {
  const { marketplaceContract, nftContract, escrowContract } = useContracts();

  const listItemForSale = async (tokenId: string, priceEth: string) => {
    try {
      // Convert ETH to wei
      const priceWei = (parseFloat(priceEth) * 1e18).toString();
      
      // Approve marketplace to transfer NFT
      await nftContract?.approve(process.env.VITE_MARKETPLACE_CONTRACT_ADDRESS, tokenId);
      
      // List item on marketplace
      const tx = await marketplaceContract?.listItem(tokenId, priceWei, process.env.VITE_NFT_CONTRACT_ADDRESS);
      
      return tx;
    } catch (error) {
      console.error('Failed to list item:', error);
      throw error;
    }
  };

  const buyItem = async (listingId: string, priceWei: string) => {
    try {
      const tx = await marketplaceContract?.buyItem(listingId, { value: priceWei });
      return tx;
    } catch (error) {
      console.error('Failed to buy item:', error);
      throw error;
    }
  };

  const createTradeEscrow = async (buyerId: string, sellerId: string, amountWei: string, itemData: any) => {
    try {
      const tx = await escrowContract?.createEscrow(buyerId, sellerId, amountWei, itemData.hash, { value: amountWei });
      return tx;
    } catch (error) {
      console.error('Failed to create escrow:', error);
      throw error;
    }
  };

  const completeEscrow = async (escrowId: string) => {
    try {
      const tx = await escrowContract?.completeEscrow(escrowId);
      return tx;
    } catch (error) {
      console.error('Failed to complete escrow:', error);
      throw error;
    }
  };

  const disputeEscrow = async (escrowId: string, reason: string) => {
    try {
      const tx = await escrowContract?.disputeEscrow(escrowId, reason);
      return tx;
    } catch (error) {
      console.error('Failed to dispute escrow:', error);
      throw error;
    }
  };

  return {
    listItemForSale,
    buyItem,
    createTradeEscrow,
    completeEscrow,
    disputeEscrow,
  };
}