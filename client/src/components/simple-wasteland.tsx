import { Link } from "wouter";
import { WastelandText, WastelandButton, WastelandCard, WastelandProgress } from "./wasteland-ui";
import { Badge } from "@/components/ui/badge";

// Simplified components with mock data for visual demonstration

export const SimpleWastelandMap = () => {
  return (
    <WastelandCard variant="terminal" className="p-6">
      <WastelandText variant="subtitle" className="mb-4 border-b border-rust-red pb-2">
        TERRITORIAL CONTROL
      </WastelandText>
      
      <div className="grid grid-cols-10 gap-1 aspect-square max-w-lg mx-auto mb-6">
        {Array.from({ length: 100 }, (_, i) => {
          const x = i % 10;
          const y = Math.floor(i / 10);
          const random = Math.random();
          const isEmpty = random > 0.3;
          const isOwned = !isEmpty && random > 0.8;
          const isAlliance = !isEmpty && !isOwned && random > 0.6;
          const isContested = !isEmpty && !isOwned && !isAlliance;
          
          return (
            <button
              key={i}
              onClick={() => console.log('Claiming territory:', { x, y })}
              className={`
                aspect-square text-xs font-mono border relative overflow-hidden transition-all duration-300 hover:scale-110 hover:z-10
                ${isEmpty ? 'bg-charred-earth border-ash-gray hover:bg-rusted-metal hover:border-wasteland-orange' :
                  isOwned ? 'bg-wasteland-orange border-burnt-amber shadow-amber animate-radiation-pulse' :
                  isAlliance ? 'bg-steel-blue border-radiation-green' :
                  'bg-blood-maroon border-rust-red animate-wasteland-glitch'}
              `}
            >
              {!isEmpty && (
                <span className="absolute inset-0 flex items-center justify-center text-shadow-wasteland">
                  {isOwned ? '⚡' : isAlliance ? '🤝' : '⚔️'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-charred-earth border border-ash-gray"></div>
          <span className="text-ash-gray">UNCLAIMED</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-wasteland-orange border border-burnt-amber"></div>
          <span className="text-wasteland-orange">YOUR TERRITORY</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-steel-blue border border-radiation-green"></div>
          <span className="text-steel-blue">ALLIANCE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blood-maroon border border-rust-red"></div>
          <span className="text-rust-red">CONTESTED</span>
        </div>
      </div>
    </WastelandCard>
  );
};

export const SimpleSurvivorStatus = () => {
  return (
    <WastelandCard variant="default" className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-wasteland-orange rounded-full border-2 border-rust-red flex items-center justify-center animate-hologram-flicker">
          <span className="text-2xl font-title text-dark-wasteland">W</span>
        </div>
        <div>
          <WastelandText variant="subtitle" glow>
            WastelandSurvivor
          </WastelandText>
          <WastelandText variant="terminal" className="mt-1">
            VAULT DWELLER #0001
          </WastelandText>
        </div>
      </div>

      <div className="space-y-4">
        <WastelandProgress value={342} max={1000} label="EXPERIENCE" variant="xp" />
        <WastelandProgress value={8} max={25} label="VICTORIES" variant="health" />
        <WastelandProgress value={85} max={100} label="HEALTH" variant="health" />
        <WastelandProgress value={15} max={100} label="RADIATION" variant="radiation" />
      </div>

      <div className="mt-6 pt-4 border-t border-rust-red">
        <WastelandText variant="terminal" className="mb-2">
          WALLET: DISCONNECTED
        </WastelandText>
        <WastelandButton
          variant="secondary"
          size="sm"
          onClick={() => console.log('Connect wallet clicked')}
          className="w-full"
        >
          CONNECT WALLET
        </WastelandButton>
      </div>
    </WastelandCard>
  );
};

export const SimpleAllianceControl = () => {
  return (
    <WastelandCard variant="rusted" className="p-6">
      <WastelandText variant="subtitle" className="mb-4 border-b border-burnt-amber pb-2">
        FACTION ALLIANCES
      </WastelandText>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <WastelandText variant="body" className="text-burnt-amber font-semibold">
            Brotherhood of Steel
          </WastelandText>
          <Badge className="bg-steel-blue text-dark-wasteland font-mono text-xs">
            3 MEMBERS
          </Badge>
        </div>
        
        <WastelandText variant="terminal">
          STATUS: ACTIVE MEMBER
        </WastelandText>
        
        <div className="space-y-2">
          <WastelandText variant="body" className="text-sm text-ash-gray">
            FACTION MEMBERS:
          </WastelandText>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-foreground">WastelandSurvivor</span>
            <span className="text-steel-blue">LEADER</span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-foreground">VaultHunter</span>
            <span className="text-steel-blue">MEMBER</span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span className="text-foreground">RadscorpionSlayer</span>
            <span className="text-steel-blue">MEMBER</span>
          </div>
        </div>
      </div>
    </WastelandCard>
  );
};

export const SimpleBattleInterface = () => {
  return (
    <WastelandCard variant="terminal" className="p-6">
      <WastelandText variant="subtitle" className="mb-4 border-b border-rust-red pb-2">
        COMBAT OPERATIONS
      </WastelandText>
      
      <div className="space-y-4">
        <WastelandButton
          variant="danger"
          onClick={() => console.log('Initiate combat clicked')}
          glitch
        >
          INITIATE COMBAT
        </WastelandButton>
        
        <div className="space-y-2">
          <WastelandText variant="body" className="text-sm text-ash-gray">
            ACTIVE CONFLICTS:
          </WastelandText>
          <div className="p-3 bg-blood-maroon/20 border border-rust-red">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-foreground">Battle #001</span>
              <Badge className="bg-rust-red text-xs">ACTIVE</Badge>
            </div>
          </div>
          <div className="p-3 bg-blood-maroon/10 border border-ash-gray">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-foreground">Battle #002</span>
              <Badge className="bg-wasteland-orange text-dark-wasteland text-xs">COMPLETED</Badge>
            </div>
          </div>
        </div>
      </div>
    </WastelandCard>
  );
};

export const SimpleCommunicationsInterface = () => {
  return (
    <WastelandCard variant="terminal" className="p-6">
      <WastelandText variant="subtitle" className="mb-4 border-b border-radiation-green pb-2">
        RADIO COMMUNICATIONS
      </WastelandText>
      
      <div className="space-y-4">
        <div className="space-y-2 max-h-40 overflow-y-auto bg-charred-earth/50 p-3 border border-radiation-green">
          <div className="text-sm font-mono">
            <span className="text-radiation-green">[22:14:32]</span>
            <span className="text-burnt-amber ml-2">VaultTec:</span>
            <span className="text-foreground ml-2">Emergency broadcast system test</span>
          </div>
          <div className="text-sm font-mono">
            <span className="text-radiation-green">[22:13:15]</span>
            <span className="text-burnt-amber ml-2">Brotherhood:</span>
            <span className="text-foreground ml-2">All units report to checkpoint alpha</span>
          </div>
          <div className="text-sm font-mono">
            <span className="text-radiation-green">[22:11:47]</span>
            <span className="text-burnt-amber ml-2">Enclave:</span>
            <span className="text-foreground ml-2">Hostile activity detected in sector 7</span>
          </div>
        </div>
        
        <WastelandButton
          variant="radiation"
          onClick={() => console.log('Broadcast message clicked')}
        >
          BROADCAST MESSAGE
        </WastelandButton>
      </div>
    </WastelandCard>
  );
};

export const SimpleWastelandLeaderboard = () => {
  const topUsers = [
    { id: 1, username: 'WastelandSurvivor', xp: 342, wins: 8 },
    { id: 2, username: 'VaultHunter', xp: 289, wins: 12 },
    { id: 3, username: 'RadscorpionSlayer', xp: 245, wins: 6 },
    { id: 4, username: 'Brotherhood', xp: 198, wins: 15 },
    { id: 5, username: 'Enclave', xp: 167, wins: 4 }
  ];

  return (
    <WastelandCard variant="default" className="p-6">
      <WastelandText variant="subtitle" className="mb-4 border-b border-wasteland-orange pb-2">
        SURVIVOR RANKINGS
      </WastelandText>
      
      <div className="space-y-2">
        {topUsers.map((user, index) => (
          <div key={user.id} className="flex items-center justify-between p-2 bg-rusted-metal border border-ash-gray">
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-wasteland-orange text-dark-wasteland' :
                index === 1 ? 'bg-burnt-amber text-dark-wasteland' :
                index === 2 ? 'bg-rust-red text-foreground' :
                'bg-ash-gray text-foreground'
              }`}>
                {index + 1}
              </span>
              <span className="font-mono text-foreground">{user.username}</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono">
              <span className="text-burnt-amber">{user.xp} XP</span>
              <span className="text-radiation-green">{user.wins} WINS</span>
            </div>
          </div>
        ))}
      </div>
    </WastelandCard>
  );
};