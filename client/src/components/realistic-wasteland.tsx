import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Realistic Wasteland Components - No cartoon aesthetics
export const RealisticWastelandCard = ({ children, className = "", variant = "default" }: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "metal";
}) => {
  const baseClasses = "border border-neutral-600 bg-neutral-900/95 backdrop-blur-sm";
  const variants = {
    default: "border-neutral-700 bg-neutral-800/90",
    dark: "border-neutral-800 bg-black/95",
    metal: "border-neutral-600 bg-neutral-900/95 shadow-lg"
  };
  
  return (
    <Card className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </Card>
  );
};

export const RealisticText = ({ children, className = "", variant = "body" }: {
  children: React.ReactNode;
  className?: string;
  variant?: "title" | "subtitle" | "body" | "terminal" | "caption";
}) => {
  const variants = {
    title: "text-2xl font-bold text-neutral-100 tracking-tight",
    subtitle: "text-lg font-semibold text-neutral-200",
    body: "text-sm text-neutral-300",
    terminal: "text-xs font-mono text-neutral-400 uppercase tracking-wider",
    caption: "text-xs text-neutral-500"
  };
  
  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
};

export const RealisticButton = ({ children, className = "", variant = "primary", size = "md", ...props }: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const variants = {
    primary: "bg-neutral-700 hover:bg-neutral-600 text-neutral-100 border-neutral-600",
    secondary: "bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700",
    danger: "bg-red-900/80 hover:bg-red-800/80 text-red-100 border-red-800",
    ghost: "bg-transparent hover:bg-neutral-800/50 text-neutral-300 border-neutral-700"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <Button 
      className={`border transition-colors duration-200 ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </Button>
  );
};

// Realistic Territory Map
export const RealisticTerritoryMap = () => {
  const territories = Array.from({ length: 64 }, (_, i) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const isEmpty = Math.random() > 0.6;
    const isOwned = !isEmpty && Math.random() > 0.7;
    const isAlliance = !isEmpty && !isOwned && Math.random() > 0.8;
    const isEnemy = !isEmpty && !isOwned && !isAlliance && Math.random() > 0.5;
    
    return { x, y, isEmpty, isOwned, isAlliance, isEnemy };
  });

  return (
    <RealisticWastelandCard variant="dark" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <RealisticText variant="subtitle">Territory Control</RealisticText>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-700 border border-emerald-600"></div>
            <span className="text-neutral-400">Controlled</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-700 border border-blue-600"></div>
            <span className="text-neutral-400">Allied</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-700 border border-red-600"></div>
            <span className="text-neutral-400">Hostile</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-8 gap-1 mb-4">
        {territories.map((territory, i) => (
          <button
            key={i}
            onClick={() => console.log('Territory action:', territory)}
            className={`
              aspect-square text-xs border transition-colors duration-200 relative
              ${territory.isEmpty ? 'bg-neutral-800 border-neutral-700 hover:border-neutral-600' :
                territory.isOwned ? 'bg-emerald-800 border-emerald-600' :
                territory.isAlliance ? 'bg-blue-800 border-blue-600' :
                territory.isEnemy ? 'bg-red-800 border-red-600' :
                'bg-amber-800 border-amber-600'}
            `}
          >
            {!territory.isEmpty && (
              <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-neutral-200">
                {territory.isOwned ? '●' : territory.isAlliance ? '◆' : territory.isEnemy ? '▲' : '◇'}
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <RealisticButton variant="primary" size="sm">
          Claim Territory
        </RealisticButton>
        <RealisticButton variant="secondary" size="sm">
          View Details
        </RealisticButton>
      </div>
    </RealisticWastelandCard>
  );
};

// Realistic Player Status
export const RealisticPlayerStatus = () => {
  return (
    <RealisticWastelandCard variant="default" className="p-6">
      <RealisticText variant="subtitle" className="mb-4">Survivor Status</RealisticText>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <RealisticText variant="body">CallSign</RealisticText>
          <RealisticText variant="body" className="font-mono text-neutral-100">GHOST_PROTOCOL</RealisticText>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <RealisticText variant="caption">Experience</RealisticText>
            <RealisticText variant="caption">2,847 XP</RealisticText>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded-none">
            <div className="bg-neutral-500 h-2 rounded-none" style={{width: '68%'}}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-neutral-700">
          <div className="text-center">
            <RealisticText variant="body" className="text-neutral-100">12</RealisticText>
            <RealisticText variant="caption">Territories</RealisticText>
          </div>
          <div className="text-center">
            <RealisticText variant="body" className="text-neutral-100">8</RealisticText>
            <RealisticText variant="caption">Victories</RealisticText>
          </div>
          <div className="text-center">
            <RealisticText variant="body" className="text-neutral-100">45</RealisticText>
            <RealisticText variant="caption">Rank</RealisticText>
          </div>
        </div>
      </div>
    </RealisticWastelandCard>
  );
};

// Realistic Battle Interface
export const RealisticBattleInterface = () => {
  return (
    <RealisticWastelandCard variant="default" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <RealisticText variant="subtitle">Combat Operations</RealisticText>
        <Badge className="bg-red-900 text-red-100 border-red-800">3 Active</Badge>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <RealisticButton variant="danger" size="sm">
            Initiate Attack
          </RealisticButton>
          <RealisticButton variant="secondary" size="sm">
            Defensive Position
          </RealisticButton>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-red-900/20 border border-red-800/50">
            <RealisticText variant="body" className="text-red-200">vs WastelandKing</RealisticText>
            <RealisticText variant="caption" className="text-amber-300">ENGAGING</RealisticText>
          </div>
          <div className="flex justify-between items-center p-3 bg-emerald-900/20 border border-emerald-800/50">
            <RealisticText variant="body" className="text-emerald-200">vs Raider_X</RealisticText>
            <RealisticText variant="caption" className="text-emerald-300">VICTORY</RealisticText>
          </div>
          <div className="flex justify-between items-center p-3 bg-neutral-800 border border-neutral-700">
            <RealisticText variant="body">vs Enclave_Unit</RealisticText>
            <RealisticText variant="caption">PENDING</RealisticText>
          </div>
        </div>
      </div>
    </RealisticWastelandCard>
  );
};

// Realistic Communications
export const RealisticCommunications = () => {
  return (
    <RealisticWastelandCard variant="dark" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <RealisticText variant="subtitle">Communications</RealisticText>
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-3">
        <div className="h-32 bg-black border border-neutral-700 p-3 overflow-y-auto font-mono text-xs text-neutral-300 space-y-1">
          <div><span className="text-blue-400">[Brotherhood]</span> Patrol route delta secured</div>
          <div><span className="text-red-400">[Raider_Gang]</span> Under heavy fire, need backup</div>
          <div><span className="text-amber-400">[Merchant_Guild]</span> Trade convoy departing 0800</div>
          <div><span className="text-emerald-400">[System]</span> Network status: OPERATIONAL</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <RealisticButton variant="primary" size="sm">
            Send Message
          </RealisticButton>
          <RealisticButton variant="ghost" size="sm">
            Scan Frequencies
          </RealisticButton>
        </div>
      </div>
    </RealisticWastelandCard>
  );
};

// Realistic Leaderboard
export const RealisticLeaderboard = () => {
  const leaders = [
    { callsign: 'APEX_PREDATOR', power: 3847, territories: 8, status: 'online' },
    { callsign: 'GHOST_PROTOCOL', power: 3692, territories: 12, status: 'active' },
    { callsign: 'IRON_MAIDEN', power: 3534, territories: 6, status: 'away' },
    { callsign: 'VOID_HUNTER', power: 3421, territories: 15, status: 'online' },
    { callsign: 'STEEL_PHANTOM', power: 3298, territories: 4, status: 'offline' }
  ];

  return (
    <RealisticWastelandCard variant="default" className="p-6">
      <RealisticText variant="subtitle" className="mb-4">Regional Leaders</RealisticText>
      
      <div className="space-y-2">
        {leaders.map((leader, index) => (
          <div key={leader.callsign} className="flex items-center justify-between p-3 bg-neutral-800/50 border border-neutral-700">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 flex items-center justify-center text-xs font-bold border ${
                index === 0 ? 'bg-amber-800 border-amber-600 text-amber-100' :
                index === 1 ? 'bg-neutral-600 border-neutral-500 text-neutral-100' :
                index === 2 ? 'bg-orange-800 border-orange-600 text-orange-100' :
                'bg-neutral-700 border-neutral-600 text-neutral-200'
              }`}>
                {index + 1}
              </div>
              <div>
                <RealisticText variant="body" className="text-neutral-100 font-mono">{leader.callsign}</RealisticText>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    leader.status === 'online' ? 'bg-emerald-500' :
                    leader.status === 'active' ? 'bg-amber-500' :
                    leader.status === 'away' ? 'bg-orange-500' : 'bg-neutral-600'
                  }`}></div>
                  <RealisticText variant="caption">{leader.status}</RealisticText>
                </div>
              </div>
            </div>
            <div className="text-right">
              <RealisticText variant="body" className="text-neutral-200">{leader.power.toLocaleString()}</RealisticText>
              <RealisticText variant="caption">{leader.territories} zones</RealisticText>
            </div>
          </div>
        ))}
      </div>
    </RealisticWastelandCard>
  );
};