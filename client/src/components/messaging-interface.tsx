import { useState } from "react";
import { Wifi, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  channel: "global" | "alliance";
}

export default function MessagingInterface() {
  const [newMessage, setNewMessage] = useState("");
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  
  // Mock messaging data
  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "GHOST-3301",
      content: "Enemy alliance spotted in sector 7. Moving to intercept.",
      timestamp: "3m ago",
      channel: "global"
    },
    {
      id: "2", 
      sender: "VIPER-1337",
      content: "Territory claim successful. Coordinates locked in.",
      timestamp: "7m ago",
      channel: "global"
    },
    {
      id: "3",
      sender: "SHADOW-9999", 
      content: "Need backup at waypoint Alpha. Under heavy fire.",
      timestamp: "12m ago",
      channel: "alliance"
    }
  ]);

  const messagingStats = {
    nextCost: "0.0011 ETH",
    cooldown: "45s",
    messageCount: 12
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || isOnCooldown) return;
    
    // TODO: Implement on-chain messaging with anti-spam logic
    console.log("Sending message:", newMessage);
    setNewMessage("");
    setIsOnCooldown(true);
    
    // Simulate cooldown
    setTimeout(() => setIsOnCooldown(false), 60000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-card-bg border-border-gray terminal-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl text-cyber-blue">
          <span>COMMS</span>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Wifi className="w-4 h-4" />
            <span>On-Chain</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Message history */}
        <ScrollArea className="h-48 mb-4" data-testid="message-history">
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id}
                className="p-3 bg-darker-bg border border-border-gray rounded text-sm"
                data-testid={`message-${message.id}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className={`font-semibold ${
                      message.channel === 'alliance' ? 'text-toxic-green' : 'text-cyber-blue'
                    }`}
                    data-testid={`message-sender-${message.id}`}
                  >
                    {message.sender}
                  </span>
                  <span className="text-xs text-gray-500" data-testid={`message-timestamp-${message.id}`}>
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-gray-300" data-testid={`message-content-${message.id}`}>
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Message input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Next msg cost: <span className="text-warning-orange" data-testid="text-next-cost">
                {messagingStats.nextCost}
              </span>
            </span>
            <span>
              Cooldown: <span className={`${isOnCooldown ? 'text-danger-red' : 'text-gray-400'}`} data-testid="text-cooldown">
                {isOnCooldown ? messagingStats.cooldown : "Ready"}
              </span>
            </span>
          </div>
          <div className="flex space-x-2">
            <Input 
              type="text" 
              placeholder="Enter message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-darker-bg border-border-gray text-white placeholder-gray-500 focus:border-cyber-blue"
              disabled={isOnCooldown}
              data-testid="input-message"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isOnCooldown}
              className="px-4 py-2 bg-cyber-blue/20 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black transition-all rounded font-semibold"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
