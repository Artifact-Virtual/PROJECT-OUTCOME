import { useState, useEffect } from 'react';
import { 
  RealisticWastelandCard,
  RealisticText,
  RealisticButton
} from "@/components/realistic-wasteland";
import { STRATEGIC_ITEMS, CONSUMABLE_ITEMS, type GameItem } from "@shared/game-items";

interface InventoryItem {
  id: string;
  item: GameItem;
  quantity: number;
  equipped: boolean;
  condition: number; // 0-100 durability
  acquiredAt: number;
  location: 'carried' | 'depot_alpha' | 'depot_beta' | 'depot_gamma';
  powerConsumption: number; // Active power drain
}

interface Depot {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'offline' | 'damaged';
  capacity: number;
  distance: number; // km from current position
  securityLevel: 'low' | 'medium' | 'high';
  restockCooldown: number; // minutes until restock
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_1',
    item: STRATEGIC_ITEMS.find(item => item.id === 'tactical_processor')!,
    quantity: 1,
    equipped: true,
    condition: 87,
    acquiredAt: Date.now() - 3600000,
    location: 'carried',
    powerConsumption: 15
  },
  {
    id: 'inv_2',
    item: STRATEGIC_ITEMS.find(item => item.id === 'signal_amplifier_mk1')!,
    quantity: 2,
    equipped: false,
    condition: 93,
    acquiredAt: Date.now() - 7200000,
    location: 'carried',
    powerConsumption: 8
  },
  {
    id: 'inv_3',
    item: STRATEGIC_ITEMS.find(item => item.id === 'territory_beacon')!,
    quantity: 1,
    equipped: true,
    condition: 76,
    acquiredAt: Date.now() - 14400000,
    location: 'carried',
    powerConsumption: 12
  },
  {
    id: 'inv_4',
    item: CONSUMABLE_ITEMS.find(item => item.id === 'emergency_beacon')!,
    quantity: 3,
    equipped: false,
    condition: 100,
    acquiredAt: Date.now() - 1800000,
    location: 'carried',
    powerConsumption: 0
  },
  {
    id: 'inv_5',
    item: STRATEGIC_ITEMS.find(item => item.id === 'war_machine_core')!,
    quantity: 1,
    equipped: false,
    condition: 45,
    acquiredAt: Date.now() - 86400000,
    location: 'depot_alpha',
    powerConsumption: 25
  }
];

const DEPOT_LOCATIONS: Depot[] = [
  {
    id: 'depot_alpha',
    name: 'DEPOT ALPHA',
    location: 'Sector A-7',
    status: 'operational',
    capacity: 50,
    distance: 2.3,
    securityLevel: 'high',
    restockCooldown: 45
  },
  {
    id: 'depot_beta',
    name: 'DEPOT BETA',
    location: 'Sector C-2',
    status: 'damaged',
    capacity: 30,
    distance: 8.7,
    securityLevel: 'medium',
    restockCooldown: 180
  },
  {
    id: 'depot_gamma',
    name: 'DEPOT GAMMA',
    location: 'Sector F-9',
    status: 'operational',
    capacity: 75,
    distance: 15.2,
    securityLevel: 'low',
    restockCooldown: 12
  }
];

interface PWAInventoryProps {
  className?: string;
}

export const PWAInventory = ({ className = "" }: PWAInventoryProps) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [selectedLocation, setSelectedLocation] = useState<'carried' | 'depot_alpha' | 'depot_beta' | 'depot_gamma'>('carried');
  const [currentPower, setCurrentPower] = useState(73); // Current power level
  const [maxPower] = useState(100);
  const [powerDrain, setPowerDrain] = useState(0);

  // Calculate total power consumption
  useEffect(() => {
    const totalDrain = inventory
      .filter(item => item.equipped && item.location === 'carried')
      .reduce((sum, item) => sum + item.powerConsumption, 0);
    setPowerDrain(totalDrain);
  }, [inventory]);

  // Simulate power drain
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPower(prev => {
        const newPower = prev - (powerDrain / 60); // Drain per minute
        return Math.max(0, newPower);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [powerDrain]);

  const getConditionColor = (condition: number): string => {
    if (condition > 80) return 'text-emerald-400';
    if (condition > 60) return 'text-yellow-400';
    if (condition > 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'operational': return 'text-emerald-400';
      case 'damaged': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const getSecurityColor = (level: string): string => {
    switch (level) {
      case 'high': return 'text-emerald-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const toggleEquipped = (itemId: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId && item.location === 'carried') {
        return { ...item, equipped: !item.equipped };
      }
      return item;
    }));
  };

  const useConsumable = (itemId: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId && item.quantity > 0) {
        const newQuantity = item.quantity - 1;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean) as InventoryItem[]);
  };

  const repairItem = (itemId: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, condition: Math.min(100, item.condition + 25) };
      }
      return item;
    }));
  };

  const filteredInventory = inventory.filter(item => item.location === selectedLocation);
  const carriedItems = inventory.filter(item => item.location === 'carried');
  const equippedItems = carriedItems.filter(item => item.equipped);

  const getTimeSince = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Power Status */}
      <RealisticWastelandCard variant="dark" className="p-4">
        <div className="flex justify-between items-center mb-3">
          <RealisticText variant="subtitle" className="text-neutral-100">
            Power Management
          </RealisticText>
          <div className="text-right">
            <div className="text-lg font-bold text-amber-400">{Math.floor(currentPower)}%</div>
            <div className="text-xs text-neutral-500">Power Level</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-neutral-800 h-3 border border-neutral-700">
            <div 
              className="bg-amber-600 h-full transition-all duration-1000"
              style={{ width: `${currentPower}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Drain Rate: {powerDrain}/min</span>
            <span className="text-neutral-400">Runtime: {Math.floor(currentPower / Math.max(powerDrain / 60, 0.1))}min</span>
          </div>
        </div>
      </RealisticWastelandCard>

      {/* Location Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedLocation('carried')}
          className={`flex-1 py-2 px-3 border text-xs font-mono uppercase ${
            selectedLocation === 'carried'
              ? 'border-amber-600 bg-amber-900/20 text-amber-400'
              : 'border-neutral-700 bg-neutral-900 text-neutral-400'
          }`}
        >
          Carried ({carriedItems.length})
        </button>
        {DEPOT_LOCATIONS.map((depot) => {
          const depotItems = inventory.filter(item => item.location === depot.id).length;
          return (
            <button
              key={depot.id}
              onClick={() => setSelectedLocation(depot.id as any)}
              className={`flex-1 py-2 px-3 border text-xs font-mono uppercase ${
                selectedLocation === depot.id
                  ? 'border-amber-600 bg-amber-900/20 text-amber-400'
                  : 'border-neutral-700 bg-neutral-900 text-neutral-400'
              }`}
            >
              {depot.name.split(' ')[1]} ({depotItems})
            </button>
          );
        })}
      </div>

      {/* Depot Information */}
      {selectedLocation !== 'carried' && (
        <RealisticWastelandCard variant="dark" className="p-4">
          {(() => {
            const depot = DEPOT_LOCATIONS.find(d => d.id === selectedLocation);
            if (!depot) return null;
            
            return (
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <RealisticText variant="subtitle" className="text-neutral-100">
                      {depot.name}
                    </RealisticText>
                    <RealisticText variant="caption" className="text-neutral-500">
                      {depot.location} • {depot.distance}km away
                    </RealisticText>
                  </div>
                  <div className={`text-xs font-bold ${getStatusColor(depot.status)}`}>
                    {depot.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-neutral-400">Capacity</div>
                    <div className="text-neutral-100">{depot.capacity} items</div>
                  </div>
                  <div>
                    <div className="text-neutral-400">Security</div>
                    <div className={getSecurityColor(depot.securityLevel)}>
                      {depot.securityLevel.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-400">Restock</div>
                    <div className="text-neutral-100">{depot.restockCooldown}min</div>
                  </div>
                </div>

                {depot.status !== 'operational' && (
                  <div className="mt-3 p-2 bg-yellow-900/20 border border-yellow-700/30">
                    <div className="text-xs text-yellow-400">
                      ⚠ Cannot restock or trade at this depot. Requires repair mission.
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </RealisticWastelandCard>
      )}

      {/* Inventory Items */}
      <div className="space-y-3">
        {filteredInventory.length === 0 ? (
          <RealisticWastelandCard variant="dark" className="p-6 text-center">
            <RealisticText variant="body" className="text-neutral-400">
              No items in {selectedLocation === 'carried' ? 'inventory' : 'this depot'}
            </RealisticText>
          </RealisticWastelandCard>
        ) : (
          filteredInventory.map((inventoryItem) => (
            <RealisticWastelandCard key={inventoryItem.id} variant="dark" className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <RealisticText variant="body" className="text-neutral-100">
                      {inventoryItem.item.name}
                    </RealisticText>
                    {inventoryItem.equipped && (
                      <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-0.5 border border-emerald-700/30">
                        EQUIPPED
                      </span>
                    )}
                    {inventoryItem.quantity > 1 && (
                      <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5">
                        x{inventoryItem.quantity}
                      </span>
                    )}
                  </div>
                  <RealisticText variant="caption" className="text-neutral-500">
                    {inventoryItem.item.description}
                  </RealisticText>
                </div>
                <div className="text-right text-xs">
                  <div className={`font-bold ${getConditionColor(inventoryItem.condition)}`}>
                    {Math.floor(inventoryItem.condition)}%
                  </div>
                  <div className="text-neutral-500">condition</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                <div>
                  <div className="text-neutral-400">Category</div>
                  <div className="text-neutral-100 capitalize">{inventoryItem.item.category.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-neutral-400">Tier</div>
                  <div className="text-neutral-100 capitalize">{inventoryItem.item.tier}</div>
                </div>
                <div>
                  <div className="text-neutral-400">Power Use</div>
                  <div className="text-neutral-100">{inventoryItem.powerConsumption}/min</div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500">
                  Acquired {getTimeSince(inventoryItem.acquiredAt)}
                </span>
                <div className="flex gap-2">
                  {selectedLocation === 'carried' && inventoryItem.item.category !== 'consumables' && (
                    <RealisticButton
                      variant={inventoryItem.equipped ? "secondary" : "primary"}
                      size="sm"
                      onClick={() => toggleEquipped(inventoryItem.id)}
                      className="text-xs px-3 py-1"
                    >
                      {inventoryItem.equipped ? 'Unequip' : 'Equip'}
                    </RealisticButton>
                  )}
                  {inventoryItem.item.category === 'consumables' && selectedLocation === 'carried' && (
                    <RealisticButton
                      variant="primary"
                      size="sm"
                      onClick={() => useConsumable(inventoryItem.id)}
                      className="text-xs px-3 py-1"
                    >
                      Use
                    </RealisticButton>
                  )}
                  {inventoryItem.condition < 80 && (
                    <RealisticButton
                      variant="ghost"
                      size="sm"
                      onClick={() => repairItem(inventoryItem.id)}
                      className="text-xs px-3 py-1"
                    >
                      Repair
                    </RealisticButton>
                  )}
                </div>
              </div>
            </RealisticWastelandCard>
          ))
        )}
      </div>

      {/* Equipment Summary */}
      {selectedLocation === 'carried' && equippedItems.length > 0 && (
        <RealisticWastelandCard variant="dark" className="p-4">
          <RealisticText variant="subtitle" className="mb-3">Active Equipment Effects</RealisticText>
          <div className="space-y-2 text-xs">
            {equippedItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-neutral-300">{item.item.name}:</span>
                <span className="text-emerald-400">
                  {item.item.description}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-neutral-700 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Total Power Drain:</span>
              <span className="text-amber-400">{powerDrain}/min</span>
            </div>
          </div>
        </RealisticWastelandCard>
      )}

      <div className="p-4 bg-neutral-900 border border-neutral-700">
        <RealisticText variant="caption" className="text-neutral-400 leading-relaxed">
          PWA Inventory: Read-only access to your strategic equipment. To restock, trade, or purchase new items, 
          locate secure depots throughout the wasteland. Equipment condition degrades with use - 
          regular maintenance is essential for optimal performance.
        </RealisticText>
      </div>
    </div>
  );
};