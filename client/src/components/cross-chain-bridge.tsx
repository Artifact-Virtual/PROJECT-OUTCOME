import { useState, useEffect } from 'react';
import { 
  RealisticWastelandCard,
  RealisticText,
  RealisticButton
} from "@/components/realistic-wasteland";

interface ChainConfig {
  id: string;
  name: string;
  symbol: string;
  rpcUrl: string;
  chainId: number;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  status: 'active' | 'degraded' | 'offline';
  gasPrice: string;
  blockTime: number;
}

interface BridgeTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  asset: string;
  amount: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  hash?: string;
  timestamp: number;
  estimatedTime: number;
  fees: {
    networkFee: string;
    bridgeFee: string;
    total: string;
  };
}

interface SupportedAsset {
  symbol: string;
  name: string;
  decimals: number;
  addresses: {
    [chainId: number]: string;
  };
  icon: string;
  minAmount: string;
  maxAmount: string;
}

const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth-mainnet.alchemyapi.io/v2/demo',
    chainId: 1,
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    status: 'active',
    gasPrice: '25.4 gwei',
    blockTime: 12
  },
  {
    id: 'base',
    name: 'Base',
    symbol: 'ETH',
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
    blockExplorer: 'https://basescan.org',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18
    },
    status: 'active',
    gasPrice: '0.8 gwei',
    blockTime: 2
  }
];

const SUPPORTED_ASSETS: SupportedAsset[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    addresses: {
      1: '0x0000000000000000000000000000000000000000', // Native ETH
      8453: '0x0000000000000000000000000000000000000000' // Native ETH on Base
    },
    icon: '⟠',
    minAmount: '0.001',
    maxAmount: '100'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    addresses: {
      1: '0xA0b86a33E6A58D4a73C92E4c9cD7e1a1B9B5A7E1', // Example USDC on Ethereum
      8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // USDC on Base
    },
    icon: '💵',
    minAmount: '1',
    maxAmount: '100000'
  }
];

interface CrossChainBridgeProps {
  className?: string;
}

export const CrossChainBridge = ({ className = "" }: CrossChainBridgeProps) => {
  const [fromChain, setFromChain] = useState<ChainConfig>(SUPPORTED_CHAINS[0]);
  const [toChain, setToChain] = useState<ChainConfig>(SUPPORTED_CHAINS[1]);
  const [selectedAsset, setSelectedAsset] = useState<SupportedAsset>(SUPPORTED_ASSETS[0]);
  const [amount, setAmount] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [estimatedFees, setEstimatedFees] = useState<{
    networkFee: string;
    bridgeFee: string;
    total: string;
  } | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Simulate wallet connection
  useEffect(() => {
    // In development mode, simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true);
      setWalletAddress('0x742d35Cc6651B24B5F7E1E2A4B2E2F5F5D5D5D5D');
    }, 1000);
  }, []);

  // Calculate fees when amount or chains change
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      const networkFee = fromChain.id === 'ethereum' ? '0.003' : '0.0001';
      const bridgeFee = (parseFloat(amount) * 0.001).toFixed(6); // 0.1% bridge fee
      const total = (parseFloat(networkFee) + parseFloat(bridgeFee)).toFixed(6);
      
      setEstimatedFees({
        networkFee: `${networkFee} ${fromChain.symbol}`,
        bridgeFee: `${bridgeFee} ${selectedAsset.symbol}`,
        total: `${total} ${fromChain.symbol}`
      });
    } else {
      setEstimatedFees(null);
    }
  }, [amount, fromChain, selectedAsset]);

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const isValidAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    const min = parseFloat(selectedAsset.minAmount);
    const max = parseFloat(selectedAsset.maxAmount);
    return numValue >= min && numValue <= max;
  };

  const isValidAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const initiateBridge = async () => {
    if (!isValidAmount(amount) || !isValidAddress(recipientAddress)) {
      return;
    }

    setIsProcessing(true);

    // Simulate bridge transaction
    const newTransaction: BridgeTransaction = {
      id: `bridge_${Date.now()}`,
      fromChain: fromChain.name,
      toChain: toChain.name,
      asset: selectedAsset.symbol,
      amount: amount,
      status: 'pending',
      timestamp: Date.now(),
      estimatedTime: fromChain.id === 'ethereum' ? 900 : 180, // 15 min for ETH, 3 min for Base
      fees: estimatedFees || {
        networkFee: '0.001 ETH',
        bridgeFee: '0.001 USDC',
        total: '0.002 ETH'
      }
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Simulate transaction progression
    setTimeout(() => {
      setTransactions(prev => prev.map(tx => 
        tx.id === newTransaction.id 
          ? { ...tx, status: 'processing', hash: `0x${Math.random().toString(16).substr(2, 64)}` }
          : tx
      ));
    }, 2000);

    setTimeout(() => {
      setTransactions(prev => prev.map(tx => 
        tx.id === newTransaction.id 
          ? { ...tx, status: 'completed' }
          : tx
      ));
      setIsProcessing(false);
      setAmount('');
      setRecipientAddress('');
    }, 8000);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-emerald-400';
      case 'processing': return 'text-amber-400';
      case 'pending': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const getChainStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-emerald-400';
      case 'degraded': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <RealisticWastelandCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <RealisticText variant="title" className="text-neutral-100">
              Cross-Chain Bridge
            </RealisticText>
            <RealisticText variant="caption" className="text-neutral-500">
              Secure multi-chain asset transfers
            </RealisticText>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${walletConnected ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
            <RealisticText variant="caption" className="text-neutral-400">
              {walletConnected ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Wallet Disconnected'}
            </RealisticText>
          </div>
        </div>

        {/* Chain Status */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {SUPPORTED_CHAINS.map((chain) => (
            <div key={chain.id} className="bg-neutral-900 border border-neutral-700 p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-sm text-neutral-100">{chain.name}</div>
                  <div className="text-xs text-neutral-400">Chain ID: {chain.chainId}</div>
                </div>
                <div className={`text-xs font-bold ${getChainStatusColor(chain.status)}`}>
                  {chain.status.toUpperCase()}
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Gas Price:</span>
                  <span className="text-neutral-100">{chain.gasPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Block Time:</span>
                  <span className="text-neutral-100">{chain.blockTime}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bridge Interface */}
        <div className="space-y-4">
          {/* From Chain */}
          <div className="bg-neutral-900 border border-neutral-700 p-4">
            <RealisticText variant="caption" className="text-neutral-400 mb-2">From</RealisticText>
            <div className="flex justify-between items-center">
              <select
                value={fromChain.id}
                onChange={(e) => setFromChain(SUPPORTED_CHAINS.find(c => c.id === e.target.value) || SUPPORTED_CHAINS[0])}
                className="bg-neutral-800 border border-neutral-600 text-neutral-100 px-3 py-2 text-sm"
              >
                {SUPPORTED_CHAINS.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name} ({chain.symbol})
                  </option>
                ))}
              </select>
              <RealisticButton variant="ghost" size="sm" onClick={swapChains}>
                ⇅ Swap
              </RealisticButton>
            </div>
          </div>

          {/* To Chain */}
          <div className="bg-neutral-900 border border-neutral-700 p-4">
            <RealisticText variant="caption" className="text-neutral-400 mb-2">To</RealisticText>
            <select
              value={toChain.id}
              onChange={(e) => setToChain(SUPPORTED_CHAINS.find(c => c.id === e.target.value) || SUPPORTED_CHAINS[1])}
              className="bg-neutral-800 border border-neutral-600 text-neutral-100 px-3 py-2 text-sm w-full"
            >
              {SUPPORTED_CHAINS.filter(c => c.id !== fromChain.id).map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name} ({chain.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Asset Selection */}
          <div className="bg-neutral-900 border border-neutral-700 p-4">
            <RealisticText variant="caption" className="text-neutral-400 mb-2">Asset</RealisticText>
            <div className="flex gap-3">
              {SUPPORTED_ASSETS.map((asset) => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset)}
                  className={`flex items-center gap-2 px-3 py-2 border text-sm ${
                    selectedAsset.symbol === asset.symbol
                      ? 'border-amber-600 bg-amber-900/20 text-amber-400'
                      : 'border-neutral-600 bg-neutral-800 text-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  <span>{asset.icon}</span>
                  <span>{asset.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-neutral-900 border border-neutral-700 p-4">
            <RealisticText variant="caption" className="text-neutral-400 mb-2">Amount</RealisticText>
            <div className="flex gap-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: ${selectedAsset.minAmount}, Max: ${selectedAsset.maxAmount}`}
                className="flex-1 bg-neutral-800 border border-neutral-600 text-neutral-100 px-3 py-2 text-sm"
                step="0.000001"
                min={selectedAsset.minAmount}
                max={selectedAsset.maxAmount}
              />
              <button
                onClick={() => setAmount(selectedAsset.maxAmount)}
                className="px-3 py-2 bg-neutral-800 border border-neutral-600 text-neutral-300 text-sm hover:bg-neutral-700"
              >
                MAX
              </button>
            </div>
            {amount && !isValidAmount(amount) && (
              <div className="text-red-400 text-xs mt-1">
                Amount must be between {selectedAsset.minAmount} and {selectedAsset.maxAmount}
              </div>
            )}
          </div>

          {/* Recipient Address */}
          <div className="bg-neutral-900 border border-neutral-700 p-4">
            <RealisticText variant="caption" className="text-neutral-400 mb-2">Recipient Address</RealisticText>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-neutral-800 border border-neutral-600 text-neutral-100 px-3 py-2 text-sm font-mono"
            />
            {recipientAddress && !isValidAddress(recipientAddress) && (
              <div className="text-red-400 text-xs mt-1">
                Invalid address format
              </div>
            )}
          </div>

          {/* Fee Estimation */}
          {estimatedFees && (
            <div className="bg-neutral-900 border border-neutral-700 p-4">
              <RealisticText variant="caption" className="text-neutral-400 mb-2">Estimated Fees</RealisticText>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Network Fee:</span>
                  <span className="text-neutral-100">{estimatedFees.networkFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Bridge Fee:</span>
                  <span className="text-neutral-100">{estimatedFees.bridgeFee}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-300">Total:</span>
                  <span className="text-neutral-100">{estimatedFees.total}</span>
                </div>
              </div>
            </div>
          )}

          {/* Bridge Button */}
          <RealisticButton
            variant="primary"
            onClick={initiateBridge}
            disabled={!walletConnected || isProcessing || !amount || !recipientAddress || !isValidAmount(amount) || !isValidAddress(recipientAddress)}
            className="w-full"
          >
            {isProcessing ? 'Processing Bridge...' : `Bridge ${selectedAsset.symbol}`}
          </RealisticButton>
        </div>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="mt-6">
            <RealisticText variant="subtitle" className="mb-3">Recent Transactions</RealisticText>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="bg-neutral-900 border border-neutral-700 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm text-neutral-100">
                        {tx.amount} {tx.asset} • {tx.fromChain} → {tx.toChain}
                      </div>
                      <div className="text-xs text-neutral-400">{getTimeAgo(tx.timestamp)}</div>
                    </div>
                    <div className={`text-xs font-bold ${getStatusColor(tx.status)}`}>
                      {tx.status.toUpperCase()}
                    </div>
                  </div>
                  {tx.hash && (
                    <div className="text-xs text-neutral-500 font-mono">
                      Hash: {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs mt-2">
                    <span className="text-neutral-400">Fee: {tx.fees.total}</span>
                    {tx.status === 'processing' && (
                      <span className="text-amber-400">ETA: {formatTime(tx.estimatedTime)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-neutral-900 border border-neutral-700">
          <RealisticText variant="caption" className="text-neutral-400 leading-relaxed">
            Cross-chain bridge enables secure asset transfers between Ethereum and Base networks. 
            Transactions are processed through verified smart contracts with minimal fees and fast confirmation times. 
            Always verify recipient addresses before confirming transfers.
          </RealisticText>
        </div>
      </RealisticWastelandCard>
    </div>
  );
};