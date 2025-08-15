import { useState } from "react";
import { RealisticText, RealisticButton, RealisticWastelandCard } from "@/components/realistic-wasteland";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { STRATEGIC_ITEMS, getItemsByCategory, getItemsByTier, type GameItem, type ItemCategory, type ItemTier } from "@shared/game-items";

// Strategic Item Listing for marketplace
interface StrategicListing {
  id: string;
  item: GameItem;
  sellerId: string;
  sellerName: string;
  quantity: number;
  priceETH?: string; // Base ETH price in wei
  priceARCX?: string; // ARCx token price
  currency: 'ETH' | 'ARCX';
  status: 'active' | 'sold' | 'cancelled';
  createdAt: string;
  expiresAt?: string;
}

export function StrategicTradingInterface() {
  const [selectedTab, setSelectedTab] = useState("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | "all">("all");
  const [selectedTier, setSelectedTier] = useState<ItemTier | "all">("all");
  const [selectedCurrency, setSelectedCurrency] = useState<'ETH' | 'ARCX' | 'all'>('all');
  const [playerLevel] = useState(12); // Mock player level - replace with actual data

  // Strategic Items Marketplace Data  
  const strategicListings: StrategicListing[] = [
    {
      id: "1",
      item: STRATEGIC_ITEMS.find(item => item.id === 'tactical_processor')!,
      sellerId: "user1",
      sellerName: "CommanderAlpha",
      quantity: 3,
      priceETH: "12000000000000000", // 0.012 ETH
      priceARCX: "360",
      currency: "ETH",
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "2", 
      item: STRATEGIC_ITEMS.find(item => item.id === 'signal_amplifier_mk1')!,
      sellerId: "user2",
      sellerName: "TechSavage",
      quantity: 1,
      priceETH: "5000000000000000", // 0.005 ETH
      priceARCX: "150",
      currency: "ARCX",
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      item: STRATEGIC_ITEMS.find(item => item.id === 'territory_beacon')!,
      sellerId: "user3", 
      sellerName: "WastelandKing",
      quantity: 2,
      priceETH: "8000000000000000", // 0.008 ETH
      priceARCX: "240", 
      currency: "ETH",
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "4",
      item: STRATEGIC_ITEMS.find(item => item.id === 'war_machine_core')!,
      sellerId: "user4",
      sellerName: "IronCommander",
      quantity: 1,
      priceETH: "35000000000000000", // 0.035 ETH
      priceARCX: "1050",
      currency: "ETH", 
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "5",
      item: STRATEGIC_ITEMS.find(item => item.id === 'resource_extractor')!,
      sellerId: "user5",
      sellerName: "ScavengerLord",
      quantity: 5,
      priceETH: "6000000000000000", // 0.006 ETH
      priceARCX: "180",
      currency: "ARCX",
      status: "active",
      createdAt: new Date().toISOString()
    }
  ];

  // Filter items based on search and filters
  const filteredListings = strategicListings.filter(listing => {
    const item = listing.item;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesTier = selectedTier === 'all' || item.tier === selectedTier;
    const matchesCurrency = selectedCurrency === 'all' || listing.currency === selectedCurrency;
    
    return matchesSearch && matchesCategory && matchesTier && matchesCurrency;
  });

  const formatPrice = (listing: StrategicListing) => {
    if (listing.currency === 'ETH') {
      const ethPrice = parseFloat(listing.priceETH || "0") / 1e18;
      return `${ethPrice.toFixed(4)} ETH`;
    } else {
      return `${listing.priceARCX} ARCx`;
    }
  };

  const canAffordItem = (listing: StrategicListing) => {
    return listing.item.requiredLevel ? playerLevel >= listing.item.requiredLevel : true;
  };

  const getTierColor = (tier: ItemTier) => {
    switch (tier) {
      case 'basic': return 'text-gray-400 border-gray-400/30';
      case 'advanced': return 'text-blue-400 border-blue-400/30';
      case 'military': return 'text-purple-400 border-purple-400/30'; 
      case 'experimental': return 'text-amber-400 border-amber-400/30';
      default: return 'text-gray-400 border-gray-400/30';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: ItemCategory) => {
    switch (category) {
      case 'communication': return '📡';
      case 'territory_control': return '🏰';
      case 'battle_enhancement': return '⚔️';
      case 'alliance_management': return '🤝';
      case 'resource_generation': return '⚡';
      case 'intelligence': return '🔍';
      case 'defense_systems': return '🛡️';
      default: return '📦';
    }
  };

  const getEffectDescription = (item: GameItem) => {
    const effects = item.gameplayEffects.map(effect => {
      switch (effect.type) {
        case 'battle_power_boost': return `+${effect.value}% Battle Power${effect.duration ? ` (${effect.duration}h)` : ''}`;
        case 'territory_defense_bonus': return `+${effect.value}% Territory Defense${effect.duration ? ` (${effect.duration}h)` : ''}`;
        case 'alliance_coordination_bonus': return `+${effect.value}% Alliance Coordination`;
        case 'message_cost_reduction': return `${effect.value}% Cheaper Messages`;
        case 'resource_generation_rate': return `+${effect.value}% Resource Generation`;
        case 'intel_gathering_range': return `+${effect.value}% Intel Range${effect.duration ? ` (${effect.duration}h)` : ''}`;
        case 'communication_encryption': return `Level ${effect.value} Encryption`;
        case 'supply_line_efficiency': return `+${effect.value}% Supply Efficiency`;
        default: return `${effect.type}: ${effect.value}`;
      }
    });
    return effects.join(', ');
  };

  return (
    <RealisticWastelandCard variant="default" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <RealisticText variant="subtitle" className="text-neutral-100">
            Strategic Equipment Marketplace
          </RealisticText>
          <RealisticText variant="caption" className="text-neutral-400">
            Essential gear for competitive warfare • Base ETH & ARCx tokens accepted
          </RealisticText>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400/30">
            Player Level {playerLevel}
          </Badge>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-900 border border-neutral-700">
          <TabsTrigger 
            value="marketplace" 
            className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-700"
          >
            Marketplace
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-700"
          >
            Inventory
          </TabsTrigger>
          <TabsTrigger 
            value="crafting" 
            className="text-xs font-mono uppercase tracking-wider data-[state=active]:bg-neutral-700"
          >
            Crafting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6 mt-6">
          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-800 border-neutral-700"
              data-testid="input-search-items"
            />
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ItemCategory | "all")}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="territory_control">Territory Control</SelectItem>
                <SelectItem value="battle_enhancement">Battle Enhancement</SelectItem>
                <SelectItem value="alliance_management">Alliance Management</SelectItem>
                <SelectItem value="resource_generation">Resource Generation</SelectItem>
                <SelectItem value="intelligence">Intelligence</SelectItem>
                <SelectItem value="defense_systems">Defense Systems</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTier} onValueChange={(value) => setSelectedTier(value as ItemTier | "all")}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="military">Military</SelectItem>
                <SelectItem value="experimental">Experimental</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as 'ETH' | 'ARCX' | 'all')}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
                <SelectItem value="ETH">Base ETH</SelectItem>
                <SelectItem value="ARCX">ARCx Tokens</SelectItem>
              </SelectContent>
            </Select>
            <RealisticButton variant="ghost" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedTier("all");
              setSelectedCurrency("all");
            }}>
              Clear Filters
            </RealisticButton>
          </div>

          {/* Marketplace Listings */}
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredListings.map((listing) => (
                <RealisticWastelandCard 
                  key={listing.id} 
                  variant="dark" 
                  className={`p-4 border ${getTierColor(listing.item.tier)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(listing.item.category)}</span>
                      <div>
                        <RealisticText variant="body" className="font-semibold text-neutral-100">
                          {listing.item.name}
                        </RealisticText>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getTierColor(listing.item.tier)}>
                            {listing.item.tier.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getRarityColor(listing.item.rarity)}>
                            {listing.item.rarity.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <RealisticText variant="body" className="font-mono text-neutral-100">
                        {formatPrice(listing)}
                      </RealisticText>
                      <RealisticText variant="caption" className="text-neutral-500">
                        x{listing.quantity} available
                      </RealisticText>
                    </div>
                  </div>

                  <RealisticText variant="caption" className="text-neutral-400 mb-3">
                    {listing.item.description}
                  </RealisticText>

                  <div className="mb-3">
                    <RealisticText variant="caption" className="text-amber-400 font-semibold">
                      Effects: {getEffectDescription(listing.item)}
                    </RealisticText>
                  </div>

                  <Separator className="my-3 bg-neutral-700" />

                  <div className="flex items-center justify-between">
                    <RealisticText variant="caption" className="text-neutral-500">
                      Seller: {listing.sellerName}
                    </RealisticText>
                    <div className="flex gap-2">
                      {listing.item.requiredLevel && listing.item.requiredLevel > playerLevel && (
                        <Badge variant="destructive" className="text-xs">
                          Requires Level {listing.item.requiredLevel}
                        </Badge>
                      )}
                      <RealisticButton 
                        size="sm" 
                        variant={canAffordItem(listing) ? "primary" : "ghost"}
                        disabled={!canAffordItem(listing)}
                        data-testid={`button-buy-${listing.item.id}`}
                      >
                        {listing.currency === 'ETH' ? 'Buy with ETH' : 'Buy with ARCx'}
                      </RealisticButton>
                    </div>
                  </div>
                </RealisticWastelandCard>
              ))}
            </div>
          </ScrollArea>

          {filteredListings.length === 0 && (
            <RealisticWastelandCard variant="dark" className="p-8 text-center">
              <RealisticText variant="body" className="text-neutral-400">
                No strategic items match your current filters
              </RealisticText>
            </RealisticWastelandCard>
          )}
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6 mt-6">
          <RealisticWastelandCard variant="dark" className="p-6 text-center">
            <RealisticText variant="subtitle" className="mb-4">Strategic Equipment Inventory</RealisticText>
            <RealisticText variant="body" className="text-neutral-400 mb-4">
              Your active strategic equipment and consumables
            </RealisticText>
            <RealisticText variant="caption" className="text-neutral-500">
              Inventory system integration coming soon
            </RealisticText>
          </RealisticWastelandCard>
        </TabsContent>

        <TabsContent value="crafting" className="space-y-6 mt-6">
          <RealisticWastelandCard variant="dark" className="p-6 text-center">
            <RealisticText variant="subtitle" className="mb-4">Strategic Equipment Crafting</RealisticText>
            <RealisticText variant="body" className="text-neutral-400 mb-4">
              Craft advanced military-grade equipment from raw materials
            </RealisticText>
            <RealisticText variant="caption" className="text-neutral-500">
              Crafting system integration coming soon
            </RealisticText>
          </RealisticWastelandCard>
        </TabsContent>
      </Tabs>
    </RealisticWastelandCard>
  );
}