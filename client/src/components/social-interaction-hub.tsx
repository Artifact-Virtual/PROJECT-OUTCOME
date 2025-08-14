import { useState, useEffect } from "react";
import { WastelandText, WastelandButton } from "@/components/wasteland-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Types for social features
interface Player {
  id: number;
  username: string;
  xp: number;
  reputation: number;
  allianceId?: number;
  allianceName?: string;
  lastSeen: string;
  status: 'online' | 'away' | 'offline';
}

interface SocialMessage {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  type: 'public' | 'alliance' | 'private' | 'battle' | 'territory';
  timestamp: string;
  isOnChain: boolean;
  transactionHash?: string;
}

interface PlayerInteraction {
  playerId: number;
  playerName: string;
  type: 'battle_invite' | 'alliance_invite' | 'trade_request' | 'territory_challenge';
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface SocialEvent {
  id: number;
  type: 'battle_result' | 'territory_claimed' | 'alliance_formed' | 'achievement';
  playerName: string;
  description: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
}

export function SocialInteractionHub() {
  const [activeChannel, setActiveChannel] = useState<string>('global');
  const [messageInput, setMessageInput] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [interactionType, setInteractionType] = useState<string>('battle_invite');
  
  // Mock data that would be replaced with actual API calls
  const [onlinePlayers] = useState<Player[]>([
    { id: 1, username: 'WastelandWolf', xp: 2450, reputation: 89, allianceName: 'Iron Fists', lastSeen: 'now', status: 'online' },
    { id: 2, username: 'RadiationQueen', xp: 3120, reputation: 95, allianceName: 'Neon Runners', lastSeen: '2m ago', status: 'online' },
    { id: 3, username: 'ScrapLord', xp: 1890, reputation: 76, lastSeen: '5m ago', status: 'away' },
    { id: 4, username: 'VaultHunter92', xp: 2780, reputation: 88, allianceName: 'Steel Brotherhood', lastSeen: '1h ago', status: 'offline' },
  ]);

  const [recentMessages] = useState<SocialMessage[]>([
    { id: 1, senderId: 1, senderName: 'WastelandWolf', content: 'Anyone up for a territory battle in Sector 7?', type: 'public', timestamp: '2m ago', isOnChain: false },
    { id: 2, senderId: 2, senderName: 'RadiationQueen', content: 'Iron Fists alliance is recruiting! Join us for coordinated raids.', type: 'alliance', timestamp: '5m ago', isOnChain: true, transactionHash: '0x1a2b3c...' },
    { id: 3, senderId: 3, senderName: 'ScrapLord', content: 'Trading rare materials for energy cells. PM me!', type: 'public', timestamp: '8m ago', isOnChain: false },
  ]);

  const [pendingInteractions] = useState<PlayerInteraction[]>([
    { playerId: 1, playerName: 'WastelandWolf', type: 'battle_invite', message: 'Challenge you to a territory battle in Grid 15-C', timestamp: '3m ago', status: 'pending' },
    { playerId: 2, playerName: 'RadiationQueen', type: 'alliance_invite', message: 'Inviting you to join Neon Runners alliance', timestamp: '15m ago', status: 'pending' },
  ]);

  const [socialEvents] = useState<SocialEvent[]>([
    { id: 1, type: 'battle_result', playerName: 'VaultHunter92', description: 'Won epic battle against RadZone Marauders (+150 XP)', timestamp: '10m ago', impact: 'high' },
    { id: 2, type: 'territory_claimed', playerName: 'ScrapLord', description: 'Claimed Wasteland Depot in Grid 12-A', timestamp: '25m ago', impact: 'medium' },
    { id: 3, type: 'achievement', playerName: 'WastelandWolf', description: 'Achieved "Territory Master" (10 territories held)', timestamp: '1h ago', impact: 'high' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-radiation-green';
      case 'away': return 'bg-toxic-yellow';
      case 'offline': return 'bg-ash-gray';
      default: return 'bg-ash-gray';
    }
  };

  const getEventImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-wasteland-orange';
      case 'medium': return 'text-steel-blue';
      case 'low': return 'text-ash-gray';
      default: return 'text-ash-gray';
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'battle_invite': return '⚔️';
      case 'alliance_invite': return '🤝';
      case 'trade_request': return '💱';
      case 'territory_challenge': return '🏴';
      default: return '📬';
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // Implementation would send message via API
    console.log(`Sending ${activeChannel} message:`, messageInput);
    setMessageInput('');
  };

  const handlePlayerInteraction = () => {
    if (!selectedPlayer || !interactionType) return;
    // Implementation would send interaction request via API
    console.log(`Sending ${interactionType} to player ${selectedPlayer}`);
  };

  return (
    <div className="space-y-6">
      {/* Social Hub Header */}
      <div className="pip-boy-screen p-6">
        <div className="flex items-center justify-between mb-4">
          <WastelandText variant="subtitle" className="text-wasteland-orange">
            🌐 SOCIAL INTERACTION HUB
          </WastelandText>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-radiation-green border-radiation-green">
              {onlinePlayers.filter(p => p.status === 'online').length} Online
            </Badge>
            <Badge variant="outline" className="text-steel-blue border-steel-blue">
              {pendingInteractions.length} Pending
            </Badge>
          </div>
        </div>
        
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black border border-wasteland-orange">
            <TabsTrigger value="players" className="text-xs font-mono data-[state=active]:bg-wasteland-orange data-[state=active]:text-black">
              PLAYERS
            </TabsTrigger>
            <TabsTrigger value="messages" className="text-xs font-mono data-[state=active]:bg-wasteland-orange data-[state=active]:text-black">
              MESSAGES
            </TabsTrigger>
            <TabsTrigger value="interactions" className="text-xs font-mono data-[state=active]:bg-wasteland-orange data-[state=active]:text-black">
              REQUESTS
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs font-mono data-[state=active]:bg-wasteland-orange data-[state=active]:text-black">
              EVENTS
            </TabsTrigger>
          </TabsList>

          {/* Online Players & Status */}
          <TabsContent value="players" className="mt-4">
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {onlinePlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-black border border-steel-blue rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(player.status)}`} />
                      <div>
                        <div className="font-mono text-sm text-radiation-green">{player.username}</div>
                        <div className="text-xs text-ash-gray">
                          {player.allianceName ? `[${player.allianceName}]` : 'No Alliance'} • {player.xp} XP • Rep: {player.reputation}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <WastelandButton size="sm" variant="secondary" data-testid={`button-challenge-${player.id}`}>
                        ⚔️
                      </WastelandButton>
                      <WastelandButton size="sm" variant="secondary" data-testid={`button-message-${player.id}`}>
                        💬
                      </WastelandButton>
                      <WastelandButton size="sm" variant="secondary" data-testid={`button-invite-${player.id}`}>
                        🤝
                      </WastelandButton>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Communication Channels */}
          <TabsContent value="messages" className="mt-4">
            <div className="space-y-4">
              {/* Channel Selection */}
              <div className="flex gap-2">
                <WastelandButton 
                  size="sm" 
                  variant={activeChannel === 'global' ? 'primary' : 'secondary'}
                  onClick={() => setActiveChannel('global')}
                  data-testid="button-channel-global"
                >
                  🌍 Global
                </WastelandButton>
                <WastelandButton 
                  size="sm" 
                  variant={activeChannel === 'alliance' ? 'primary' : 'secondary'}
                  onClick={() => setActiveChannel('alliance')}
                  data-testid="button-channel-alliance"
                >
                  🏴 Alliance
                </WastelandButton>
                <WastelandButton 
                  size="sm" 
                  variant={activeChannel === 'trade' ? 'primary' : 'secondary'}
                  onClick={() => setActiveChannel('trade')}
                  data-testid="button-channel-trade"
                >
                  💱 Trade
                </WastelandButton>
              </div>

              {/* Message Feed */}
              <ScrollArea className="h-48 border border-steel-blue bg-black p-3">
                <div className="space-y-2">
                  {recentMessages
                    .filter(msg => activeChannel === 'global' || msg.type === activeChannel)
                    .map((message) => (
                    <div key={message.id} className="text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-radiation-green font-mono">{message.senderName}:</span>
                        {message.isOnChain && (
                          <Badge variant="outline" className="text-xs text-toxic-yellow border-toxic-yellow">
                            ON-CHAIN
                          </Badge>
                        )}
                      </div>
                      <div className="text-neutral-300 ml-2">{message.content}</div>
                      <div className="text-xs text-ash-gray ml-2">{message.timestamp}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Send message to ${activeChannel} channel...`}
                  className="flex-1 bg-black border-steel-blue text-neutral-100 font-mono text-sm"
                  data-testid="input-message"
                />
                <WastelandButton 
                  onClick={handleSendMessage}
                  size="sm"
                  variant="primary"
                  data-testid="button-send-message"
                >
                  SEND
                </WastelandButton>
              </div>
            </div>
          </TabsContent>

          {/* Player Interactions & Requests */}
          <TabsContent value="interactions" className="mt-4">
            <div className="space-y-4">
              {/* Quick Interaction Panel */}
              <div className="border border-steel-blue bg-black p-4 rounded">
                <WastelandText variant="body" className="mb-3 text-steel-blue">Quick Player Interaction</WastelandText>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                    <SelectTrigger className="bg-black border-steel-blue text-neutral-100" data-testid="select-player">
                      <SelectValue placeholder="Select Player" />
                    </SelectTrigger>
                    <SelectContent>
                      {onlinePlayers.filter(p => p.status === 'online').map((player) => (
                        <SelectItem key={player.id} value={player.username}>
                          {player.username} [{player.allianceName || 'No Alliance'}]
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={interactionType} onValueChange={setInteractionType}>
                    <SelectTrigger className="bg-black border-steel-blue text-neutral-100" data-testid="select-interaction-type">
                      <SelectValue placeholder="Interaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="battle_invite">⚔️ Battle Challenge</SelectItem>
                      <SelectItem value="alliance_invite">🤝 Alliance Invite</SelectItem>
                      <SelectItem value="trade_request">💱 Trade Request</SelectItem>
                      <SelectItem value="territory_challenge">🏴 Territory Challenge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <WastelandButton 
                  onClick={handlePlayerInteraction}
                  className="w-full"
                  variant="radiation"
                  data-testid="button-send-interaction"
                >
                  SEND INTERACTION REQUEST
                </WastelandButton>
              </div>

              {/* Pending Interactions */}
              <div>
                <WastelandText variant="body" className="mb-3 text-wasteland-orange">Pending Requests</WastelandText>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {pendingInteractions.map((interaction, index) => (
                      <div key={index} className="border border-steel-blue bg-black p-3 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getInteractionIcon(interaction.type)}</span>
                            <span className="font-mono text-radiation-green">{interaction.playerName}</span>
                            <Badge variant="outline" className="text-xs text-toxic-yellow border-toxic-yellow">
                              {interaction.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-xs text-ash-gray">{interaction.timestamp}</span>
                        </div>
                        <div className="text-sm text-neutral-300 mb-3">{interaction.message}</div>
                        <div className="flex gap-2">
                          <WastelandButton size="sm" variant="primary" data-testid={`button-accept-${index}`}>
                            ACCEPT
                          </WastelandButton>
                          <WastelandButton size="sm" variant="danger" data-testid={`button-decline-${index}`}>
                            DECLINE
                          </WastelandButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          {/* Live Social Events Feed */}
          <TabsContent value="events" className="mt-4">
            <div>
              <WastelandText variant="body" className="mb-3 text-steel-blue">Live Wasteland Events</WastelandText>
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {socialEvents.map((event) => (
                    <div key={event.id} className="border border-steel-blue bg-black p-3 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono ${getEventImpactColor(event.impact)}`}>
                            {event.playerName}
                          </span>
                          <Badge variant="outline" className="text-xs text-steel-blue border-steel-blue">
                            {event.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-xs text-ash-gray">{event.timestamp}</span>
                      </div>
                      <div className="text-sm text-neutral-300">{event.description}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Advanced Social Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Alliance Coordination */}
        <div className="pip-boy-screen p-4">
          <WastelandText variant="body" className="mb-3 text-wasteland-orange">🏴 Alliance Coordination</WastelandText>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ash-gray">Active Members:</span>
              <span className="text-radiation-green">8/12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ash-gray">Coordinated Battles:</span>
              <span className="text-steel-blue">3 scheduled</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ash-gray">Territory Holdings:</span>
              <span className="text-toxic-yellow">15 zones</span>
            </div>
            <Separator className="bg-steel-blue my-2" />
            <WastelandButton size="sm" className="w-full" variant="secondary" data-testid="button-alliance-battle-plan">
              📋 VIEW BATTLE PLANS
            </WastelandButton>
          </div>
        </div>

        {/* Reputation & Achievements */}
        <div className="pip-boy-screen p-4">
          <WastelandText variant="body" className="mb-3 text-steel-blue">🏆 Social Standing</WastelandText>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ash-gray">Global Rank:</span>
              <span className="text-wasteland-orange">#247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ash-gray">Alliance Rank:</span>
              <span className="text-radiation-green">#3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ash-gray">Social Score:</span>
              <span className="text-steel-blue">1,247</span>
            </div>
            <Separator className="bg-steel-blue my-2" />
            <WastelandButton size="sm" className="w-full" variant="secondary" data-testid="button-view-achievements">
              🎖️ VIEW ACHIEVEMENTS
            </WastelandButton>
          </div>
        </div>
      </div>
    </div>
  );
}