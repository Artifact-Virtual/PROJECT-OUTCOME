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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="min-h-screen pb-16">
      {/* Wasteland Welcome */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-wasteland-atmosphere opacity-40" />
        <div className="relative container mx-auto px-6 text-center">
          <WastelandText 
            variant="title" 
            glow 
            glitch 
            className="text-6xl md:text-8xl mb-4"
            data-text="WELCOME TO THE WASTELAND"
          >
            WELCOME TO THE WASTELAND
          </WastelandText>
          <WastelandText variant="body" className="text-xl md:text-2xl text-ash-gray max-w-3xl mx-auto">
            Survive. Adapt. Conquer. The old world is gone. Build your legacy in the ashes.
          </WastelandText>
          <div className="mt-8 flex gap-4 justify-center">
            <div className="flex items-center gap-2 text-radiation-green animate-pulse">
              <div className="w-2 h-2 bg-radiation-green rounded-full" />
              <WastelandText variant="terminal">SYSTEMS ONLINE</WastelandText>
            </div>
            <div className="flex items-center gap-2 text-wasteland-orange">
              <div className="w-2 h-2 bg-wasteland-orange rounded-full animate-radiation-pulse" />
              <WastelandText variant="terminal">BASE NETWORK</WastelandText>
            </div>
          </div>
        </div>
      </section>

      {/* Main Operations Center */}
      <main className="relative container mx-auto px-6 py-8">
        {/* Wasteland Statistics */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="pip-boy-screen p-4 text-center">
              <div className="text-3xl font-title text-wasteland-orange mb-1 animate-hologram-flicker" data-testid="text-total-survivors">2,847</div>
              <WastelandText variant="terminal">ACTIVE SURVIVORS</WastelandText>
            </div>
            <div className="pip-boy-screen p-4 text-center">
              <div className="text-3xl font-title text-radiation-green mb-1 animate-radiation-pulse" data-testid="text-total-territories">156</div>
              <WastelandText variant="terminal">CLAIMED ZONES</WastelandText>
            </div>
            <div className="pip-boy-screen p-4 text-center">
              <div className="text-3xl font-title text-steel-blue mb-1" data-testid="text-total-alliances">89</div>
              <WastelandText variant="terminal">ACTIVE FACTIONS</WastelandText>
            </div>
            <div className="pip-boy-screen p-4 text-center">
              <div className="text-3xl font-title text-rust-red mb-1 animate-wasteland-glitch" data-testid="text-total-battles">12,439</div>
              <WastelandText variant="terminal">TOTAL CONFLICTS</WastelandText>
            </div>
          </div>
        </section>

        {/* Control Panels */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-rusted-metal border-2 border-wasteland-orange mb-8">
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

          <TabsContent value="communications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommunicationsInterface />
              <div className="space-y-6">
                <Link href="/handheld" data-testid="link-handheld-terminal">
                  <div className="pip-boy-screen p-8 text-center hover:shadow-radiation transition-all duration-300 cursor-pointer">
                    <div className="text-6xl mb-4">📡</div>
                    <WastelandText variant="subtitle" className="mb-2">
                      HANDHELD TERMINAL
                    </WastelandText>
                    <WastelandText variant="body" className="text-ash-gray">
                      Access offline blockchain transactions via radio/mesh networks
                    </WastelandText>
                    <WastelandButton variant="radiation" className="mt-4">
                      LAUNCH TERMINAL
                    </WastelandButton>
                  </div>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}