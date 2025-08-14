import { useState } from "react";
import { Link } from "wouter";
import { Shield, Users, Radio, Crown, User, Map, Trophy, X, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlayerStatus from "@/components/player-status";
import TerritoryMap from "@/components/territory-map";
import BattleInterface from "@/components/battle-interface";
import AllianceCard from "@/components/alliance-card";
import MessagingInterface from "@/components/messaging-interface";
import CourierInterface from "@/components/courier-interface";
import Leaderboard from "@/components/leaderboard";

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectWallet = () => {
    // TODO: Implement Web3 wallet connection
    setIsConnected(!isConnected);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border-gray bg-darker-bg/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and branding */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-cyber-blue/20 border border-cyber-blue rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-cyber-blue" />
              </div>
              <div>
                <h1 
                  className="text-2xl font-cyber font-bold text-cyber-blue text-shadow-cyber glitch-text relative" 
                  data-text="OCSH"
                >
                  OCSH
                </h1>
                <p className="text-sm text-gray-400">Onchain Survival Kit</p>
              </div>
            </div>
            
            {/* Connection status and wallet */}
            <div className="flex items-center space-x-4">
              {/* Network status */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-card-bg border border-toxic-green/30 rounded">
                <div className="w-2 h-2 bg-toxic-green rounded-full animate-pulse" />
                <span className="text-sm text-toxic-green">BASE NETWORK</span>
              </div>
              
              {/* Wallet connection */}
              <Button 
                onClick={handleConnectWallet}
                className="px-4 py-2 bg-cyber-blue/20 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black transition-all duration-300 rounded font-semibold"
                data-testid="button-connect-wallet"
              >
                {isConnected ? "CONNECTED" : "CONNECT WALLET"}
              </Button>
              
              {/* Handheld link */}
              <Link href="/handheld">
                <Button 
                  variant="outline"
                  className="px-4 py-2 bg-warning-orange/20 border border-warning-orange text-warning-orange hover:bg-warning-orange hover:text-black transition-all duration-300 rounded font-semibold"
                  data-testid="button-launch-handheld"
                >
                  <Radio className="w-4 h-4 mr-2" />
                  HANDHELD
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

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
