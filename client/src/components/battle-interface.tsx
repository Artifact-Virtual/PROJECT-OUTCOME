import { Trophy, X, Sword } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Battle {
  id: string;
  opponent: string;
  result: "victory" | "defeat";
  xpGained: number;
  timestamp: string;
}

export default function BattleInterface() {
  // Mock battle data
  const recentBattles: Battle[] = [
    {
      id: "1",
      opponent: "GHOST-3301",
      result: "victory",
      xpGained: 100,
      timestamp: "2 hours ago"
    },
    {
      id: "2", 
      opponent: "VIPER-1337",
      result: "defeat",
      xpGained: 25,
      timestamp: "5 hours ago"
    },
    {
      id: "3",
      opponent: "SHADOW-9999",
      result: "victory", 
      xpGained: 100,
      timestamp: "1 day ago"
    }
  ];

  const handleInitiateBattle = () => {
    // TODO: Implement battle initiation logic
    console.log("Initiating battle...");
  };

  return (
    <Card className="bg-card-bg border-border-gray terminal-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl text-cyber-blue">
          <div className="flex items-center">
            <Sword className="w-5 h-5 mr-2" />
            COMBAT PROTOCOL
          </div>
          <Button 
            onClick={handleInitiateBattle}
            className="px-4 py-2 bg-danger-red/20 border border-danger-red text-danger-red hover:bg-danger-red hover:text-white transition-all rounded font-semibold"
            data-testid="button-initiate-battle"
          >
            INITIATE BATTLE
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Recent battles */}
        <div className="space-y-3">
          {recentBattles.map((battle) => (
            <div 
              key={battle.id}
              className="flex items-center justify-between p-3 bg-darker-bg border border-border-gray rounded"
              data-testid={`battle-${battle.id}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 border rounded flex items-center justify-center ${
                  battle.result === 'victory' 
                    ? 'bg-toxic-green/20 border-toxic-green' 
                    : 'bg-danger-red/20 border-danger-red'
                }`}>
                  {battle.result === 'victory' ? (
                    <Trophy className="w-4 h-4 text-toxic-green" />
                  ) : (
                    <X className="w-4 h-4 text-danger-red" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm" data-testid={`battle-opponent-${battle.id}`}>
                    vs {battle.opponent}
                  </div>
                  <div className="text-xs text-gray-400" data-testid={`battle-timestamp-${battle.id}`}>
                    {battle.timestamp}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  className={`text-sm font-semibold mb-1 ${
                    battle.result === 'victory' 
                      ? 'bg-toxic-green/20 text-toxic-green border-toxic-green' 
                      : 'bg-danger-red/20 text-danger-red border-danger-red'
                  }`}
                  data-testid={`battle-result-${battle.id}`}
                >
                  {battle.result.toUpperCase()}
                </Badge>
                <div className="text-xs text-gray-400" data-testid={`battle-xp-${battle.id}`}>
                  +{battle.xpGained} XP
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Battle stats summary */}
        <div className="mt-6 p-3 bg-darker-bg border border-border-gray rounded">
          <h4 className="font-semibold text-sm text-cyber-blue mb-2">COMBAT STATISTICS</h4>
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="text-toxic-green font-bold">24</div>
              <div className="text-gray-400">Victories</div>
            </div>
            <div>
              <div className="text-danger-red font-bold">7</div>
              <div className="text-gray-400">Defeats</div>
            </div>
            <div>
              <div className="text-warning-orange font-bold">2,650</div>
              <div className="text-gray-400">Total XP</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
