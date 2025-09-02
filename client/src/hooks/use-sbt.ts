import { useState, useEffect } from 'react';
import { useWeb3 } from './use-web3';
import { ethers } from 'ethers';

// Contract ABIs (simplified for demo)
const IDENTITY_SBT_ABI = [
  "function hasRole(address who, bytes32 role) view returns (bool)",
  "function weightOf(address who) view returns (uint256)",
  "function rolesList(address who) view returns (bytes32[])",
  "function VETERAN_ROLE() view returns (bytes32)",
  "function COMMANDER_ROLE() view returns (bytes32)",
  "function TRADER_ROLE() view returns (bytes32)",
  "function ACHIEVEMENT_FIRST_WIN() view returns (bytes32)",
  "function ACHIEVEMENT_TERRITORY_MASTER() view returns (bytes32)",
  "function ACHIEVEMENT_ALLIANCE_BUILDER() view returns (bytes32)"
];

interface SBTState {
  hasVeteranRole: boolean;
  hasCommanderRole: boolean;
  hasTraderRole: boolean;
  reputation: number;
  achievements: string[];
  isLoading: boolean;
  error: string | null;
}

interface SBTHook extends SBTState {
  refreshSBTData: () => Promise<void>;
  checkRole: (role: string) => Promise<boolean>;
  getReputation: () => Promise<number>;
}

export function useSBT(): SBTHook {
  const { account, isConnected, provider } = useWeb3();
  const [sbtState, setSbtState] = useState<SBTState>({
    hasVeteranRole: false,
    hasCommanderRole: false,
    hasTraderRole: false,
    reputation: 0,
    achievements: [],
    isLoading: false,
    error: null,
  });

  const refreshSBTData = async () => {
    if (!isConnected || !account || !provider) {
      // Fallback to mock data if not connected
      setSbtState(prev => ({
        ...prev,
        hasVeteranRole: Math.random() > 0.7,
        hasCommanderRole: Math.random() > 0.8,
        hasTraderRole: Math.random() > 0.6,
        reputation: Math.floor(Math.random() * 10000),
        achievements: ['FIRST_WIN', 'TERRITORY_MASTER'],
        isLoading: false,
        error: null,
      }));
      return;
    }

    setSbtState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Load deployment addresses
      const deploymentData = await fetch('/deployment-ganache.json').then(r => r.json());
      const identitySBTAddress = deploymentData.contracts.IdentitySBT;

      if (!identitySBTAddress) {
        throw new Error('IdentitySBT contract not deployed');
      }

      const contract = new ethers.Contract(identitySBTAddress, IDENTITY_SBT_ABI, provider);

      // Get role constants
      const [veteranRole, commanderRole, traderRole] = await Promise.all([
        contract.VETERAN_ROLE(),
        contract.COMMANDER_ROLE(),
        contract.TRADER_ROLE()
      ]);

      // Check roles
      const [hasVeteran, hasCommander, hasTrader] = await Promise.all([
        contract.hasRole(account, veteranRole),
        contract.hasRole(account, commanderRole),
        contract.hasRole(account, traderRole)
      ]);

      // Get reputation
      const reputation = await contract.weightOf(account);
      const reputationNumber = Number(ethers.formatEther(reputation)) * 100; // Convert to readable format

      // Get achievements
      const [firstWin, territoryMaster, allianceBuilder] = await Promise.all([
        contract.ACHIEVEMENT_FIRST_WIN(),
        contract.ACHIEVEMENT_TERRITORY_MASTER(),
        contract.ACHIEVEMENT_ALLIANCE_BUILDER()
      ]);

      const [hasFirstWin, hasTerritoryMaster, hasAllianceBuilder] = await Promise.all([
        contract.hasRole(account, firstWin),
        contract.hasRole(account, territoryMaster),
        contract.hasRole(account, allianceBuilder)
      ]);

      const achievements = [];
      if (hasFirstWin) achievements.push('FIRST_WIN');
      if (hasTerritoryMaster) achievements.push('TERRITORY_MASTER');
      if (hasAllianceBuilder) achievements.push('ALLIANCE_BUILDER');

      setSbtState({
        hasVeteranRole: hasVeteran,
        hasCommanderRole: hasCommander,
        hasTraderRole: hasTrader,
        reputation: Math.floor(reputationNumber),
        achievements,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error loading SBT data:', error);
      setSbtState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load SBT data'
      }));
    }
  };

  const checkRole = async (role: string): Promise<boolean> => {
    if (!isConnected || !account || !provider) return false;

    try {
      const deploymentData = await fetch('/deployment-ganache.json').then(r => r.json());
      const contract = new ethers.Contract(deploymentData.contracts.IdentitySBT, IDENTITY_SBT_ABI, provider);

      let roleHash;
      switch (role.toUpperCase()) {
        case 'VETERAN':
          roleHash = await contract.VETERAN_ROLE();
          break;
        case 'COMMANDER':
          roleHash = await contract.COMMANDER_ROLE();
          break;
        case 'TRADER':
          roleHash = await contract.TRADER_ROLE();
          break;
        default:
          return false;
      }

      return await contract.hasRole(account, roleHash);
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  const getReputation = async (): Promise<number> => {
    if (!isConnected || !account || !provider) return 0;

    try {
      const deploymentData = await fetch('/deployment-ganache.json').then(r => r.json());
      const contract = new ethers.Contract(deploymentData.contracts.IdentitySBT, IDENTITY_SBT_ABI, provider);

      const reputation = await contract.weightOf(account);
      return Math.floor(Number(ethers.formatEther(reputation)) * 100);
    } catch (error) {
      console.error('Error getting reputation:', error);
      return 0;
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      refreshSBTData();
    }
  }, [isConnected, account]);

  return {
    ...sbtState,
    refreshSBTData,
    checkRole,
    getReputation,
  };
}
