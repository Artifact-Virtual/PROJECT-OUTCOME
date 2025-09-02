import React from 'react';
import { useSBT } from '@/hooks/use-sbt';
import { RealisticWastelandCard, RealisticText, RealisticButton } from "@/components/realistic-wasteland";

interface SBTDisplayProps {
  className?: string;
}

export function SBTDisplay({ className }: SBTDisplayProps) {
  const {
    hasVeteranRole,
    hasCommanderRole,
    hasTraderRole,
    reputation,
    achievements,
    isLoading,
    error,
    refreshSBTData
  } = useSBT();

  if (isLoading) {
    return (
      <RealisticWastelandCard className={className}>
        <RealisticText>Loading SBT data...</RealisticText>
      </RealisticWastelandCard>
    );
  }

  if (error) {
    return (
      <RealisticWastelandCard className={className}>
        <RealisticText className="text-red-400">Error: {error}</RealisticText>
        <RealisticButton onClick={refreshSBTData} className="mt-2">
          Retry
        </RealisticButton>
      </RealisticWastelandCard>
    );
  }

  return (
    <RealisticWastelandCard className={className}>
      <div className="space-y-4">
        <RealisticText className="text-xl font-bold">SOULBOUND TOKENS</RealisticText>

        {/* Reputation */}
        <div className="border-b border-gray-600 pb-2">
          <RealisticText className="text-sm text-gray-400">REPUTATION SCORE</RealisticText>
          <RealisticText className="text-2xl font-mono text-yellow-400">
            {reputation.toLocaleString()}
          </RealisticText>
        </div>

        {/* Roles */}
        <div className="space-y-2">
          <RealisticText className="text-sm text-gray-400">ROLES</RealisticText>
          <div className="grid grid-cols-1 gap-2">
            <div className={`flex items-center space-x-2 ${hasVeteranRole ? 'text-green-400' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${hasVeteranRole ? 'bg-green-400' : 'bg-gray-500'}`} />
              <RealisticText>VETERAN</RealisticText>
            </div>
            <div className={`flex items-center space-x-2 ${hasCommanderRole ? 'text-blue-400' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${hasCommanderRole ? 'bg-blue-400' : 'bg-gray-500'}`} />
              <RealisticText>COMMANDER</RealisticText>
            </div>
            <div className={`flex items-center space-x-2 ${hasTraderRole ? 'text-purple-400' : 'text-gray-500'}`}>
              <div className={`w-2 h-2 rounded-full ${hasTraderRole ? 'bg-purple-400' : 'bg-gray-500'}`} />
              <RealisticText>TRADER</RealisticText>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <RealisticText className="text-sm text-gray-400">ACHIEVEMENTS</RealisticText>
          <div className="grid grid-cols-1 gap-2">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2 text-orange-400">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <RealisticText className="uppercase">{achievement.replace('_', ' ')}</RealisticText>
              </div>
            ))}
            {achievements.length === 0 && (
              <RealisticText className="text-gray-500 italic">No achievements yet</RealisticText>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="border-t border-gray-600 pt-2">
          <RealisticText className="text-sm text-gray-400">ACTIVE BONUSES</RealisticText>
          <div className="space-y-1 text-sm">
            {hasVeteranRole && <RealisticText className="text-green-400">+20% Battle Power</RealisticText>}
            {hasCommanderRole && <RealisticText className="text-blue-400">+30% Battle Power, Alliance Creation</RealisticText>}
            {hasTraderRole && <RealisticText className="text-purple-400">Enhanced Trading Privileges</RealisticText>}
            {reputation > 5000 && <RealisticText className="text-yellow-400">Territory Claim Priority</RealisticText>}
          </div>
        </div>

        <RealisticButton onClick={refreshSBTData} className="w-full">
          REFRESH DATA
        </RealisticButton>
      </div>
    </RealisticWastelandCard>
  );
}
