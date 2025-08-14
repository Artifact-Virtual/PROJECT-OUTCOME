// TODO: Import hooks when implemented
// import { useGameState } from '@/hooks/use-game-state';
// import { useWeb3 } from '@/hooks/use-web3';
import { WastelandCard, WastelandButton, WastelandText, WastelandProgress } from './wasteland-ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Wasteland Territory Map Component
export const WastelandMap = () => {
  // Mock data for now
  const territories = [];
  const user = { id: 1 };
  
  const handleClaimTerritory = (x: number, y: number) => {
    console.log('Claiming territory:', { x, y });
  };

  return (
    <WastelandCard variant="terminal" className="p-6">
      <WastelandText variant="subtitle" className="mb-4 border-b border-rust-red pb-2">
        TERRITORIAL CONTROL
      </WastelandText>
      
      {/* Map Grid */}
      <div className="grid grid-cols-10 gap-1 aspect-square max-w-lg mx-auto mb-6">
        {Array.from({ length: 100 }, (_, i) => {
          const x = i % 10;
          const y = Math.floor(i / 10);
          const territory = territories?.find(t => t.x === x && t.y === y);
          const isOwned = territory?.userId === user?.id;
          const hasAlliance = territory?.status === 'alliance';
          const isContested = territory?.status === 'contested';
          
          return (
            <button
              key={i}
              onClick={() => handleClaimTerritory(x, y)}
              data-testid={`territory-${x}-${y}`}
              className={`
                aspect-square text-xs font-mono border relative overflow-hidden transition-all duration-300 hover:scale-110 hover:z-10
                ${!territory ? 'bg-charred-earth border-ash-gray hover:bg-rusted-metal hover:border-wasteland-orange' :
                  isOwned ? 'bg-wasteland-orange border-burnt-amber shadow-amber animate-radiation-pulse' :
                  hasAlliance ? 'bg-steel-blue border-radiation-green' :
                  isContested ? 'bg-blood-maroon border-rust-red animate-wasteland-glitch' :
                  'bg-corroded-steel border-ash-gray'}
              `}
            >
              {territory && (
                <span className="absolute inset-0 flex items-center justify-center text-shadow-wasteland">
                  {isOwned ? '⚡' : hasAlliance ? '🤝' : isContested ? '⚔️' : '🏴'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Territory Legend */}
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

// Survivor Status Component
export const SurvivorStatus = () => {
  // Mock data for now
  const user = { 
    id: 1, 
    username: 'WastelandSurvivor', 
    xp: 342, 
    wins: 8 
  };
  const account = null;
  const isConnected = false;
  
  const connectWallet = () => {
    console.log('Connect wallet clicked');
  };

  if (!user) {
    return (
      <WastelandCard variant="radiation" className="p-6 text-center">
        <WastelandText variant="warning" className="mb-4">
          VAULT-TEC AUTHENTICATION REQUIRED
        </WastelandText>
        <WastelandButton
          variant="radiation"
          onClick={connectWallet}
          disabled={!isConnected}
          glitch
          data-testid="button-connect-wallet"
        >
          {isConnected ? 'CONNECT WALLET' : 'ENABLE WEB3'}
        </WastelandButton>
      </WastelandCard>
    );
  }

  return (
    <WastelandCard variant="default" className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-wasteland-orange rounded-full border-2 border-rust-red flex items-center justify-center animate-hologram-flicker">
          <span className="text-2xl font-title text-dark-wasteland">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <WastelandText variant="subtitle" glow>
            {user.username}
          </WastelandText>
          <WastelandText variant="terminal" className="mt-1">
            VAULT DWELLER #{user.id.toString().padStart(4, '0')}
          </WastelandText>
        </div>
      </div>

      {/* Survivor Stats */}
      <div className="space-y-4">
        <WastelandProgress 
          value={user.xp} 
          max={1000} 
          label="EXPERIENCE" 
          variant="xp" 
        />
        <WastelandProgress 
          value={user.wins} 
          max={Math.max(user.wins + 5, 20)} 
          label="VICTORIES" 
          variant="health" 
        />
        <WastelandProgress 
          value={85} 
          max={100} 
          label="HEALTH" 
          variant="health" 
        />
        <WastelandProgress 
          value={15} 
          max={100} 
          label="RADIATION" 
          variant="radiation" 
        />
      </div>

      {/* Wallet Connection */}
      <div className="mt-6 pt-4 border-t border-rust-red">
        <WastelandText variant="terminal" className="mb-2">
          WALLET: {account ? 
            `${account.slice(0, 6)}...${account.slice(-4)}` : 
            'DISCONNECTED'
          }
        </WastelandText>
        {!account && (
          <WastelandButton
            variant="secondary"
            size="sm"
            onClick={connectWallet}
            className="w-full"
            data-testid="button-connect-wallet"
          >
            CONNECT WALLET
          </WastelandButton>
        )}
      </div>
    </WastelandCard>
  );
};

// Alliance System Component
export const AllianceControl = () => {
  // Mock data for now
  const alliances = [
    { 
      id: 1, 
      name: 'Brotherhood of Steel', 
      members: [
        { userId: 1, user: { username: 'WastelandSurvivor' }, role: 'leader' }
      ] 
    }
  ];
  const user = { id: 1 };
  
  const createAlliance = {
    mutate: (data: any) => console.log('Creating alliance:', data),
    isPending: false
  };
  
  const joinAlliance = {
    mutate: (data: any) => console.log('Joining alliance:', data)
  };
  
  const userAlliance = alliances.find(a => a.members.some(m => m.userId === user.id));

  return (
    <WastelandCard variant="rusted" className="p-6">
      <WastelandText variant="subtitle" className="mb-4 border-b border-burnt-amber pb-2">
        FACTION ALLIANCES
      </WastelandText>
      
      {userAlliance ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <WastelandText variant="body" className="text-burnt-amber font-semibold">
              {userAlliance.name}
            </WastelandText>
            <Badge className="bg-steel-blue text-dark-wasteland font-mono text-xs">
              {userAlliance.members?.length || 0} MEMBERS
            </Badge>
          </div>
          
          <WastelandText variant="terminal">
            STATUS: ACTIVE MEMBER
          </WastelandText>
          
          <div className="space-y-2">
            <WastelandText variant="body" className="text-sm text-ash-gray">
              FACTION MEMBERS:
            </WastelandText>
            {userAlliance.members?.map((member) => (
              <div key={member.userId} className="flex justify-between text-sm font-mono">
                <span className="text-foreground">{member.user.username}</span>
                <span className="text-steel-blue">{member.role.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <WastelandText variant="body" className="text-ash-gray">
            You are not part of any faction. Form alliances to control more territory.
          </WastelandText>
          
          <div className="grid gap-2">
            <WastelandButton
              variant="primary"
              onClick={() => createAlliance.mutate({ name: `Faction-${Date.now()}` })}
              disabled={createAlliance.isPending}
              data-testid="button-create-alliance"
            >
              CREATE FACTION
            </WastelandButton>
            <WastelandButton
              variant="secondary"
              disabled
              data-testid="button-join-alliance"
            >
              JOIN FACTION
            </WastelandButton>
          </div>
        </div>
      )}
      
      {/* Available Alliances */}
      {alliances && alliances.length > 0 && (
        <div className="mt-6 pt-4 border-t border-burnt-amber">
          <WastelandText variant="body" className="text-sm text-ash-gray mb-3">
            ACTIVE FACTIONS:
          </WastelandText>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {alliances.slice(0, 5).map((alliance) => (
              <div key={alliance.id} className="flex justify-between items-center p-2 bg-charred-earth border border-ash-gray">
                <span className="text-sm font-mono text-foreground">{alliance.name}</span>
                <span className="text-xs text-steel-blue">{alliance.members?.length || 0} members</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </WastelandCard>
  );
};

// Battle Interface Component
export const BattleInterface = () => {
  // Mock data for now
  const battles = [
    { 
      id: 1, 
      challengerId: 1, 
      challengedId: 2, 
      status: 'active' 
    }
  ];
  const user = { id: 1 };
  
  const createBattle = {
    mutate: (data: any) => console.log('Creating battle:', data),
    isPending: false
  };
  
  const userBattles = battles.filter(b => 
    b.challengerId === user.id || b.challengedId === user.id
  );

  return (
    <WastelandCard variant="terminal" className="p-6">
      <WastelandText variant="subtitle" className="mb-4 border-b border-rust-red pb-2">
        COMBAT OPERATIONS
      </WastelandText>
      
      <div className="space-y-4">
        <WastelandButton
          variant="danger"
          onClick={() => createBattle.mutate({ challengedId: 1 })}
          disabled={createBattle.isPending}
          glitch
          data-testid="button-create-battle"
        >
          INITIATE COMBAT
        </WastelandButton>
        
        {userBattles.length > 0 && (
          <div className="space-y-2">
            <WastelandText variant="body" className="text-sm text-ash-gray">
              ACTIVE CONFLICTS:
            </WastelandText>
            {userBattles.slice(0, 3).map((battle) => (
              <div key={battle.id} className="p-3 bg-blood-maroon/20 border border-rust-red">
                <div className="flex justify-between items-center text-sm font-mono">
                  <span className="text-foreground">
                    Battle #{battle.id}
                  </span>
                  <Badge className={`text-xs ${
                    battle.status === 'active' ? 'bg-rust-red' :
                    battle.status === 'completed' ? 'bg-wasteland-orange' :
                    'bg-ash-gray'
                  }`}>
                    {battle.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WastelandCard>
  );
};

// Communications Interface Component
export const CommunicationsInterface = () => {
  // Mock data for now
  const messages = [
    {
      id: 1,
      content: 'Emergency broadcast system test',
      sender: { username: 'VaultTec' },
      createdAt: new Date().toISOString()
    }
  ];
  const user = { id: 1 };
  
  const sendMessage = {
    mutate: (data: any) => console.log('Sending message:', data),
    isPending: false
  };
  
  const recentMessages = messages.slice(0, 5);

  return (
    <WastelandCard variant="terminal" className="p-6">
      <WastelandText variant="subtitle" className="mb-4 border-b border-radiation-green pb-2">
        RADIO COMMUNICATIONS
      </WastelandText>
      
      <div className="space-y-4">
        {/* Message Feed */}
        <div className="space-y-2 max-h-40 overflow-y-auto bg-charred-earth/50 p-3 border border-radiation-green">
          {recentMessages.length > 0 ? recentMessages.map((message) => (
            <div key={message.id} className="text-sm font-mono">
              <span className="text-radiation-green">
                [{new Date(message.createdAt).toLocaleTimeString()}]
              </span>
              <span className="text-burnt-amber ml-2">{message.sender.username}:</span>
              <span className="text-foreground ml-2">{message.content}</span>
            </div>
          )) : (
            <WastelandText variant="terminal" className="text-center text-ash-gray">
              NO ACTIVE TRANSMISSIONS
            </WastelandText>
          )}
        </div>
        
        <WastelandButton
          variant="radiation"
          onClick={() => sendMessage.mutate({ 
            content: "Testing emergency broadcast system...",
            recipientId: null 
          })}
          disabled={sendMessage.isPending}
          data-testid="button-send-message"
        >
          BROADCAST MESSAGE
        </WastelandButton>
      </div>
    </WastelandCard>
  );
};

// Leaderboard Component
export const WastelandLeaderboard = () => {
  // Mock data for now
  const users = [
    { id: 1, username: 'WastelandSurvivor', xp: 342, wins: 8 },
    { id: 2, username: 'VaultHunter', xp: 289, wins: 12 },
    { id: 3, username: 'RadscorpionSlayer', xp: 245, wins: 6 },
    { id: 4, username: 'Brotherhood', xp: 198, wins: 15 },
    { id: 5, username: 'Enclave', xp: 167, wins: 4 }
  ];
  
  const topUsers = users.sort((a, b) => b.xp - a.xp).slice(0, 10);

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