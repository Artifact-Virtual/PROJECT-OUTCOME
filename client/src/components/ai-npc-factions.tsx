import { useState, useEffect } from 'react';
import { 
  RealisticWastelandCard,
  RealisticText,
  RealisticButton
} from "@/components/realistic-wasteland";

interface NPCFaction {
  id: string;
  name: string;
  type: 'raider' | 'merchant' | 'military' | 'tech' | 'nomad';
  powerLevel: number;
  territories: string[];
  behavior: 'aggressive' | 'defensive' | 'neutral' | 'trading' | 'expansionist';
  aiDifficulty: 'relentless' | 'adaptive' | 'strategic';
  onlineMembers: number;
  totalMembers: number;
  resources: number;
  reputation: number;
  lastAction: string;
  timestamp: number;
}

const NPC_FACTIONS: NPCFaction[] = [
  {
    id: 'steel_legion',
    name: 'STEEL LEGION',
    type: 'military',
    powerLevel: 8750,
    territories: ['A-1', 'A-2', 'B-1', 'C-1'],
    behavior: 'aggressive',
    aiDifficulty: 'relentless',
    onlineMembers: 45,
    totalMembers: 67,
    resources: 125000,
    reputation: -85,
    lastAction: 'Fortified sector A-1 with automated defenses',
    timestamp: Date.now() - 1200000
  },
  {
    id: 'data_merchants',
    name: 'DATA MERCHANTS',
    type: 'tech',
    powerLevel: 6200,
    territories: ['D-3', 'E-3'],
    behavior: 'trading',
    aiDifficulty: 'strategic',
    onlineMembers: 28,
    totalMembers: 34,
    resources: 89000,
    reputation: 45,
    lastAction: 'Established trading post in neutral zone',
    timestamp: Date.now() - 800000
  },
  {
    id: 'wasteland_nomads',
    name: 'WASTELAND NOMADS',
    type: 'nomad',
    powerLevel: 5800,
    territories: ['F-5', 'G-4'],
    behavior: 'defensive',
    aiDifficulty: 'adaptive',
    onlineMembers: 32,
    totalMembers: 45,
    resources: 67000,
    reputation: 12,
    lastAction: 'Migrated convoy to avoid Steel Legion patrol',
    timestamp: Date.now() - 600000
  },
  {
    id: 'cyber_raiders',
    name: 'CYBER RAIDERS',
    type: 'raider',
    powerLevel: 7100,
    territories: ['H-2', 'H-3'],
    behavior: 'expansionist',
    aiDifficulty: 'relentless',
    onlineMembers: 38,
    totalMembers: 52,
    resources: 95000,
    reputation: -92,
    lastAction: 'Launched coordinated attack on merchant convoy',
    timestamp: Date.now() - 400000
  },
  {
    id: 'free_engineers',
    name: 'FREE ENGINEERS',
    type: 'tech',
    powerLevel: 4900,
    territories: ['C-4'],
    behavior: 'neutral',
    aiDifficulty: 'strategic',
    onlineMembers: 22,
    totalMembers: 28,
    resources: 78000,
    reputation: 78,
    lastAction: 'Completed mesh network relay installation',
    timestamp: Date.now() - 300000
  }
];

interface AIFactionManagerProps {
  className?: string;
}

export const AIFactionManager = ({ className = "" }: AIFactionManagerProps) => {
  const [factions, setFactions] = useState<NPCFaction[]>(NPC_FACTIONS);
  const [selectedFaction, setSelectedFaction] = useState<NPCFaction | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState<Record<string, 'hostile' | 'neutral' | 'allied'>>({
    steel_legion: 'hostile',
    data_merchants: 'neutral',
    wasteland_nomads: 'neutral',
    cyber_raiders: 'hostile',
    free_engineers: 'allied'
  });

  // AI faction behavior simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setFactions(prev => prev.map(faction => {
        const updatedFaction = { ...faction };
        
        // AI decision making based on faction type and behavior
        switch (faction.behavior) {
          case 'aggressive':
            // Aggressive factions gain power but lose reputation
            updatedFaction.powerLevel += Math.random() * 100;
            updatedFaction.reputation -= Math.random() * 5;
            break;
          case 'trading':
            // Trading factions gain resources and reputation
            updatedFaction.resources += Math.random() * 5000;
            updatedFaction.reputation += Math.random() * 3;
            break;
          case 'defensive':
            // Defensive factions maintain stability
            updatedFaction.powerLevel += Math.random() * 50;
            break;
          case 'expansionist':
            // Expansionist factions try to gain territories
            if (Math.random() > 0.8) {
              const newTerritory = `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 8) + 1}`;
              if (!updatedFaction.territories.includes(newTerritory)) {
                updatedFaction.territories.push(newTerritory);
              }
            }
            break;
        }

        // Online member fluctuation
        const memberChange = Math.floor((Math.random() - 0.5) * 6);
        updatedFaction.onlineMembers = Math.max(10, Math.min(updatedFaction.totalMembers, updatedFaction.onlineMembers + memberChange));

        return updatedFaction;
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const calculateThreatLevel = (faction: NPCFaction): string => {
    const relationship = relationshipStatus[faction.id];
    if (relationship === 'allied') return 'ALLIED';
    if (relationship === 'neutral') return 'NEUTRAL';
    
    const threat = faction.powerLevel + (faction.onlineMembers * 100);
    if (threat > 10000) return 'EXTREME';
    if (threat > 7000) return 'HIGH';
    if (threat > 4000) return 'MEDIUM';
    return 'LOW';
  };

  const getThreatColor = (threatLevel: string): string => {
    switch (threatLevel) {
      case 'EXTREME': return 'text-red-400';
      case 'HIGH': return 'text-orange-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-green-400';
      case 'ALLIED': return 'text-blue-400';
      case 'NEUTRAL': return 'text-neutral-400';
      default: return 'text-neutral-400';
    }
  };

  const engageFaction = (factionId: string, action: 'attack' | 'negotiate' | 'trade') => {
    setIsSimulating(true);
    
    setTimeout(() => {
      setFactions(prev => prev.map(f => {
        if (f.id === factionId) {
          const updated = { ...f };
          switch (action) {
            case 'attack':
              updated.reputation -= 20;
              updated.powerLevel -= Math.random() * 500;
              updated.lastAction = 'Under attack from human alliance';
              setRelationshipStatus(prev => ({ ...prev, [factionId]: 'hostile' }));
              break;
            case 'negotiate':
              updated.reputation += 10;
              setRelationshipStatus(prev => ({ ...prev, [factionId]: 'neutral' }));
              updated.lastAction = 'Entered diplomatic negotiations';
              break;
            case 'trade':
              updated.resources += 5000;
              updated.reputation += 15;
              setRelationshipStatus(prev => ({ ...prev, [factionId]: 'allied' }));
              updated.lastAction = 'Established trade agreement';
              break;
          }
          updated.timestamp = Date.now();
          return updated;
        }
        return f;
      }));
      setIsSimulating(false);
    }, 2000);
  };

  const getTimeSince = (timestamp: number): string => {
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
              AI Faction Network
            </RealisticText>
            <RealisticText variant="caption" className="text-neutral-500">
              Relentless Difficulty • Autonomous NPCs
            </RealisticText>
          </div>
          <div className="text-right">
            <div className="text-xs text-neutral-400">Active Factions</div>
            <div className="text-xl font-bold text-amber-400">{factions.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {factions.map((faction) => {
            const threatLevel = calculateThreatLevel(faction);
            const threatColor = getThreatColor(threatLevel);
            
            return (
              <div
                key={faction.id}
                className={`bg-neutral-900 border p-4 cursor-pointer transition-colors ${
                  selectedFaction?.id === faction.id 
                    ? 'border-amber-600 bg-amber-900/10' 
                    : 'border-neutral-700 hover:border-neutral-600'
                }`}
                onClick={() => setSelectedFaction(faction)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-sm text-neutral-100">{faction.name}</div>
                    <div className="text-xs text-neutral-400 uppercase">{faction.type} FACTION</div>
                  </div>
                  <div className={`text-xs font-bold ${threatColor}`}>
                    {threatLevel}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Power Level</span>
                    <span className="text-neutral-100 font-mono">{Math.floor(faction.powerLevel).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Online/Total</span>
                    <span className="text-emerald-400 font-mono">{faction.onlineMembers}/{faction.totalMembers}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Territories</span>
                    <span className="text-amber-400 font-mono">{faction.territories.length}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Reputation</span>
                    <span className={`font-mono ${faction.reputation > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {faction.reputation > 0 ? '+' : ''}{Math.floor(faction.reputation)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-700">
                  <div className="text-xs text-neutral-500 mb-1">Last Action:</div>
                  <div className="text-xs text-neutral-300">{faction.lastAction}</div>
                  <div className="text-xs text-neutral-600 mt-1">{getTimeSince(faction.timestamp)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedFaction && (
          <div className="mt-6 p-4 bg-black border border-neutral-700">
            <div className="flex justify-between items-center mb-4">
              <div>
                <RealisticText variant="subtitle" className="text-neutral-100">
                  {selectedFaction.name} - Engagement Options
                </RealisticText>
                <RealisticText variant="caption" className="text-neutral-500">
                  Difficulty: {selectedFaction.aiDifficulty.toUpperCase()} • Behavior: {selectedFaction.behavior.toUpperCase()}
                </RealisticText>
              </div>
              <RealisticButton 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedFaction(null)}
              >
                Close
              </RealisticButton>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <RealisticButton
                variant="danger"
                size="sm"
                disabled={isSimulating}
                onClick={() => engageFaction(selectedFaction.id, 'attack')}
                className="w-full"
              >
                {isSimulating ? 'Processing...' : 'Attack'}
              </RealisticButton>
              <RealisticButton
                variant="secondary"
                size="sm"
                disabled={isSimulating}
                onClick={() => engageFaction(selectedFaction.id, 'negotiate')}
                className="w-full"
              >
                {isSimulating ? 'Processing...' : 'Negotiate'}
              </RealisticButton>
              <RealisticButton
                variant="primary"
                size="sm"
                disabled={isSimulating}
                onClick={() => engageFaction(selectedFaction.id, 'trade')}
                className="w-full"
              >
                {isSimulating ? 'Processing...' : 'Trade'}
              </RealisticButton>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-neutral-400 mb-1">Controlled Territories:</div>
                <div className="text-neutral-100 font-mono">
                  {selectedFaction.territories.join(', ')}
                </div>
              </div>
              <div>
                <div className="text-neutral-400 mb-1">Resources:</div>
                <div className="text-neutral-100 font-mono">
                  {Math.floor(selectedFaction.resources).toLocaleString()} credits
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-neutral-900 border border-neutral-700">
          <RealisticText variant="caption" className="text-neutral-400 leading-relaxed">
            AI factions operate autonomously with relentless difficulty. They adapt strategies, form temporary alliances, 
            and respond dynamically to player actions. Stronger alliances can team up against dominant factions, 
            but be prepared for coordinated AI counter-attacks.
          </RealisticText>
        </div>
      </RealisticWastelandCard>
    </div>
  );
};