import { useState } from "react";
import { Map, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TerritoryStatus = "yours" | "alliance" | "neutral" | "enemy" | "unclaimed";

interface Territory {
  x: number;
  y: number;
  status: TerritoryStatus;
  owner?: string;
  controlledUntil?: Date;
}

const getStatusColor = (status: TerritoryStatus): string => {
  switch (status) {
    case "yours": return "bg-cyber-blue/20 border-cyber-blue hover:bg-cyber-blue/40";
    case "alliance": return "bg-toxic-green/20 border-toxic-green hover:bg-toxic-green/40";
    case "neutral": return "bg-warning-orange/20 border-warning-orange hover:bg-warning-orange/40";
    case "enemy": return "bg-danger-red/20 border-danger-red hover:bg-danger-red/40";
    case "unclaimed": return "bg-border-gray border-gray-600 hover:bg-gray-600/40";
  }
};

export default function TerritoryMap() {
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  // Generate a mock 8x6 grid
  const territories: Territory[] = [];
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 8; x++) {
      const statuses: TerritoryStatus[] = ["yours", "alliance", "neutral", "enemy", "unclaimed"];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      territories.push({ x, y, status });
    }
  }

  const handleTerritoryClick = (territory: Territory) => {
    setSelectedTerritory(territory);
  };

  const handleClaimTerritory = () => {
    // TODO: Implement territory claiming logic
    console.log("Claiming territory:", selectedTerritory);
  };

  return (
    <Card className="bg-card-bg border-border-gray terminal-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl text-cyber-blue">
          <div className="flex items-center">
            <Map className="w-5 h-5 mr-2" />
            TERRITORY CONTROL
          </div>
          <Button 
            className="px-3 py-1 bg-toxic-green/20 border border-toxic-green text-toxic-green text-sm rounded hover:bg-toxic-green hover:text-black transition-all"
            data-testid="button-claim-territory"
            onClick={handleClaimTerritory}
          >
            CLAIM TERRITORY
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Territory grid */}
        <div className="grid grid-cols-8 gap-1 mb-4" data-testid="territory-grid">
          {territories.map((territory, index) => (
            <div
              key={index}
              className={`aspect-square ${getStatusColor(territory.status)} border rounded cursor-pointer transition-all`}
              onClick={() => handleTerritoryClick(territory)}
              data-testid={`territory-${territory.x}-${territory.y}`}
              title={`Territory (${territory.x}, ${territory.y}) - ${territory.status}`}
            />
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyber-blue rounded" />
            <span>Your Territory</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-toxic-green rounded" />
            <span>Alliance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-orange rounded" />
            <span>Neutral</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-danger-red rounded" />
            <span>Enemy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-border-gray rounded" />
            <span>Unclaimed</span>
          </div>
        </div>

        {/* Selected territory info */}
        {selectedTerritory && (
          <div className="p-3 bg-darker-bg border border-border-gray rounded">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-cyber-blue">
                Territory ({selectedTerritory.x}, {selectedTerritory.y})
              </h4>
              <Badge 
                className={`${
                  selectedTerritory.status === 'yours' ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue' :
                  selectedTerritory.status === 'alliance' ? 'bg-toxic-green/20 text-toxic-green border-toxic-green' :
                  selectedTerritory.status === 'neutral' ? 'bg-warning-orange/20 text-warning-orange border-warning-orange' :
                  selectedTerritory.status === 'enemy' ? 'bg-danger-red/20 text-danger-red border-danger-red' :
                  'bg-gray-600/20 text-gray-400 border-gray-600'
                }`}
              >
                {selectedTerritory.status.toUpperCase()}
              </Badge>
            </div>
            <div className="text-sm text-gray-400">
              {selectedTerritory.status === 'unclaimed' ? (
                <p>This territory is available for claiming. Control lasts 24 hours.</p>
              ) : (
                <p>Status: {selectedTerritory.status} • Click to view details</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
