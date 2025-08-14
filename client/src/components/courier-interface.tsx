import { Radio, Zap, Shield } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CourierInterface() {
  return (
    <Card className="bg-card-bg border-border-gray terminal-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl text-cyber-blue">
          <span>COURIER</span>
          <div className="flex items-center space-x-2 text-sm text-warning-orange">
            <Radio className="w-4 h-4" />
            <span>Offline Ready</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-darker-bg border border-border-gray rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Handheld Terminal</span>
              <div className="w-2 h-2 bg-toxic-green rounded-full animate-pulse" />
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Foundry Courier backend active. Ready for offline transactions.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm"
                className="px-3 py-2 bg-warning-orange/20 border border-warning-orange text-warning-orange text-xs rounded hover:bg-warning-orange hover:text-black transition-all"
                data-testid="button-encode-tx-quick"
              >
                <Zap className="w-3 h-3 mr-1" />
                ENCODE TX
              </Button>
              <Button 
                size="sm"
                className="px-3 py-2 bg-toxic-green/20 border border-toxic-green text-toxic-green text-xs rounded hover:bg-toxic-green hover:text-black transition-all"
                data-testid="button-decode-frames-quick"
              >
                <Shield className="w-3 h-3 mr-1" />
                DECODE FRAMES
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Supported channels:</span>
              <span className="text-cyber-blue">Radio, SMS, Mesh</span>
            </div>
            <div className="flex justify-between">
              <span>Error correction:</span>
              <span className="text-toxic-green">CRC32 + Parity</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <Badge className="bg-toxic-green/20 text-toxic-green border-toxic-green text-xs">
                OPERATIONAL
              </Badge>
            </div>
          </div>
          
          <Link href="/handheld">
            <Button 
              className="w-full px-4 py-2 bg-cyber-blue/20 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black transition-all rounded font-semibold text-sm"
              data-testid="button-launch-handheld-full"
            >
              <Radio className="w-4 h-4 mr-2" />
              LAUNCH HANDHELD
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
