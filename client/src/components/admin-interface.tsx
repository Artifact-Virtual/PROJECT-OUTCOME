import React, { useState } from 'react';
import { useWeb3 } from '@/hooks/use-web3';
import { useSBT } from '@/hooks/use-sbt';
import { RealisticWastelandCard, RealisticText, RealisticButton } from "@/components/realistic-wasteland";
import { Input } from "@/components/ui/input";
import { ethers } from 'ethers';

interface AdminInterfaceProps {
  className?: string;
}

export function AdminInterface({ className }: AdminInterfaceProps) {
  const { account, isConnected, provider, signer } = useWeb3();
  const { refreshSBTData } = useSBT();
  const [targetAddress, setTargetAddress] = useState('');
  const [selectedRole, setSelectedRole] = useState('VETERAN');
  const [isIssuing, setIsIssuing] = useState(false);
  const [message, setMessage] = useState('');

  const issueRole = async () => {
    if (!isConnected || !signer || !targetAddress) return;

    setIsIssuing(true);
    setMessage('');

    try {
      // Load deployment addresses
      const deploymentData = await fetch('/deployment-ganache.json').then(r => r.json());
      const ocshAddress = deploymentData.contracts.OCSH;

      if (!ocshAddress) {
        throw new Error('OCSH contract not deployed');
      }

      // OCSH contract ABI (simplified)
      const OCSH_ABI = [
        "function issueGameRole(address player, bytes32 role, bytes32 uid) external",
        "function GAME_ADMIN_ROLE() view returns (bytes32)"
      ];

      const ocshContract = new ethers.Contract(ocshAddress, OCSH_ABI, signer);

      // Generate unique ID for the role issuance
      const uid = ethers.keccak256(ethers.toUtf8Bytes(`${selectedRole}-${targetAddress}-${Date.now()}`));

      // Issue the role
      const tx = await ocshContract.issueGameRole(targetAddress, ethers.keccak256(ethers.toUtf8Bytes(selectedRole)), uid);
      await tx.wait();

      setMessage(`Successfully issued ${selectedRole} role to ${targetAddress}`);
      setTargetAddress('');

      // Refresh SBT data if the target is the current user
      if (targetAddress.toLowerCase() === account?.toLowerCase()) {
        await refreshSBTData();
      }

    } catch (error: any) {
      console.error('Error issuing role:', error);
      setMessage(`Error: ${error.message || 'Failed to issue role'}`);
    } finally {
      setIsIssuing(false);
    }
  };

  const roles = [
    { value: 'VETERAN', label: 'Veteran (+20% Battle Power)' },
    { value: 'COMMANDER', label: 'Commander (+30% Battle Power, Alliance Creation)' },
    { value: 'TRADER', label: 'Trader (Enhanced Trading)' },
  ];

  if (!isConnected) {
    return (
      <RealisticWastelandCard className={className}>
        <RealisticText>Please connect your wallet to access admin functions</RealisticText>
      </RealisticWastelandCard>
    );
  }

  return (
    <RealisticWastelandCard className={className}>
      <div className="space-y-6">
        <RealisticText className="text-xl font-bold">ADMIN INTERFACE</RealisticText>
        <RealisticText className="text-sm text-gray-400">
          Issue special SBT roles to players. Requires GAME_ADMIN_ROLE permissions.
        </RealisticText>

        <div className="space-y-4">
          <div>
            <RealisticText className="text-sm text-gray-400 mb-2">TARGET ADDRESS</RealisticText>
            <Input
              type="text"
              placeholder="0x..."
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <RealisticText className="text-sm text-gray-400 mb-2">ROLE TO ISSUE</RealisticText>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-neutral-100"
              aria-label="Role to issue"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <RealisticButton
            onClick={issueRole}
            disabled={isIssuing || !targetAddress || !ethers.isAddress(targetAddress)}
            className="w-full"
          >
            {isIssuing ? 'ISSUING...' : 'ISSUE ROLE'}
          </RealisticButton>

          {message && (
            <div className={`p-3 rounded ${message.includes('Error') ? 'bg-red-900/20 border border-red-700' : 'bg-green-900/20 border border-green-700'}`}>
              <RealisticText className={`text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                {message}
              </RealisticText>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-600 pt-4">
          <RealisticText className="text-sm text-gray-400 mb-2">QUICK ACTIONS</RealisticText>
          <div className="grid grid-cols-1 gap-2">
            <RealisticButton
              variant="secondary"
              size="sm"
              onClick={() => setTargetAddress(account || '')}
            >
              Issue to Self
            </RealisticButton>
            <RealisticButton
              variant="secondary"
              size="sm"
              onClick={() => setSelectedRole('COMMANDER')}
            >
              Commander Role
            </RealisticButton>
          </div>
        </div>
      </div>
    </RealisticWastelandCard>
  );
}
