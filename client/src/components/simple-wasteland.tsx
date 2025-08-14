import { Link } from "wouter";
import { WastelandText, WastelandButton, WastelandCard, WastelandProgress } from "./wasteland-ui";
import { Badge } from "@/components/ui/badge";

// Simplified components with mock data for visual demonstration

export const SimpleWastelandMap = () => {
  return (
    <WastelandCard variant="terminal" className="p-4">
      <div className="flex items-center justify-between mb-4">
        <WastelandText variant="subtitle" className="text-lg">
          TERRITORY MAP
        </WastelandText>
        <WastelandButton variant="primary" size="sm">
          CLAIM ZONE
        </WastelandButton>
      </div>
      
      <div className="grid grid-cols-10 gap-1 aspect-square max-w-md mx-auto mb-4">
        {Array.from({ length: 100 }, (_, i) => {
          const x = i % 10;
          const y = Math.floor(i / 10);
          const random = Math.random();
          const isEmpty = random > 0.4;
          const isOwned = !isEmpty && random > 0.75;
          const isAlliance = !isEmpty && !isOwned && random > 0.55;
          const isEnemy = !isEmpty && !isOwned && !isAlliance && random > 0.35;
          const isContested = !isEmpty && !isOwned && !isAlliance && !isEnemy;
          
          return (
            <button
              key={i}
              onClick={() => console.log('Territory action:', { x, y })}
              className={`
                aspect-square text-xs border transition-all duration-200 hover:scale-110 hover:z-10 relative
                ${isEmpty ? 'bg-gray-800 border-gray-700 hover:border-wasteland-orange' :
                  isOwned ? 'bg-green-600 border-green-400 animate-pulse' :
                  isAlliance ? 'bg-blue-600 border-blue-400' :
                  isEnemy ? 'bg-red-600 border-red-400' :
                  'bg-yellow-600 border-yellow-400 animate-pulse'}
              `}
            >
              {!isEmpty && (
                <span className="absolute inset-0 flex items-center justify-center">
                  {isOwned ? '👑' : isAlliance ? '🤝' : isEnemy ? '💀' : '⚔️'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-600"></div>
          <span className="text-green-400">YOURS</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-600"></div>
          <span className="text-blue-400">ALLIES</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-600"></div>
          <span className="text-red-400">ENEMIES</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-600"></div>
          <span className="text-yellow-400">WAR ZONES</span>
        </div>
      </div>
    </WastelandCard>
  );
};

export const SimpleSurvivorStatus = () => {
  return (
    <WastelandCard variant="default" className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-green-600 rounded border-2 border-green-400 flex items-center justify-center">
          <span className="text-lg font-bold">W</span>
        </div>
        <div>
          <WastelandText variant="subtitle" className="text-lg">
            WastelandSurvivor
          </WastelandText>
          <div className="flex gap-4 text-sm">
            <span className="text-green-400">LVL 12</span>
            <span className="text-blue-400">342 XP</span>
            <span className="text-yellow-400">8 WINS</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="pip-boy-screen p-2 text-center">
          <div className="text-green-400 font-mono">85%</div>
          <div className="text-xs">HEALTH</div>
        </div>
        <div className="pip-boy-screen p-2 text-center">
          <div className="text-red-400 font-mono">3</div>
          <div className="text-xs">TERRITORIES</div>
        </div>
      </div>

      <WastelandButton
        variant="secondary"
        size="sm"
        onClick={() => console.log('Connect wallet clicked')}
        className="w-full"
      >
        CONNECT WALLET
      </WastelandButton>
    </WastelandCard>
  );
};

export const SimpleAllianceControl = () => {
  return (
    <WastelandCard variant="rusted" className="p-4">
      <div className="flex items-center justify-between mb-3">
        <WastelandText variant="subtitle" className="text-lg">
          FACTION
        </WastelandText>
        <Badge className="bg-blue-600 text-white font-mono text-xs">
          LEADER
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-blue-400 font-semibold">Brotherhood of Steel</span>
          <span className="text-sm text-gray-400">3 members</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="pip-boy-screen p-2 text-center">
            <div className="text-blue-400 font-mono">12</div>
            <div className="text-gray-400">TERRITORIES</div>
          </div>
          <div className="pip-boy-screen p-2 text-center">
            <div className="text-green-400 font-mono">847</div>
            <div className="text-gray-400">POWER</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <WastelandButton variant="primary" size="sm" className="flex-1">
            INVITE
          </WastelandButton>
          <WastelandButton variant="secondary" size="sm" className="flex-1">
            ATTACK
          </WastelandButton>
        </div>
      </div>
    </WastelandCard>
  );
};

export const SimpleBattleInterface = () => {
  return (
    <WastelandCard variant="terminal" className="p-4">
      <div className="flex items-center justify-between mb-3">
        <WastelandText variant="subtitle" className="text-lg">
          COMBAT
        </WastelandText>
        <Badge className="bg-red-600 text-white font-mono text-xs animate-pulse">
          3 ACTIVE
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <WastelandButton
            variant="danger"
            size="sm"
            onClick={() => console.log('Attack clicked')}
          >
            ATTACK
          </WastelandButton>
          <WastelandButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('Defend clicked')}
          >
            DEFEND  
          </WastelandButton>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between items-center p-2 bg-red-900/30 border border-red-600 text-xs">
            <span className="text-red-400">vs VaultHunter</span>
            <span className="text-yellow-400">⚔️ FIGHTING</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-orange-900/30 border border-orange-600 text-xs">
            <span className="text-orange-400">vs Enclave</span>
            <span className="text-green-400">🏆 WON</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-800 border border-gray-600 text-xs">
            <span className="text-gray-400">vs Raiders</span>
            <span className="text-gray-400">⏳ PENDING</span>
          </div>
        </div>
      </div>
    </WastelandCard>
  );
};

export const SimpleCommunicationsInterface = () => {
  return (
    <WastelandCard variant="terminal" className="p-4">
      <div className="flex items-center justify-between mb-3">
        <WastelandText variant="subtitle" className="text-lg">
          RADIO
        </WastelandText>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-1 max-h-24 overflow-y-auto bg-gray-900 p-2 border border-green-600 text-xs">
          <div className="text-green-400 font-mono">
            <span className="text-yellow-400">Brotherhood:</span> Moving to sector 7
          </div>
          <div className="text-green-400 font-mono">
            <span className="text-red-400">Enclave:</span> Under attack!
          </div>
          <div className="text-green-400 font-mono">
            <span className="text-blue-400">VaultTec:</span> Emergency broadcast
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <WastelandButton
            variant="radiation"
            size="sm"
            onClick={() => console.log('Send message clicked')}
          >
            SEND
          </WastelandButton>
          <WastelandButton
            variant="secondary"
            size="sm"
            onClick={() => console.log('Scan clicked')}
          >
            SCAN
          </WastelandButton>
        </div>
      </div>
    </WastelandCard>
  );
};

export const SimpleWastelandLeaderboard = () => {
  const topUsers = [
    { id: 1, username: 'WastelandSurvivor', power: 847, territories: 3, color: 'text-yellow-400' },
    { id: 2, username: 'VaultHunter', power: 692, territories: 5, color: 'text-blue-400' },
    { id: 3, username: 'RadscorpionSlayer', power: 534, territories: 2, color: 'text-red-400' },
    { id: 4, username: 'Brotherhood', power: 421, territories: 8, color: 'text-green-400' },
    { id: 5, username: 'Enclave', power: 298, territories: 1, color: 'text-purple-400' }
  ];

  return (
    <WastelandCard variant="default" className="p-4">
      <WastelandText variant="subtitle" className="mb-3 text-lg">
        TOP PLAYERS
      </WastelandText>
      
      <div className="space-y-1">
        {topUsers.map((user, index) => (
          <div key={user.id} className="flex items-center justify-between p-2 bg-gray-800 border border-gray-700 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-4 h-4 flex items-center justify-center font-bold ${
                index === 0 ? 'bg-yellow-600 text-black' :
                index === 1 ? 'bg-gray-600 text-white' :
                index === 2 ? 'bg-orange-600 text-black' :
                'bg-gray-700 text-white'
              }`}>
                {index + 1}
              </span>
              <span className={`font-mono ${user.color}`}>{user.username}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span>{user.power}💪</span>
              <span>{user.territories}🏁</span>
            </div>
          </div>
        ))}
      </div>
    </WastelandCard>
  );
};