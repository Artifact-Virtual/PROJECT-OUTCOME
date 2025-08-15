// Strategic Game Items for BLOKBOY 1000
// These items provide actual gameplay benefits and are essential for competitive play

export interface GameItem {
  id: string;
  name: string;
  category: ItemCategory;
  tier: ItemTier;
  priceETH: string; // Base ETH price
  priceARCX?: string; // ARCx token price (alternative)
  gameplayEffects: GameplayEffect[];
  description: string;
  stackable: boolean;
  maxStack?: number;
  craftingRecipe?: CraftingRecipe;
  requiredLevel?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export type ItemCategory = 
  | 'communication' 
  | 'territory_control' 
  | 'alliance_management' 
  | 'battle_enhancement' 
  | 'resource_generation' 
  | 'intelligence'
  | 'defense_systems';

export type ItemTier = 'basic' | 'advanced' | 'military' | 'experimental';

export interface GameplayEffect {
  type: EffectType;
  value: number;
  duration?: number; // in hours, null for permanent
  stacksWith?: string[]; // item IDs that can stack with this effect
}

export type EffectType = 
  | 'battle_power_boost'
  | 'territory_defense_bonus'
  | 'alliance_coordination_bonus'
  | 'message_cost_reduction'
  | 'territory_claim_speed'
  | 'resource_generation_rate'
  | 'intel_gathering_range'
  | 'stealth_operations'
  | 'communication_encryption'
  | 'supply_line_efficiency';

export interface CraftingRecipe {
  materials: { itemId: string; quantity: number }[];
  craftingTime: number; // in hours
  requiredTerritoryType?: string;
  skillRequirement?: number;
}

// Strategic Items that enhance gameplay
export const STRATEGIC_ITEMS: GameItem[] = [
  // Communication Enhancement
  {
    id: 'signal_amplifier_mk1',
    name: 'Signal Amplifier MK-I',
    category: 'communication',
    tier: 'basic',
    priceETH: '0.005', // $12-15 USD equivalent 
    priceARCX: '150',
    gameplayEffects: [
      { type: 'message_cost_reduction', value: 25 }, // 25% cheaper messaging
      { type: 'communication_encryption', value: 1 }
    ],
    description: 'Reduces message transmission costs by 25% and adds basic encryption',
    stackable: false,
    requiredLevel: 3,
    rarity: 'common'
  },
  {
    id: 'quantum_relay_mk3',
    name: 'Quantum Relay MK-III',
    category: 'communication',
    tier: 'military',
    priceETH: '0.025', // $60-75 USD equivalent
    priceARCX: '750',
    gameplayEffects: [
      { type: 'message_cost_reduction', value: 75 },
      { type: 'communication_encryption', value: 3 },
      { type: 'alliance_coordination_bonus', value: 10 }
    ],
    description: 'Military-grade comms with 75% cost reduction and +10% alliance coordination',
    stackable: false,
    requiredLevel: 15,
    rarity: 'rare'
  },

  // Territory Control
  {
    id: 'territory_beacon',
    name: 'Territory Control Beacon',
    category: 'territory_control',
    tier: 'basic',
    priceETH: '0.008',
    priceARCX: '240',
    gameplayEffects: [
      { type: 'territory_defense_bonus', value: 15 },
      { type: 'territory_claim_speed', value: 20 }
    ],
    description: 'Increases territory defense by 15% and claim speed by 20%',
    stackable: true,
    maxStack: 3,
    requiredLevel: 5,
    rarity: 'common'
  },
  {
    id: 'fortress_protocol_chip',
    name: 'Fortress Protocol Chip',
    category: 'territory_control',
    tier: 'experimental',
    priceETH: '0.04',
    priceARCX: '1200',
    gameplayEffects: [
      { type: 'territory_defense_bonus', value: 50 },
      { type: 'supply_line_efficiency', value: 25 },
      { type: 'stealth_operations', value: 1 }
    ],
    description: 'Experimental tech: +50% territory defense, +25% supply efficiency, stealth mode',
    stackable: false,
    requiredLevel: 25,
    rarity: 'legendary'
  },

  // Battle Enhancement
  {
    id: 'tactical_processor',
    name: 'Tactical Combat Processor',
    category: 'battle_enhancement',
    tier: 'advanced',
    priceETH: '0.012',
    priceARCX: '360',
    gameplayEffects: [
      { type: 'battle_power_boost', value: 20, duration: 24 },
      { type: 'intel_gathering_range', value: 30 }
    ],
    description: 'Temporary +20% battle power (24h) and +30% intel gathering range',
    stackable: true,
    maxStack: 5,
    requiredLevel: 8,
    rarity: 'uncommon'
  },
  {
    id: 'war_machine_core',
    name: 'War Machine Core',
    category: 'battle_enhancement',
    tier: 'military',
    priceETH: '0.035',
    priceARCX: '1050',
    gameplayEffects: [
      { type: 'battle_power_boost', value: 100 }, // Permanent +100% power
      { type: 'alliance_coordination_bonus', value: 25 }
    ],
    description: 'Permanent +100% individual battle power and +25% alliance coordination',
    stackable: false,
    requiredLevel: 20,
    rarity: 'epic'
  },

  // Resource Generation
  {
    id: 'resource_extractor',
    name: 'Automated Resource Extractor',
    category: 'resource_generation',
    tier: 'basic',
    priceETH: '0.006',
    priceARCX: '180',
    gameplayEffects: [
      { type: 'resource_generation_rate', value: 50 } // +50% passive resource generation
    ],
    description: 'Generates passive resources at +50% rate from controlled territories',
    stackable: true,
    maxStack: 10,
    requiredLevel: 4,
    rarity: 'common'
  },
  {
    id: 'nano_fabricator',
    name: 'Military Nano-Fabricator',
    category: 'resource_generation',
    tier: 'experimental',
    priceETH: '0.05',
    priceARCX: '1500',
    gameplayEffects: [
      { type: 'resource_generation_rate', value: 200 },
      { type: 'supply_line_efficiency', value: 50 }
    ],
    description: 'Advanced fabricator: +200% resource generation, +50% supply efficiency',
    stackable: false,
    requiredLevel: 30,
    rarity: 'legendary'
  },

  // Intelligence Gathering
  {
    id: 'recon_drone',
    name: 'Stealth Reconnaissance Drone',
    category: 'intelligence',
    tier: 'advanced',
    priceETH: '0.01',
    priceARCX: '300',
    gameplayEffects: [
      { type: 'intel_gathering_range', value: 100, duration: 48 },
      { type: 'stealth_operations', value: 2, duration: 48 }
    ],
    description: 'Extended intel range and stealth operations for 48 hours',
    stackable: true,
    maxStack: 3,
    requiredLevel: 10,
    rarity: 'uncommon'
  },

  // Alliance Management
  {
    id: 'command_network_hub',
    name: 'Alliance Command Network Hub',
    category: 'alliance_management',
    tier: 'military',
    priceETH: '0.03',
    priceARCX: '900',
    gameplayEffects: [
      { type: 'alliance_coordination_bonus', value: 50 },
      { type: 'communication_encryption', value: 2 },
      { type: 'supply_line_efficiency', value: 30 }
    ],
    description: 'Alliance-wide benefits: +50% coordination, encrypted comms, +30% supply efficiency',
    stackable: false,
    requiredLevel: 18,
    rarity: 'rare'
  },

  // Defense Systems
  {
    id: 'shield_generator',
    name: 'Territorial Shield Generator',
    category: 'defense_systems',
    tier: 'advanced',
    priceETH: '0.015',
    priceARCX: '450',
    gameplayEffects: [
      { type: 'territory_defense_bonus', value: 75, duration: 72 },
      { type: 'battle_power_boost', value: 25, duration: 72 }
    ],
    description: 'Powerful shield: +75% territory defense and +25% battle power for 72 hours',
    stackable: false,
    requiredLevel: 12,
    rarity: 'rare'
  }
];

// Crafting materials for advanced items
export const CRAFTING_MATERIALS: GameItem[] = [
  {
    id: 'quantum_crystal',
    name: 'Quantum Processing Crystal',
    category: 'resource_generation',
    tier: 'basic',
    priceETH: '0.002',
    priceARCX: '60',
    gameplayEffects: [],
    description: 'Essential component for advanced technology crafting',
    stackable: true,
    maxStack: 50,
    rarity: 'common'
  },
  {
    id: 'military_chipset',
    name: 'Military-Grade Chipset',
    category: 'battle_enhancement',
    tier: 'advanced',
    priceETH: '0.008',
    priceARCX: '240',
    gameplayEffects: [],
    description: 'Required for crafting military-tier combat equipment',
    stackable: true,
    maxStack: 20,
    rarity: 'uncommon'
  }
];

// Utility functions
export function getItemsByCategory(category: ItemCategory): GameItem[] {
  return STRATEGIC_ITEMS.filter(item => item.category === category);
}

export function getItemsByTier(tier: ItemTier): GameItem[] {
  return STRATEGIC_ITEMS.filter(item => item.tier === tier);
}

export function calculateItemValue(item: GameItem, playerLevel: number): number {
  // Dynamic pricing based on player level and item effectiveness
  const basePriceETH = parseFloat(item.priceETH);
  const levelMultiplier = item.requiredLevel ? Math.max(1, item.requiredLevel / playerLevel) : 1;
  return basePriceETH * levelMultiplier;
}

export function canPlayerUseItem(item: GameItem, playerLevel: number): boolean {
  return !item.requiredLevel || playerLevel >= item.requiredLevel;
}