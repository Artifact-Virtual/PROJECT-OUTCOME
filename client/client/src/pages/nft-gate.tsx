import { useQuery } from '@tanstack/react-query';
import { useWeb3 } from "@/hooks/use-web3";
import { apiRequest } from '@/lib/queryClient';
import { NftMintingInterface } from "@/components/nft-minting-interface";
import { RealisticText, RealisticButton, RealisticWastelandCard } from "@/components/realistic-wasteland";

interface NftStatus {
  hasNft: boolean;
  id?: string;
  tokenId?: string;
  selectedTerritoryX?: number;
  selectedTerritoryY?: number;
  status?: string;
}

interface NFTGateProps {
  children: React.ReactNode;
}

export function NFTGate({ children }: NFTGateProps) {
  // DEVELOPMENT MODE: Bypass wallet connection requirement
  const DEVELOPMENT_MODE = true; // Set to false when ready for Web3 testing
  
  const { account, isConnected, connectWallet } = useWeb3();

  // Check user's NFT status
  const { data: nftStatus, isLoading } = useQuery({
    queryKey: ['/api/nft/user', account],
    queryFn: async () => {
      if (!account) return { hasNft: false };
      const response = await fetch(`/api/nft/user/${account}`);
      if (!response.ok) throw new Error('Failed to fetch NFT status');
      return await response.json() as NftStatus;
    },
    enabled: !!account && isConnected && !DEVELOPMENT_MODE, // Disabled in dev mode
  });

  // DEVELOPMENT MODE: Skip all checks and show app directly
  if (DEVELOPMENT_MODE) {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <RealisticWastelandCard className="p-8 text-center">
          <RealisticText variant="body" className="text-neutral-400">
            Checking OCSH NFT status...
          </RealisticText>
        </RealisticWastelandCard>
      </div>
    );
  }

  // Show wallet connection if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <RealisticWastelandCard className="p-8 text-center max-w-md">
          <RealisticText variant="title" className="mb-4 text-amber-400">
            BLOKBOY 1000
          </RealisticText>
          <RealisticText variant="subtitle" className="mb-4">
            Access Restricted
          </RealisticText>
          <RealisticText variant="body" className="mb-6 text-neutral-400">
            Connect your Web3 wallet to verify OCSH NFT ownership and access the wasteland.
          </RealisticText>
          <RealisticButton onClick={connectWallet} data-testid="button-connect-wallet">
            Connect Wallet
          </RealisticButton>
        </RealisticWastelandCard>
      </div>
    );
  }

  // Show NFT requirement if user doesn't have NFT
  if (!nftStatus?.hasNft && !nftStatus?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <RealisticWastelandCard className="p-8 text-center max-w-md">
          <RealisticText variant="title" className="mb-4 text-amber-400">
            BLOKBOY 1000
          </RealisticText>
          <RealisticText variant="subtitle" className="mb-4 text-red-400">
            OCSH NFT Required
          </RealisticText>
          <RealisticText variant="body" className="mb-6 text-neutral-400">
            You need to mint an OCSH (On-Chain Survival Handbook) NFT to access the wasteland. 
            Only 1 NFT per wallet is allowed.
          </RealisticText>
          <div className="space-y-3">
            <RealisticButton 
              onClick={() => window.location.href = '/mint'}
              data-testid="button-mint-nft"
            >
              Mint OCSH NFT
            </RealisticButton>
            <RealisticText variant="caption" className="text-neutral-500">
              Price: Free | Network: Base
            </RealisticText>
          </div>
        </RealisticWastelandCard>
      </div>
    );
  }

  // Show minting interface if on mint page
  if (window.location.pathname === '/mint') {
    return <NftMintingInterface />;
  }

  // User has NFT, allow access to game
  return <>{children}</>;
}