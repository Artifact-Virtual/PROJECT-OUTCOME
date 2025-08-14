import { Users, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AllianceCard() {
  // Mock alliance data
  const allianceData = {
    name: "WASTELAND",
    tag: "WL",
    memberCount: 47,
    userRole: "MEMBER",
    territoryCount: 23,
    rank: 3,
  };

  const handleAllianceComms = () => {
    // TODO: Implement alliance communication interface
    console.log("Opening alliance communications...");
  };

  return (
    <Card className="bg-card-bg border-border-gray terminal-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl text-cyber-blue">
          <span>ALLIANCE</span>
          <Users className="w-5 h-5 text-toxic-green" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-toxic-green/20 border-2 border-toxic-green rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl font-bold text-toxic-green" data-testid="text-alliance-tag">
              {allianceData.tag}
            </span>
          </div>
          <h4 className="text-lg font-bold text-toxic-green" data-testid="text-alliance-name">
            {allianceData.name}
          </h4>
          <p className="text-sm text-gray-400" data-testid="text-alliance-members">
            {allianceData.memberCount} survivors
          </p>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Your Role:</span>
            <Badge className="bg-warning-orange/20 text-warning-orange border-warning-orange" data-testid="text-user-role">
              {allianceData.userRole}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Territory Control:</span>
            <span className="text-cyber-blue" data-testid="text-alliance-territories">
              {allianceData.territoryCount}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Alliance Rank:</span>
            <span className="text-toxic-green" data-testid="text-alliance-rank">
              #{allianceData.rank}
            </span>
          </div>
        </div>
        
        <Button 
          onClick={handleAllianceComms}
          className="w-full px-4 py-2 bg-toxic-green/20 border border-toxic-green text-toxic-green hover:bg-toxic-green hover:text-black transition-all rounded font-semibold"
          data-testid="button-alliance-comms"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          ALLIANCE COMMS
        </Button>
      </CardContent>
    </Card>
  );
}
