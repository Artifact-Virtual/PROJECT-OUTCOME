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
  itemType: 'permanent' | 'consumable' | 'depleting' | 'collectible';
  durability?: number; // For depleting items
  mintable: boolean; // Whether players can mint this item
  mintCost?: MintCost; // Cost to mint the item
}

export type ItemCategory = 
  | 'communication' 
  | 'territory_control' 
  | 'alliance_management' 
  | 'battle_enhancement' 
  | 'resource_generation' 
  | 'intelligence'
  | 'defense_systems'
  | 'consumables'
  | 'collectibles'
  | 'materials';

export type ItemTier = 'basic' | 'advanced' | 'military' | 'experimental';

export interface GameplayEffect {
  type: EffectType;
  value: number;
  duration?: number; // in hours, null for permanent
  stacksWith?: string[]; // item IDs that can stack with this effect
  consumesOnUse?: boolean; // Whether item is consumed when activated
  cooldown?: number; // Cooldown in hours before reuse
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

export interface MintCost {
  baseETH?: string; // Base ETH cost in wei
  arcxTokens?: string; // ARCx token cost
  materials?: { itemId: string; quantity: number }[]; // Required materials
  energyCost?: number; // Energy/resource cost
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
    rarity: 'common',
    itemType: 'permanent',
    mintable: true,
    mintCost: {
      baseETH: '3000000000000000', // 0.003 ETH
      materials: [{ itemId: 'electronic_components', quantity: 2 }]
    }
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
    rarity: 'rare',
    itemType: 'permanent',
    mintable: true,
    mintCost: {
      baseETH: '15000000000000000', // 0.015 ETH
      materials: [{ itemId: 'quantum_crystal', quantity: 1 }, { itemId: 'military_chipset', quantity: 1 }]
    }
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
    rarity: 'common',
    itemType: 'permanent',
    mintable: true,
    mintCost: {
      baseETH: '5000000000000000',
      materials: [{ itemId: 'electronic_components', quantity: 3 }]
    }
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
    rarity: 'legendary',
    itemType: 'permanent',
    mintable: true,
    mintCost: {
      baseETH: '25000000000000000',
      materials: [{ itemId: 'quantum_crystal', quantity: 3 }, { itemId: 'military_chipset', quantity: 2 }],
      energyCost: 500
    }
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
    rarity: 'uncommon',
    itemType: 'consumable',
    mintable: true,
    mintCost: {
      baseETH: '8000000000000000',
      materials: [{ itemId: 'military_chipset', quantity: 1 }]
    }
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
    rarity: 'epic',
    itemType: 'permanent',
    mintable: true,
    mintCost: {
      baseETH: '20000000000000000',
      materials: [{ itemId: 'quantum_crystal', quantity: 2 }, { itemId: 'military_chipset', quantity: 3 }],
      energyCost: 300
    }
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
    rarity: 'common',
    itemType: 'permanent',
    mintable: true,
    mintCost: {
      baseETH: '4000000000000000',
      materials: [{ itemId: 'electronic_components', quantity: 2 }]
    }
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
    rarity: 'legendary',
    itemType: 'permanent',
    mintable: true,
    mintCost: {
      baseETH: '30000000000000000',
      materials: [{ itemId: 'quantum_crystal', quantity: 5 }, { itemId: 'military_chipset', quantity: 3 }],
      energyCost: 800
    }
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
    rarity: 'uncommon',
    itemType: 'consumable',
    mintable: true,
    mintCost: {
      baseETH: '7000000000000000',
      materials: [{ itemId: 'electronic_components', quantity: 2 }]
    }
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
    rarity: 'rare',
    itemType: 'permanent',
    mintable: true,
    mintCost: {
      baseETH: '18000000000000000',
      materials: [{ itemId: 'quantum_crystal', quantity: 2 }, { itemId: 'military_chipset', quantity: 2 }],
      energyCost: 250
    }
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
    rarity: 'rare',
    itemType: 'consumable',
    mintable: true,
    mintCost: {
      baseETH: '10000000000000000',
      materials: [{ itemId: 'military_chipset', quantity: 1 }, { itemId: 'electronic_components', quantity: 3 }]
    }
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
    rarity: 'common',
    itemType: 'collectible',
    mintable: true,
    mintCost: {
      baseETH: '1000000000000000'
    }
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
    rarity: 'uncommon',
    itemType: 'collectible',
    mintable: true,
    mintCost: {
      baseETH: '5000000000000000'
    }
  }
];

// Consumable Items - Single-use items with powerful temporary effects
export const CONSUMABLE_ITEMS: GameItem[] = [
  {
    id: 'combat_stim_pack',
    name: 'Combat Stimulant Pack',
    category: 'consumables',
    tier: 'basic',
    priceETH: '0.003',
    priceARCX: '90',
    gameplayEffects: [
      { type: 'battle_power_boost', value: 50, duration: 6, consumesOnUse: true }
    ],
    description: 'Massive +50% battle power for 6 hours. Single use.',
    stackable: true,
    maxStack: 10,
    requiredLevel: 5,
    rarity: 'common',
    itemType: 'consumable',
    mintable: true,
    mintCost: {
      baseETH: '2000000000000000',
      materials: [{ itemId: 'electronic_components', quantity: 1 }]
    }
  },
  {
    id: 'territory_fortifier',
    name: 'Emergency Territory Fortifier',
    category: 'consumables',
    tier: 'advanced',
    priceETH: '0.007',
    priceARCX: '210',
    gameplayEffects: [
      { type: 'territory_defense_bonus', value: 100, duration: 12, consumesOnUse: true },
      { type: 'stealth_operations', value: 3, duration: 12, consumesOnUse: true }
    ],
    description: 'Emergency use: +100% territory defense and stealth for 12 hours',
    stackable: true,
    maxStack: 5,
    requiredLevel: 10,
    rarity: 'uncommon',
    itemType: 'consumable',
    mintable: true,
    mintCost: {
      baseETH: '5000000000000000',
      materials: [{ itemId: 'military_chipset', quantity: 1 }]
    }
  },
  {
    id: 'alliance_rally_beacon',
    name: 'Alliance Rally Beacon',
    category: 'consumables',
    tier: 'military',
    priceETH: '0.015',
    priceARCX: '450',
    gameplayEffects: [
      { type: 'alliance_coordination_bonus', value: 75, duration: 24, consumesOnUse: true },
      { type: 'communication_encryption', value: 5, duration: 24, consumesOnUse: true }
    ],
    description: 'Rally your alliance: +75% coordination and max encryption for 24 hours',
    stackable: true,
    maxStack: 3,
    requiredLevel: 15,
    rarity: 'rare',
    itemType: 'consumable',
    mintable: true,
    mintCost: {
      baseETH: '10000000000000000',
      materials: [{ itemId: 'quantum_crystal', quantity: 1 }, { itemId: 'military_chipset', quantity: 2 }],
      energyCost: 200
    }
  },
  {
    id: 'resource_surge_catalyst',
    name: 'Resource Surge Catalyst',
    category: 'consumables',
    tier: 'experimental',
    priceETH: '0.025',
    priceARCX: '750',
    gameplayEffects: [
      { type: 'resource_generation_rate', value: 500, duration: 8, consumesOnUse: true }
    ],
    description: 'Experimental catalyst: +500% resource generation for 8 hours. Extremely rare.',
    stackable: true,
    maxStack: 2,
    requiredLevel: 25,
    rarity: 'legendary',
    itemType: 'consumable',
    mintable: true,
    mintCost: {
      baseETH: '20000000000000000',
      materials: [{ itemId: 'quantum_crystal', quantity: 3 }],
      energyCost: 400
    }
  }
];

// Collectible Items - Rare items with lore value and potential future utility
export const COLLECTIBLE_ITEMS: GameItem[] = [
  {
    id: 'wasteland_relic_mk1',
    name: 'Pre-War Technology Fragment',
    category: 'collectibles',
    tier: 'basic',
    priceETH: '0.01',
    priceARCX: '300',
    gameplayEffects: [],
    description: 'Ancient tech from before the collapse. Valuable to collectors and researchers.',
    stackable: true,
    maxStack: 1,
    requiredLevel: 1,
    rarity: 'uncommon',
    itemType: 'collectible',
    mintable: false // These are found, not minted
  },
  {
    id: 'commander_insignia',
    name: 'Elite Commander Insignia',
    category: 'collectibles',
    tier: 'military',
    priceETH: '0.1',
    priceARCX: '3000',
    gameplayEffects: [
      { type: 'alliance_coordination_bonus', value: 5 } // Small permanent bonus
    ],
    description: 'Proof of legendary leadership. Grants permanent +5% alliance coordination.',
    stackable: false,
    requiredLevel: 20,
    rarity: 'legendary',
    itemType: 'collectible',
    mintable: false
  }
];

// Electronic Components - Basic crafting material
export const BASIC_MATERIALS: GameItem[] = [
  {
    id: 'electronic_components',
    name: 'Salvaged Electronic Components',
    category: 'materials',
    tier: 'basic',
    priceETH: '0.001',
    priceARCX: '30',
    gameplayEffects: [],
    description: 'Essential crafting material salvaged from wasteland ruins',
    stackable: true,
    maxStack: 100,
    rarity: 'common',
    itemType: 'collectible',
    mintable: true,
    mintCost: {
      baseETH: '500000000000000' // Very cheap
    }
  }
];

// Combine all items
export const ALL_GAME_ITEMS = [
  ...STRATEGIC_ITEMS,
  ...CONSUMABLE_ITEMS,
  ...COLLECTIBLE_ITEMS,
  ...CRAFTING_MATERIALS,
  ...BASIC_MATERIALS
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