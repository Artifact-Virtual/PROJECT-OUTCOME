import { Link } from "wouter";
import { WastelandText, WastelandButton } from "@/components/wasteland-ui";
import { 
  SimpleWastelandMap as WastelandMap, 
  SimpleSurvivorStatus as SurvivorStatus, 
  SimpleAllianceControl as AllianceControl, 
  SimpleBattleInterface as BattleInterface, 
  SimpleCommunicationsInterface as CommunicationsInterface, 
  SimpleWastelandLeaderboard as WastelandLeaderboard 
} from "@/components/simple-wasteland";
import { DarknetContinuumRelic } from "@/components/darknet-continuum";
import { SocialInteractionHub } from "@/components/social-interaction-hub";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="min-h-screen pb-16">
      {/* Quick Game Header */}
      <section className="relative py-8 border-b-2 border-wasteland-orange">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <WastelandText variant="title" glow className="text-4xl mb-2">
                WASTELAND CONTROL
              </WastelandText>
              <div className="flex gap-6 text-sm">
                <span className="text-radiation-green">⚡ ONLINE</span>
                <span className="text-steel-blue">📡 BASE NETWORK</span>
                <span className="text-toxic-yellow">⚔️ 3 BATTLES</span>
              </div>
            </div>
            <div className="flex gap-4">
              <WastelandButton variant="primary" size="sm">CLAIM TERRITORY</WastelandButton>
              <WastelandButton variant="danger" size="sm">START BATTLE</WastelandButton>
            </div>
          </div>
        </div>
      </section>

      {/* Main Operations Center */}
      <main className="relative container mx-auto px-6 py-8">
        {/* Quick Stats */}
        <section className="mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="pip-boy-screen p-3 text-center">
              <div className="text-2xl font-title text-wasteland-orange" data-testid="text-total-survivors">2,847</div>
              <div className="text-xs text-ash-gray">PLAYERS</div>
            </div>
            <div className="pip-boy-screen p-3 text-center">
              <div className="text-2xl font-title text-radiation-green" data-testid="text-total-territories">156</div>
              <div className="text-xs text-ash-gray">ZONES</div>
            </div>
            <div className="pip-boy-screen p-3 text-center">
              <div className="text-2xl font-title text-steel-blue" data-testid="text-total-alliances">89</div>
              <div className="text-xs text-ash-gray">FACTIONS</div>
            </div>
            <div className="pip-boy-screen p-3 text-center">
              <div className="text-2xl font-title text-rust-red" data-testid="text-total-battles">12,439</div>
              <div className="text-xs text-ash-gray">BATTLES</div>
            </div>
          </div>
        </section>

        {/* Control Panels */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-rusted-metal border-2 border-wasteland-orange mb-8">
            <TabsTrigger value="overview" className="font-title text-xs data-[state=active]:bg-wasteland-orange data-[state=active]:text-dark-wasteland">
              OVERVIEW
            </TabsTrigger>
            <TabsTrigger value="territories" className="font-title text-xs data-[state=active]:bg-wasteland-orange data-[state=active]:text-dark-wasteland">
              TERRITORIES  
            </TabsTrigger>
            <TabsTrigger value="combat" className="font-title text-xs data-[state=active]:bg-wasteland-orange data-[state=active]:text-dark-wasteland">
              COMBAT
            </TabsTrigger>
            <TabsTrigger value="factions" className="font-title text-xs data-[state=active]:bg-wasteland-orange data-[state=active]:text-dark-wasteland">
              FACTIONS
            </TabsTrigger>
            <TabsTrigger value="continuum" className="font-title text-xs data-[state=active]:bg-radiation-green data-[state=active]:text-dark-wasteland">
              CONTINUUM
            </TabsTrigger>
            <TabsTrigger value="communications" className="font-title text-xs data-[state=active]:bg-wasteland-orange data-[state=active]:text-dark-wasteland">
              COMMS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SurvivorStatus />
              </div>
              <div>
                <WastelandLeaderboard />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AllianceControl />
              <CommunicationsInterface />
            </div>
          </TabsContent>

          <TabsContent value="territories" className="space-y-6">
            <WastelandMap />
          </TabsContent>

          <TabsContent value="combat" className="space-y-6">
            <BattleInterface />
          </TabsContent>

          <TabsContent value="factions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AllianceControl />
              <WastelandLeaderboard />
            </div>
          </TabsContent>

          <TabsContent value="continuum" className="space-y-6">
            <DarknetContinuumRelic />
          </TabsContent>

          <TabsContent value="communications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommunicationsInterface />
              <SocialInteractionHub />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}