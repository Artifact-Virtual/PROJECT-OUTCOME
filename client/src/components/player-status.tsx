import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function PlayerStatus() {
  // Mock player data - in real app, this would come from game state
  const playerData = {
    callSign: "RUNNER-7749",
    level: 12,
    xp: 14750,
    xpToNext: 1250,
    xpForNextLevel: 16000,
    winRate: 78,
    reputation: 2847,
  };

  const xpProgress = ((playerData.xpToNext / (playerData.xpForNextLevel - playerData.xp + playerData.xpToNext)) * 100);

  return (
    <Card className="bg-card-bg border-border-gray terminal-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl text-cyber-blue">
          <span>SURVIVOR STATUS</span>
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-toxic-green" />
            <span className="text-toxic-green font-semibold" data-testid="text-call-sign">
              {playerData.callSign}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-orange" data-testid="text-player-level">
              {playerData.level}
            </div>
            <div className="text-xs text-gray-400">LEVEL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyber-blue" data-testid="text-player-xp">
              {playerData.xp.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-toxic-green" data-testid="text-player-winrate">
              {playerData.winRate}%
            </div>
            <div className="text-xs text-gray-400">WIN RATE</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-danger-red" data-testid="text-player-reputation">
              {playerData.reputation.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">REPUTATION</div>
          </div>
        </div>
        
        {/* XP Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">XP TO NEXT LEVEL</span>
            <span className="text-cyber-blue" data-testid="text-xp-to-next">
              {playerData.xpToNext.toLocaleString()} XP
            </span>
          </div>
          <Progress 
            value={xpProgress} 
            className="w-full bg-border-gray h-2 rounded-full"
            data-testid="progress-xp"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Level {playerData.level}</span>
            <span>Level {playerData.level + 1}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
