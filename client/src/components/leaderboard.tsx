import { Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LeaderboardEntry {
  rank: number;
  callSign: string;
  score: number;
  isCurrentPlayer?: boolean;
}

export default function Leaderboard() {
  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, callSign: "APEX-0001", score: 47291 },
    { rank: 2, callSign: "NOVA-2112", score: 41867 },
    { rank: 3, callSign: "ZERO-7777", score: 38203 },
    { rank: 4, callSign: "CYBER-KNIGHT", score: 35420 },
    { rank: 5, callSign: "QUANTUM-X", score: 32891 },
  ];

  const currentPlayer: LeaderboardEntry = {
    rank: 47,
    callSign: "RUNNER-7749",
    score: 14750,
    isCurrentPlayer: true
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1) return "text-warning-orange";
    if (rank === 2) return "text-gray-400";
    if (rank === 3) return "text-orange-600";
    return "text-gray-500";
  };

  return (
    <Card className="bg-card-bg border-border-gray terminal-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl text-cyber-blue">
          <span>LEADERBOARD</span>
          <Crown className="w-5 h-5 text-warning-orange" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.map((player) => (
            <div 
              key={player.rank}
              className="flex items-center justify-between p-2 bg-darker-bg border border-border-gray rounded text-sm"
              data-testid={`leaderboard-rank-${player.rank}`}
            >
              <div className="flex items-center space-x-3">
                <span 
                  className={`font-bold w-6 ${getRankColor(player.rank)}`}
                  data-testid={`rank-${player.rank}`}
                >
                  {player.rank}
                </span>
                <span 
                  className="text-gray-300"
                  data-testid={`callsign-${player.rank}`}
                >
                  {player.callSign}
                </span>
              </div>
              <span 
                className="text-toxic-green font-semibold"
                data-testid={`score-${player.rank}`}
              >
                {player.score.toLocaleString()}
              </span>
            </div>
          ))}
          
          <div className="border-t border-border-gray pt-2">
            <div className="flex items-center justify-between p-2 bg-cyber-blue/10 border border-cyber-blue rounded text-sm">
              <div className="flex items-center space-x-3">
                <span 
                  className="text-cyber-blue font-bold w-6"
                  data-testid="current-player-rank"
                >
                  {currentPlayer.rank}
                </span>
                <span 
                  className="text-cyber-blue"
                  data-testid="current-player-callsign"
                >
                  {currentPlayer.callSign}
                </span>
                <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue text-xs">
                  YOU
                </Badge>
              </div>
              <span 
                className="text-cyber-blue font-semibold"
                data-testid="current-player-score"
              >
                {currentPlayer.score.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
