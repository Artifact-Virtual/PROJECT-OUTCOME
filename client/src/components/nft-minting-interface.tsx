import { useState, useEffect } from "react";
import { RealisticText, RealisticButton, RealisticWastelandCard } from "@/components/realistic-wasteland";
import { useWeb3, useNftMinting } from "@/hooks/use-web3";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Territory {
  x: number;
  y: number;
  strategicValue: number;
  resources: string;
  threat_level: number;
  nearby_alliances: number;
}

interface NftEligibility {
  eligible: boolean;
  reason?: string;
}

interface NftMint {
  id: string;
  tokenId: string;
  walletAddress: string;
  userId: string;
  selectedTerritoryX: number;
  selectedTerritoryY: number;
  mintTxHash: string;
  status: string;
  metadata?: any;
  mintedAt: string;
}

export function NftMintingInterface() {
  // DEVELOPMENT MODE: Bypass wallet requirements
  const DEVELOPMENT_MODE = true; // Set to false when ready for Web3 testing
  
  const { account, isConnected, connectWallet } = useWeb3();
  const { mintNft } = useNftMinting();
  const queryClient = useQueryClient();
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [mintingStep, setMintingStep] = useState<'check' | 'select' | 'mint' | 'confirm'>('check');
  const [mintTxHash, setMintTxHash] = useState<string>('');

  // Check NFT eligibility
  const { data: eligibility, isLoading: checkingEligibility } = useQuery({
    queryKey: ['/api/nft/eligibility', account],
    queryFn: async () => {
      const response = await fetch(`/api/nft/eligibility/${account}`);
      if (!response.ok) throw new Error('Failed to check eligibility');
      return await response.json() as NftEligibility;
    },
    enabled: !!account && isConnected && !DEVELOPMENT_MODE, // Disabled in dev mode
  });

  // Get available territories
  const { data: territories = [], isLoading: loadingTerritories } = useQuery({
    queryKey: ['/api/nft/available-territories'],
    queryFn: async () => {
      const response = await fetch('/api/nft/available-territories');
      if (!response.ok) throw new Error('Failed to fetch territories');
      return await response.json() as Territory[];
    },
    enabled: (eligibility?.eligible === true) && !DEVELOPMENT_MODE, // Disabled in dev mode
  });

  // Get user's existing NFT
  const { data: existingNft } = useQuery({
    queryKey: ['/api/nft/user', account],
    queryFn: async () => {
      const response = await fetch(`/api/nft/user/${account}`);
      if (!response.ok) throw new Error('Failed to fetch NFT status');
      return await response.json() as NftMint | { hasNft: false };
    },
    enabled: !!account && isConnected && !DEVELOPMENT_MODE, // Disabled in dev mode
  });

  // Create NFT mint mutation
  const createMintMutation = useMutation({
    mutationFn: async (mintData: any) => {
      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mintData),
      });
      if (!response.ok) throw new Error('Failed to mint NFT');
      return response.json();
    },
    onSuccess: () => {
      setMintingStep('mint');
    },
  });

  // Confirm NFT mint mutation
  const confirmMintMutation = useMutation({
    mutationFn: async (confirmData: any) => {
      const response = await fetch('/api/nft/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(confirmData),
      });
      if (!response.ok) throw new Error('Failed to confirm NFT');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nft/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setMintingStep('confirm');
    },
  });

  // DEVELOPMENT MODE: Show development notice
  if (DEVELOPMENT_MODE) {
    return (
      <RealisticWastelandCard variant="default" className="p-8 text-center max-w-md mx-auto">
        <RealisticText variant="subtitle" className="mb-4 text-amber-400">
          Development Mode Active
        </RealisticText>
        <RealisticText variant="body" className="mb-6 text-neutral-300">
          NFT minting is disabled in development mode. Web3 features will be enabled in the final testing phase.
        </RealisticText>
        <RealisticText variant="caption" className="text-neutral-400">
          You can access the game directly without minting an NFT during development.
        </RealisticText>
        <div className="mt-6">
          <RealisticButton 
            onClick={() => window.location.href = '/'}
            data-testid="button-return-dashboard"
          >
            Return to Dashboard
          </RealisticButton>
        </div>
      </RealisticWastelandCard>
    );
  }

  // Show wallet connection if not connected
  if (!isConnected) {
    return (
      <RealisticWastelandCard variant="default" className="p-8 text-center max-w-md mx-auto">
        <RealisticText variant="subtitle" className="mb-4">
          Connect Wallet to Mint OCSH NFT
        </RealisticText>
        <RealisticText variant="body" className="mb-6 text-neutral-400">
          Connect your Web3 wallet to mint your On-Chain Survival Handbook NFT and claim your territory.
        </RealisticText>
        <RealisticButton onClick={connectWallet} data-testid="button-connect-wallet">
          Connect Wallet
        </RealisticButton>
      </RealisticWastelandCard>
    );
  }

  // Show existing NFT status
  if (existingNft && 'id' in existingNft) {
    return (
      <RealisticWastelandCard variant="default" className="p-8 text-center max-w-md mx-auto">
        <RealisticText variant="subtitle" className="mb-4 text-emerald-400">
          OCSH NFT Owned
        </RealisticText>
        <RealisticText variant="body" className="mb-4 text-neutral-300">
          You already own an OCSH NFT #{existingNft.tokenId}
        </RealisticText>
        <RealisticText variant="caption" className="text-neutral-400">
          Territory: ({existingNft.selectedTerritoryX}, {existingNft.selectedTerritoryY})
        </RealisticText>
        <div className="mt-6">
          <RealisticButton 
            onClick={() => window.location.href = '/dashboard'}
            data-testid="button-enter-game"
          >
            Enter Wasteland
          </RealisticButton>
        </div>
      </RealisticWastelandCard>
    );
  }

  // Show ineligible status
  if (eligibility && !eligibility.eligible) {
    return (
      <RealisticWastelandCard variant="default" className="p-8 text-center max-w-md mx-auto">
        <RealisticText variant="subtitle" className="mb-4 text-red-400">
          Ineligible for Minting
        </RealisticText>
        <RealisticText variant="body" className="mb-6 text-neutral-300">
          {eligibility.reason}
        </RealisticText>
        <RealisticText variant="caption" className="text-neutral-400">
          Only 1 OCSH NFT per wallet is allowed. Each NFT grants access to the wasteland survival game.
        </RealisticText>
      </RealisticWastelandCard>
    );
  }

  const handleTerritorySelect = (territory: Territory) => {
    setSelectedTerritory(territory);
  };

  const handleMintNft = async () => {
    if (!selectedTerritory || !account) return;

    try {
      // Create mint record in database
      await createMintMutation.mutateAsync({
        walletAddress: account,
        userId: 'temp-user-id', // This should come from authenticated user
        selectedTerritoryX: selectedTerritory.x,
        selectedTerritoryY: selectedTerritory.y,
        tokenId: `OCSH-${Date.now()}`, // Generate unique token ID
        mintTxHash: 'pending',
        status: 'pending',
        metadata: {
          territory: selectedTerritory,
          mintedBy: account,
          traits: {
            strategicValue: selectedTerritory.strategicValue,
            resources: selectedTerritory.resources,
            threatLevel: selectedTerritory.threat_level
          }
        }
      });

      // Mint NFT on blockchain
      const mintResult = await mintNft(
        account,
        selectedTerritory.x,
        selectedTerritory.y,
        {
          strategicValue: selectedTerritory.strategicValue,
          resources: selectedTerritory.resources,
          threatLevel: selectedTerritory.threat_level
        }
      );
      
      setMintTxHash(mintResult.txHash);
      
      // Confirm mint in database
      setTimeout(() => {
        confirmMintMutation.mutate({
          tokenId: mintResult.tokenId,
          userId: 'temp-user-id', // This should come from auth context
          txHash: mintResult.txHash
        });
      }, 2000);

    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  const getResourceColor = (resource: string) => {
    switch (resource) {
      case 'water': return 'text-blue-400 border-blue-400/30';
      case 'tech': return 'text-purple-400 border-purple-400/30';
      case 'fuel': return 'text-orange-400 border-orange-400/30';
      case 'weapons': return 'text-red-400 border-red-400/30';
      default: return 'text-neutral-400 border-neutral-400/30';
    }
  };

  const getThreatColor = (level: number) => {
    if (level <= 2) return 'text-emerald-400 border-emerald-400/30';
    if (level <= 3) return 'text-amber-400 border-amber-400/30';
    return 'text-red-400 border-red-400/30';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <RealisticText variant="title" className="mb-2">
          OCSH NFT Minting Protocol
        </RealisticText>
        <RealisticText variant="subtitle" className="text-neutral-400">
          Claim your On-Chain Survival Handbook and stake your territory
        </RealisticText>
      </div>

      <Tabs value={mintingStep} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="check" disabled={checkingEligibility}>
            1. Eligibility
          </TabsTrigger>
          <TabsTrigger value="select" disabled={!eligibility?.eligible}>
            2. Territory
          </TabsTrigger>
          <TabsTrigger value="mint" disabled={!selectedTerritory}>
            3. Mint NFT
          </TabsTrigger>
          <TabsTrigger value="confirm" disabled={mintingStep !== 'confirm'}>
            4. Confirmed
          </TabsTrigger>
        </TabsList>

        {/* Eligibility Check */}
        <TabsContent value="check">
          <RealisticWastelandCard className="p-6 text-center">
            {checkingEligibility ? (
              <RealisticText variant="body" className="text-neutral-400">
                Checking wallet eligibility...
              </RealisticText>
            ) : eligibility?.eligible ? (
              <>
                <RealisticText variant="subtitle" className="mb-4 text-emerald-400">
                  Wallet Eligible for Minting
                </RealisticText>
                <RealisticText variant="body" className="mb-6 text-neutral-300">
                  Your wallet {account?.substring(0, 8)}...{account?.substring(-6)} is eligible to mint an OCSH NFT.
                </RealisticText>
                <RealisticButton 
                  onClick={() => setMintingStep('select')}
                  data-testid="button-proceed-to-territory"
                >
                  Select Territory
                </RealisticButton>
              </>
            ) : (
              <RealisticText variant="body" className="text-red-400">
                {eligibility?.reason || 'Checking eligibility...'}
              </RealisticText>
            )}
          </RealisticWastelandCard>
        </TabsContent>

        {/* Territory Selection */}
        <TabsContent value="select">
          <div className="space-y-6">
            <RealisticText variant="body" className="text-neutral-300 text-center">
              Choose your starting territory wisely. This will be your home base in the wasteland.
            </RealisticText>

            {selectedTerritory && (
              <RealisticWastelandCard className="p-4 border-amber-400/30">
                <RealisticText variant="body" className="mb-2 text-amber-400">
                  Selected Territory: ({selectedTerritory.x}, {selectedTerritory.y})
                </RealisticText>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getResourceColor(selectedTerritory.resources)}>
                    {selectedTerritory.resources}
                  </Badge>
                  <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                    Value: {selectedTerritory.strategicValue}
                  </Badge>
                  <Badge variant="outline" className={getThreatColor(selectedTerritory.threat_level)}>
                    Threat: {selectedTerritory.threat_level}/5
                  </Badge>
                </div>
                <div className="mt-4">
                  <RealisticButton 
                    onClick={() => setMintingStep('mint')}
                    data-testid="button-confirm-territory"
                  >
                    Confirm Territory Selection
                  </RealisticButton>
                </div>
              </RealisticWastelandCard>
            )}

            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loadingTerritories ? (
                  <div className="col-span-full text-center text-neutral-400">
                    Loading available territories...
                  </div>
                ) : territories.length === 0 ? (
                  <div className="col-span-full text-center text-neutral-400">
                    No territories available for minting
                  </div>
                ) : territories.map((territory) => (
                  <Card 
                    key={`${territory.x}-${territory.y}`}
                    className={`bg-neutral-800 border-neutral-700 cursor-pointer transition-all hover:border-amber-400/50 ${
                      selectedTerritory?.x === territory.x && selectedTerritory?.y === territory.y 
                        ? 'border-amber-400 bg-amber-400/5' 
                        : ''
                    }`}
                    onClick={() => handleTerritorySelect(territory)}
                    data-testid={`territory-${territory.x}-${territory.y}`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-neutral-100 text-sm">
                        Sector ({territory.x}, {territory.y})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className={getResourceColor(territory.resources)}>
                          {territory.resources}
                        </Badge>
                        <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                          {territory.strategicValue}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Threat Level:</span>
                          <span className={getThreatColor(territory.threat_level).split(' ')[0]}>
                            {territory.threat_level}/5
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Nearby Alliances:</span>
                          <span className="text-neutral-100">{territory.nearby_alliances}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Minting Process */}
        <TabsContent value="mint">
          <RealisticWastelandCard className="p-6 text-center">
            <RealisticText variant="subtitle" className="mb-4">
              Mint Your OCSH NFT
            </RealisticText>
            <RealisticText variant="body" className="mb-6 text-neutral-300">
              Territory: ({selectedTerritory?.x}, {selectedTerritory?.y})
            </RealisticText>
            <RealisticText variant="caption" className="mb-8 text-neutral-400">
              This will mint your unique On-Chain Survival Handbook NFT and claim your selected territory.
              You will own this territory for 24 hours initially.
            </RealisticText>
            <RealisticButton 
              onClick={handleMintNft}
              disabled={createMintMutation.isPending}
              data-testid="button-mint-nft"
            >
              {createMintMutation.isPending ? 'Minting...' : 'Mint OCSH NFT'}
            </RealisticButton>
          </RealisticWastelandCard>
        </TabsContent>

        {/* Confirmation */}
        <TabsContent value="confirm">
          <RealisticWastelandCard className="p-6 text-center">
            <RealisticText variant="subtitle" className="mb-4 text-emerald-400">
              NFT Minted Successfully!
            </RealisticText>
            <RealisticText variant="body" className="mb-4 text-neutral-300">
              Your OCSH NFT has been minted and your territory has been claimed.
            </RealisticText>
            {mintTxHash && (
              <RealisticText variant="caption" className="mb-6 text-neutral-400 font-mono">
                Transaction: {mintTxHash.substring(0, 20)}...
              </RealisticText>
            )}
            <RealisticButton 
              onClick={() => window.location.href = '/dashboard'}
              data-testid="button-enter-wasteland"
            >
              Enter the Wasteland
            </RealisticButton>
          </RealisticWastelandCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}