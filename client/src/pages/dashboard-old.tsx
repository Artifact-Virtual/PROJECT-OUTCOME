import { useState } from "react";
import { Link } from "wouter";
import { WastelandText, WastelandButton } from "@/components/wasteland-ui";
import { 
  WastelandMap, 
  SurvivorStatus, 
  AllianceControl, 
  BattleInterface, 
  CommunicationsInterface, 
  WastelandLeaderboard 
} from "@/components/wasteland-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Hero section */}
        <section className="mb-12 text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-7xl font-cyber font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-toxic-green to-warning-orange animate-flicker">
              SURVIVAL PROTOCOL
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Enter the post-apocalyptic world where only the strongest survive. Control territories, forge alliances, and dominate the wasteland.
            </p>
          </div>
          
          {/* Quick stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-card-bg border border-border-gray p-4 rounded-lg terminal-border">
              <div className="text-2xl font-bold text-cyber-blue" data-testid="text-total-survivors">2,847</div>
              <div className="text-sm text-gray-400">SURVIVORS</div>
            </div>
            <div className="bg-card-bg border border-border-gray p-4 rounded-lg terminal-border">
              <div className="text-2xl font-bold text-toxic-green" data-testid="text-total-territories">156</div>
              <div className="text-sm text-gray-400">TERRITORIES</div>
            </div>
            <div className="bg-card-bg border border-border-gray p-4 rounded-lg terminal-border">
              <div className="text-2xl font-bold text-warning-orange" data-testid="text-total-alliances">89</div>
              <div className="text-sm text-gray-400">ALLIANCES</div>
            </div>
            <div className="bg-card-bg border border-border-gray p-4 rounded-lg terminal-border">
              <div className="text-2xl font-bold text-danger-red" data-testid="text-total-battles">12,439</div>
              <div className="text-sm text-gray-400">BATTLES</div>
            </div>
          </div>
        </section>

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left column - Player status and territory map */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Player status card */}
            <PlayerStatus />
            
            {/* Territory control map */}
            <TerritoryMap />
            
            {/* Battle system */}
            <BattleInterface />
            
          </div>
          
          {/* Right column - Alliance and messaging */}
          <div className="space-y-8">
            
            {/* Alliance status */}
            <AllianceCard />
            
            {/* Messaging system */}
            <MessagingInterface />
            
            {/* Foundry Courier Integration */}
            <CourierInterface />
            
            {/* Leaderboard */}
            <Leaderboard />
            
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-gray bg-darker-bg/90 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold text-cyber-blue mb-4">SURVIVAL PROTOCOL</h4>
              <p className="text-gray-400 text-sm">
                The post-apocalyptic Web3 gaming experience where survival depends on strategy, alliances, and technological resilience.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-toxic-green mb-4">SYSTEMS</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Territory Control</li>
                <li>Alliance Formation</li>
                <li>Battle Mechanics</li>
                <li>On-Chain Messaging</li>
                <li>Offline Transactions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-warning-orange mb-4">NETWORK</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Base Network</li>
                <li>Foundry Courier</li>
                <li>IPFS Storage</li>
                <li>ENS Domains</li>
                <li>Offline-First</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border-gray mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2024 OCSH - Onchain Survival Kit. Built for the post-digital wasteland.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
