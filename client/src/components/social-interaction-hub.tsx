import { useState, useEffect } from "react";
import { RealisticText, RealisticButton, RealisticWastelandCard } from "@/components/realistic-wasteland";
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
  const [interactionType, setInteractionType] = useState<string>('');

  // Mock data - replace with real API calls
  const onlinePlayers: Player[] = [
    { id: 1, username: "VaultHunter47", xp: 2847, reputation: 156, allianceId: 1, allianceName: "Brotherhood", lastSeen: "2m ago", status: 'online' },
    { id: 2, username: "WastelandRaider", xp: 1923, reputation: 89, lastSeen: "5m ago", status: 'online' },
    { id: 3, username: "SurvivalExpert", xp: 3421, reputation: 203, allianceId: 2, allianceName: "Outcasts", lastSeen: "1h ago", status: 'away' },
    { id: 4, username: "TechScavenger", xp: 1456, reputation: 67, lastSeen: "3h ago", status: 'offline' }
  ];

  const socialMessages: SocialMessage[] = [
    { id: 1, senderId: 1, senderName: "VaultHunter47", content: "Territory raid at sector 7 in 30 minutes", type: 'public', timestamp: "2m ago", isOnChain: true, transactionHash: "0x123..." },
    { id: 2, senderId: 3, senderName: "SurvivalExpert", content: "Alliance meeting tonight", type: 'alliance', timestamp: "15m ago", isOnChain: false },
    { id: 3, senderId: 2, senderName: "WastelandRaider", content: "Trading rare materials at outpost", type: 'public', timestamp: "45m ago", isOnChain: true }
  ];

  const pendingInteractions: PlayerInteraction[] = [
    { playerId: 2, playerName: "WastelandRaider", type: 'battle_invite', message: "1v1 combat challenge", timestamp: "10m ago", status: 'pending' },
    { playerId: 3, playerName: "SurvivalExpert", type: 'alliance_invite', message: "Join our faction", timestamp: "1h ago", status: 'pending' }
  ];

  const recentEvents: SocialEvent[] = [
    { id: 1, type: 'territory_claimed', playerName: "VaultHunter47", description: "claimed sector 15", timestamp: "5m ago", impact: 'high' },
    { id: 2, type: 'battle_result', playerName: "WastelandRaider", description: "won against TechScavenger", timestamp: "12m ago", impact: 'medium' },
    { id: 3, type: 'alliance_formed', playerName: "SurvivalExpert", description: "formed new alliance 'Outcasts'", timestamp: "2h ago", impact: 'high' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-emerald-400';
      case 'away': return 'text-amber-400';
      case 'offline': return 'text-neutral-500';
      default: return 'text-neutral-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return '●';
      case 'away': return '◐';
      case 'offline': return '○';
      default: return '○';
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
    console.log(`Sending ${activeChannel} message:`, messageInput);
    setMessageInput('');
  };

  const handlePlayerInteraction = () => {
    if (!selectedPlayer || !interactionType) return;
    console.log(`Sending ${interactionType} to player ${selectedPlayer}`);
  };

  return (
    <RealisticWastelandCard variant="default" className="p-6">
      <RealisticText variant="subtitle" className="mb-6">
        Social Interaction Hub
      </RealisticText>

      <Tabs defaultValue="players" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-neutral-900 border border-neutral-700">
          <TabsTrigger 
            value="players" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Players
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Messages
          </TabsTrigger>
          <TabsTrigger 
            value="events" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Events
          </TabsTrigger>
          <TabsTrigger 
            value="alliance" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Alliance
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Online Players & Status */}
        <TabsContent value="players" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <RealisticText variant="caption" className="text-neutral-400">
                {onlinePlayers.filter(p => p.status === 'online').length} online • {onlinePlayers.length} total
              </RealisticText>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
                {pendingInteractions.length} pending
              </Badge>
            </div>
            
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {onlinePlayers.map((player) => (
                  <div key={player.id} className="p-3 bg-neutral-800 border border-neutral-700 rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${getStatusColor(player.status)}`}>
                          {getStatusIcon(player.status)}
                        </span>
                        <div>
                          <RealisticText variant="body" className="font-medium">
                            {player.username}
                          </RealisticText>
                          <div className="flex gap-4 text-xs text-neutral-500">
                            <span>XP: {player.xp.toLocaleString()}</span>
                            <span>Rep: {player.reputation}</span>
                            {player.allianceName && <span>[{player.allianceName}]</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <RealisticButton size="sm" variant="secondary" data-testid={`button-challenge-${player.id}`}>
                          ⚔️
                        </RealisticButton>
                        <RealisticButton size="sm" variant="secondary" data-testid={`button-message-${player.id}`}>
                          💬
                        </RealisticButton>
                        <RealisticButton size="sm" variant="secondary" data-testid={`button-invite-${player.id}`}>
                          🤝
                        </RealisticButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Multi-Channel Communication */}
        <TabsContent value="messages" className="mt-4">
          <div className="space-y-4">
            {/* Channel Selection */}
            <div className="flex gap-2">
              <RealisticButton 
                size="sm" 
                variant={activeChannel === 'global' ? 'primary' : 'secondary'}
                onClick={() => setActiveChannel('global')}
                data-testid="button-channel-global"
              >
                🌍 Global
              </RealisticButton>
              <RealisticButton 
                size="sm" 
                variant={activeChannel === 'alliance' ? 'primary' : 'secondary'}
                onClick={() => setActiveChannel('alliance')}
                data-testid="button-channel-alliance"
              >
                🏴 Alliance
              </RealisticButton>
              <RealisticButton 
                size="sm" 
                variant={activeChannel === 'trade' ? 'primary' : 'secondary'}
                onClick={() => setActiveChannel('trade')}
                data-testid="button-channel-trade"
              >
                💱 Trade
              </RealisticButton>
            </div>

            {/* Message Feed */}
            <ScrollArea className="h-48 bg-neutral-900 border border-neutral-700 p-3">
              <div className="space-y-2">
                {socialMessages.filter(msg => 
                  activeChannel === 'global' ? msg.type === 'public' :
                  activeChannel === 'alliance' ? msg.type === 'alliance' :
                  msg.type === 'public'
                ).map((message) => (
                  <div key={message.id} className="p-2 bg-neutral-800 border border-neutral-700 rounded text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-neutral-300 font-medium">{message.senderName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">{message.timestamp}</span>
                        {message.isOnChain && (
                          <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/30">
                            On-Chain
                          </Badge>
                        )}
                      </div>
                    </div>
                    <RealisticText variant="caption" className="text-neutral-400">
                      {message.content}
                    </RealisticText>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder={`Send ${activeChannel} message...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-neutral-100"
                data-testid="input-message"
              />
              <RealisticButton 
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                data-testid="button-send-message"
              >
                Send
              </RealisticButton>
            </div>
          </div>
        </TabsContent>

        {/* Live Social Events */}
        <TabsContent value="events" className="mt-4">
          <div className="space-y-4">
            <RealisticText variant="body" className="text-neutral-300">
              Live Activity Feed
            </RealisticText>
            
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {recentEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-neutral-800 border border-neutral-700 rounded">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              event.impact === 'high' ? 'text-red-400 border-red-400/30' :
                              event.impact === 'medium' ? 'text-amber-400 border-amber-400/30' :
                              'text-neutral-400 border-neutral-400/30'
                            }`}
                          >
                            {event.type}
                          </Badge>
                          <span className="text-xs text-neutral-500">{event.timestamp}</span>
                        </div>
                        <RealisticText variant="caption" className="text-neutral-300">
                          <span className="text-neutral-100">{event.playerName}</span> {event.description}
                        </RealisticText>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Alliance Coordination */}
        <TabsContent value="alliance" className="mt-4">
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 border border-neutral-700 rounded">
              <RealisticText variant="subtitle" className="mb-3">
                Alliance Status
              </RealisticText>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Current Alliance:</span>
                  <span className="text-neutral-100">Brotherhood</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Rank:</span>
                  <span className="text-amber-400">Lieutenant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Members Online:</span>
                  <span className="text-emerald-400">7/23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Territory Holdings:</span>
                  <span className="text-amber-400">15 zones</span>
                </div>
              </div>
              <Separator className="bg-neutral-700 my-2" />
              <RealisticButton size="sm" className="w-full" variant="secondary" data-testid="button-alliance-battle-plan">
                📋 View Battle Plans
              </RealisticButton>
            </div>
          </div>
        </TabsContent>

        {/* Player Profile & Achievements */}
        <TabsContent value="profile" className="mt-4">
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 border border-neutral-700 rounded">
              <RealisticText variant="subtitle" className="mb-3">
                Player Statistics
              </RealisticText>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total XP:</span>
                  <span className="text-neutral-100">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Battles Won:</span>
                  <span className="text-emerald-400">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Territories Claimed:</span>
                  <span className="text-amber-400">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Social Score:</span>
                  <span className="text-neutral-300">1,247</span>
                </div>
              </div>
              <Separator className="bg-neutral-700 my-2" />
              <RealisticButton size="sm" className="w-full" variant="secondary" data-testid="button-view-achievements">
                🎖️ View Achievements
              </RealisticButton>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </RealisticWastelandCard>
  );
}