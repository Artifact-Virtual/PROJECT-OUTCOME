import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RealisticTerritoryMap,
  RealisticPlayerStatus, 
  RealisticBattleInterface, 
  RealisticCommunications, 
  RealisticLeaderboard,
  RealisticWastelandCard,
  RealisticText,
  RealisticButton
} from "@/components/realistic-wasteland";
import { ProtocolGrid } from "@/components/holographic-protocol";
import { SocialInteractionHub } from "../components/social-interaction-hub";
import { TradingInterface } from "../components/trading-interface";
import { NFTGate } from "@/pages/nft-gate";

export default function RealisticDashboard() {
  return (
    <NFTGate>
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top Bar */}
      <header className="border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-neutral-700 border border-neutral-600 flex items-center justify-center">
                <span className="text-neutral-300 text-sm">◉</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Onchain Survival Kit</h1>
                <p className="text-xs text-neutral-400 uppercase tracking-wider">Wasteland Operations Terminal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-neutral-400">
                <span className="text-neutral-500">Network:</span> <span className="text-emerald-400">CONNECTED</span>
              </div>
              <Link href="/handheld">
                <RealisticButton variant="secondary" size="sm">
                  Handheld Terminal
                </RealisticButton>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Status Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-4 gap-6">
            <RealisticWastelandCard variant="dark" className="p-4 text-center">
              <div className="text-2xl font-bold text-neutral-100 font-mono">2,847</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider">Active Survivors</div>
            </RealisticWastelandCard>
            <RealisticWastelandCard variant="dark" className="p-4 text-center">
              <div className="text-2xl font-bold text-neutral-100 font-mono">156</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider">Controlled Zones</div>
            </RealisticWastelandCard>
            <RealisticWastelandCard variant="dark" className="p-4 text-center">
              <div className="text-2xl font-bold text-neutral-100 font-mono">89</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider">Active Factions</div>
            </RealisticWastelandCard>
            <RealisticWastelandCard variant="dark" className="p-4 text-center">
              <div className="text-2xl font-bold text-neutral-100 font-mono">12,439</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider">Total Engagements</div>
            </RealisticWastelandCard>
          </div>
        </section>

        {/* Main Interface */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-neutral-900 border border-neutral-700 h-12">
            <TabsTrigger 
              value="overview" 
              className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="territories" 
              className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
            >
              Territories
            </TabsTrigger>
            <TabsTrigger 
              value="combat" 
              className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
            >
              Combat
            </TabsTrigger>
            <TabsTrigger 
              value="factions" 
              className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
            >
              Factions
            </TabsTrigger>
            <TabsTrigger 
              value="trading" 
              className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
            >
              Trading
            </TabsTrigger>
            <TabsTrigger 
              value="communications" 
              className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
            >
              Comms
            </TabsTrigger>
            <TabsTrigger 
              value="continuum" 
              className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-600 data-[state=active]:text-neutral-100"
            >
              Continuum
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RealisticPlayerStatus />
              </div>
              <div>
                <RealisticLeaderboard />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RealisticBattleInterface />
              <RealisticCommunications />
            </div>
          </TabsContent>

          <TabsContent value="territories" className="space-y-6 mt-8">
            <RealisticTerritoryMap />
          </TabsContent>

          <TabsContent value="combat" className="space-y-6 mt-8">
            <RealisticBattleInterface />
          </TabsContent>

          <TabsContent value="factions" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealisticWastelandCard variant="default" className="p-6">
                <RealisticText variant="subtitle" className="mb-4">Alliance Management</RealisticText>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <RealisticText variant="body">Current Alliance</RealisticText>
                    <RealisticText variant="body" className="font-mono text-neutral-100">WASTELAND_BROTHERHOOD</RealisticText>
                  </div>
                  <div className="flex justify-between items-center">
                    <RealisticText variant="body">Role</RealisticText>
                    <RealisticText variant="body" className="text-amber-400">LIEUTENANT</RealisticText>
                  </div>
                  <div className="flex justify-between items-center">
                    <RealisticText variant="body">Members</RealisticText>
                    <RealisticText variant="body">24 Active</RealisticText>
                  </div>
                  <div className="pt-4 space-y-2">
                    <RealisticButton variant="primary" className="w-full" size="sm">
                      Alliance Operations
                    </RealisticButton>
                    <RealisticButton variant="ghost" className="w-full" size="sm">
                      Leave Alliance
                    </RealisticButton>
                  </div>
                </div>
              </RealisticWastelandCard>
              <RealisticLeaderboard />
            </div>
          </TabsContent>

          <TabsContent value="continuum" className="space-y-6 mt-8">
            <RealisticWastelandCard variant="dark" className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-neutral-800 border border-neutral-600 flex items-center justify-center">
                  <span className="text-lg text-neutral-400">📡</span>
                </div>
                <div>
                  <RealisticText variant="title" className="text-neutral-100">
                    OCSH Protocol Archives
                  </RealisticText>
                  <RealisticText variant="caption" className="text-neutral-500">
                    Classified: Offline Blockchain Protocols
                  </RealisticText>
                </div>
              </div>
              
              <ProtocolGrid />
              
              <div className="mt-6 p-4 bg-neutral-900 border border-neutral-700">
                <RealisticText variant="caption" className="text-neutral-400 leading-relaxed">
                  The true essence of blockchain is independent of the internet. If one route fails, 
                  a resilient network seeks another path. As long as data can be transferred, value can be transferred.
                </RealisticText>
              </div>
            </RealisticWastelandCard>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6 mt-8">
            <TradingInterface />
          </TabsContent>

          <TabsContent value="communications" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealisticCommunications />
              <SocialInteractionHub />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
    </NFTGate>
  );
}