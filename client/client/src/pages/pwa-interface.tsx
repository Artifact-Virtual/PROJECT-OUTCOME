import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RealisticWastelandCard,
  RealisticText,
  RealisticButton,
  RealisticCommunications
} from "@/components/realistic-wasteland";
import { ContinuumTerminal } from "@/components/continuum-terminal";
import { PWAInventory } from "@/components/pwa-inventory";


export default function PWAInterface() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOnline, setIsOnline] = useState(true);
  const [screenMode, setScreenMode] = useState<'wasteland' | 'terminal'>('wasteland');
  
  // PWA Detection
  const [isPWA, setIsPWA] = useState(false);
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    setIsPWA(isStandalone || isFullscreen);
  }, []);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Stats data
  const stats = {
    survivors: '2,847',
    zones: '156',
    factions: '89',
    engagements: '12,439'
  };

  // OCSH Protocol data
  const protocols = [
    { name: 'BONE NET', description: 'Mesh networking for P2P comms', status: 'OPERATIONAL' },
    { name: 'RADIO BURST', description: 'Emergency broadcast system', status: 'OPERATIONAL' },
    { name: 'SATELLITE LINK', description: 'High-orbit relay network', status: 'DEGRADED' },
    { name: 'USB SNEAKERNET', description: 'Physical data transport', status: 'OPERATIONAL' },
    { name: 'HAM RADIO', description: 'Low-frequency voice comms', status: 'OPERATIONAL' },
    { name: 'SMS GATEWAY', description: 'Cellular backup channel', status: 'OFFLINE' }
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      {/* Header with mode toggle */}
      <header className="bg-neutral-900 border-b border-neutral-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                <span className="text-neutral-400">📱</span>
              </div>
              <div>
                <h1 className="text-lg font-bold font-mono">OCSH</h1>
                <p className="text-xs text-neutral-500 uppercase">
                  {screenMode === 'wasteland' ? 'Wasteland Operations' : 'Terminal'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-neutral-800 border border-neutral-700 rounded">
                <button
                  onClick={() => setScreenMode('wasteland')}
                  className={`px-3 py-1.5 text-xs font-mono uppercase ${
                    screenMode === 'wasteland' 
                      ? 'bg-amber-600 text-black' 
                      : 'text-neutral-400'
                  }`}
                >
                  WASTELAND
                </button>
                <button
                  onClick={() => setScreenMode('terminal')}
                  className={`px-3 py-1.5 text-xs font-mono uppercase ${
                    screenMode === 'terminal' 
                      ? 'bg-amber-600 text-black' 
                      : 'text-neutral-400'
                  }`}
                >
                  TERMINAL
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Subheader with title */}
      <div className="bg-neutral-900/50 border-b border-neutral-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-800 border border-neutral-700 p-1">
              <div className="w-full h-full bg-neutral-700"></div>
            </div>
            <div>
              <h2 className="text-base font-semibold">Onchain Survival Kit</h2>
              <p className="text-xs text-neutral-500">WASTELAND OPERATIONS TERMINAL</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500">Network:</span>
            <span className={isOnline ? 'text-emerald-400' : 'text-red-400'}>
              {isOnline ? 'CONNECTED' : 'OFFLINE'}
            </span>
            <Link href="/handheld">
              <button className="ml-2 px-3 py-1 bg-neutral-800 border border-neutral-700 text-xs">
                Handheld Terminal
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-900 border border-neutral-800 p-3 text-center">
            <div className="text-xl font-bold font-mono">{stats.survivors}</div>
            <div className="text-xs text-neutral-500 uppercase">Active Survivors</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-3 text-center">
            <div className="text-xl font-bold font-mono">{stats.zones}</div>
            <div className="text-xs text-neutral-500 uppercase">Controlled Zones</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-3 text-center">
            <div className="text-xl font-bold font-mono">{stats.factions}</div>
            <div className="text-xs text-neutral-500 uppercase">Active Factions</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 p-3 text-center">
            <div className="text-xl font-bold font-mono">{stats.engagements}</div>
            <div className="text-xs text-neutral-500 uppercase">Total Engagements</div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-neutral-900 border border-neutral-700 h-10">
            <TabsTrigger 
              value="overview" 
              className="text-xs font-mono uppercase data-[state=active]:bg-neutral-700"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="territories" 
              className="text-xs font-mono uppercase data-[state=active]:bg-neutral-700"
            >
              Territories
            </TabsTrigger>
            <TabsTrigger 
              value="combat" 
              className="text-xs font-mono uppercase data-[state=active]:bg-neutral-700"
            >
              Combat
            </TabsTrigger>
            <TabsTrigger 
              value="factions" 
              className="text-xs font-mono uppercase data-[state=active]:bg-neutral-700"
            >
              Factions
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="text-xs font-mono uppercase data-[state=active]:bg-blue-600"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger 
              value="continuum" 
              className="text-xs font-mono uppercase data-[state=active]:bg-amber-600"
            >
              Continuum
            </TabsTrigger>
            <TabsTrigger 
              value="comms" 
              className="text-xs font-mono uppercase data-[state=active]:bg-neutral-700"
            >
              Comms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <RealisticWastelandCard variant="dark" className="p-4">
              <h3 className="text-sm font-semibold mb-3">Survivor Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400">CallSign</span>
                  <span className="text-xs font-mono text-neutral-100">GHOST_PROTOCOL</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-neutral-400">Experience</span>
                    <span className="text-xs text-neutral-400">2,847 XP</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2">
                    <div className="bg-amber-600 h-2" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center">
                    <div className="text-lg font-bold font-mono">12</div>
                    <div className="text-xs text-neutral-500">Territories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold font-mono">8</div>
                    <div className="text-xs text-neutral-500">Victories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold font-mono">45</div>
                    <div className="text-xs text-neutral-500">Rank</div>
                  </div>
                </div>
              </div>
            </RealisticWastelandCard>

            <RealisticWastelandCard variant="dark" className="p-4">
              <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-amber-400">⚔</span>
                  <span className="text-neutral-400">Victory at Sector 7</span>
                  <span className="text-neutral-600 ml-auto">2h ago</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400">🏴</span>
                  <span className="text-neutral-400">Territory claimed: Zone A-12</span>
                  <span className="text-neutral-600 ml-auto">5h ago</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-400">📡</span>
                  <span className="text-neutral-400">Alliance message received</span>
                  <span className="text-neutral-600 ml-auto">8h ago</span>
                </div>
              </div>
            </RealisticWastelandCard>
          </TabsContent>

          <TabsContent value="territories" className="mt-4">
            <RealisticWastelandCard variant="dark" className="p-4">
              <h3 className="text-sm font-semibold mb-3">Territory Control</h3>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square border ${
                      i % 3 === 0 
                        ? 'bg-amber-900/20 border-amber-600' 
                        : i % 5 === 0
                        ? 'bg-red-900/20 border-red-600'
                        : 'bg-neutral-900 border-neutral-700'
                    }`}
                  >
                    <div className="text-xs text-center mt-1 text-neutral-600">
                      {String.fromCharCode(65 + Math.floor(i / 4))}{i % 4 + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-900/20 border border-amber-600"></div>
                  <span className="text-neutral-500">Controlled</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-900/20 border border-red-600"></div>
                  <span className="text-neutral-500">Enemy</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-neutral-900 border border-neutral-700"></div>
                  <span className="text-neutral-500">Neutral</span>
                </div>
              </div>
            </RealisticWastelandCard>
          </TabsContent>

          <TabsContent value="combat" className="mt-4">
            <RealisticWastelandCard variant="dark" className="p-4">
              <h3 className="text-sm font-semibold mb-3">Battle Interface</h3>
              <div className="space-y-3">
                <div className="bg-neutral-900 border border-neutral-700 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-neutral-400">Target Zone</span>
                    <span className="text-xs font-mono text-amber-400">B-7</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-neutral-400">Alliance Power</span>
                    <span className="text-xs font-mono text-emerald-400">8,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-400">Enemy Power</span>
                    <span className="text-xs font-mono text-red-400">7,200</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-red-600 text-black font-bold text-sm uppercase">
                  Initiate Attack
                </button>
                <div className="text-xs text-neutral-500 text-center">
                  Victory chance: 73% • Cost: 500 resources
                </div>
              </div>
            </RealisticWastelandCard>
          </TabsContent>

          <TabsContent value="factions" className="mt-4">
            <RealisticWastelandCard variant="dark" className="p-4">
              <h3 className="text-sm font-semibold mb-3">Alliance Management</h3>
              <div className="space-y-3">
                <div className="bg-neutral-900 border border-neutral-700 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-neutral-400">Current Alliance</span>
                    <span className="text-xs font-mono text-neutral-100">WASTELAND_BROTHERHOOD</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-neutral-400">Role</span>
                    <span className="text-xs font-mono text-amber-400">LIEUTENANT</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-400">Members Online</span>
                    <span className="text-xs font-mono text-emerald-400">24/45</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2 bg-neutral-800 border border-neutral-700 text-xs">
                    Alliance Ops
                  </button>
                  <button className="py-2 bg-neutral-800 border border-neutral-700 text-xs text-red-400">
                    Leave Alliance
                  </button>
                </div>
              </div>
            </RealisticWastelandCard>
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <PWAInventory />
          </TabsContent>

          <TabsContent value="continuum" className="mt-4">
            <div className="px-0">
              <ContinuumTerminal />
            </div>
          </TabsContent>

          <TabsContent value="comms" className="mt-4">
            <RealisticCommunications />
            <RealisticWastelandCard variant="dark" className="p-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">Alliance Channel</h3>
              <div className="space-y-2">
                <div className="bg-neutral-900 border border-neutral-700 p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-400">Active Members</span>
                    <span className="text-xs font-mono text-emerald-400">24 Online</span>
                  </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-700 p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-400">Territory Status</span>
                    <span className="text-xs font-mono text-amber-400">Secured</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-neutral-800 border border-neutral-700 text-xs">
                  Open Alliance Channel
                </button>
              </div>
            </RealisticWastelandCard>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-amber-400">⚡ POWER: 85%</span>
            <span className="text-neutral-400">📡 SIGNAL: SEARCHING...</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-red-400">☢ RAD: LOW</span>
            <span className="text-neutral-500 font-mono">23:04:46 UTC</span>
          </div>
        </div>
      </div>

      {/* Handheld Terminal Section */}
      {screenMode === 'terminal' && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="bg-neutral-900 border-b border-neutral-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Handheld Terminal</h2>
                <p className="text-xs text-neutral-500">Offline transaction processing via radio/mesh networks</p>
              </div>
              <button
                onClick={() => setScreenMode('wasteland')}
                className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-xs"
              >
                Back
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-32 h-48 bg-neutral-800 border-2 border-neutral-600 mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AV Blokboy 1000</h3>
              <p className="text-sm text-neutral-400 mb-6">
                Offline transaction processing via radio/mesh networks
              </p>
              <Link href="/handheld">
                <button className="px-6 py-3 bg-amber-600 text-black font-bold uppercase">
                  Launch Terminal Interface
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}