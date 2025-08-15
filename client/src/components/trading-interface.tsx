import { useState, useEffect } from "react";
import { RealisticText, RealisticButton, RealisticWastelandCard } from "@/components/realistic-wasteland";
import { useMarketplaceListings, useUserItems, useTradeOffers, useTradingPosts, useEscrowContracts, useTradingState } from "@/hooks/use-trading";
import { useWeb3, useTradingContracts } from "@/hooks/use-web3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Trading System Types
interface Item {
  id: string;
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  category: 'weapon' | 'armor' | 'tool' | 'consumable' | 'blueprint' | 'territory_deed';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'artifact';
  attributes: Record<string, any>;
  imageUrl?: string;
  ownerId: string;
  ownerName: string;
  isListed: boolean;
  estimatedValue: string; // in ETH
}

interface MarketplaceListing {
  id: string;
  item: Item;
  sellerId: string;
  sellerName: string;
  price: string; // in wei
  currency: string;
  listingType: 'fixed' | 'auction' | 'bundle';
  status: 'active' | 'sold' | 'cancelled' | 'expired';
  auctionEndTime?: string;
  reservePrice?: string;
  highestBid?: string;
  bidCount: number;
  createdAt: string;
}

interface TradeOffer {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  offeredItems: Item[];
  requestedItems: Item[];
  offeredTokens: string; // in wei
  requestedTokens: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'executed';
  expiresAt?: string;
  createdAt: string;
}

interface TradingPost {
  id: string;
  territoryId: string;
  territoryName: string;
  ownerId: string;
  ownerName: string;
  name: string;
  description: string;
  taxRate: number; // percentage * 100
  specializations: string[];
  volume24h: string; // in wei
  status: 'active' | 'inactive' | 'destroyed';
  distance: number; // from player location
}

export function TradingInterface() {
  const currentUserId = "user1"; // This would come from auth context
  
  const {
    activeTab,
    selectedCategory,
    sortBy,
    searchQuery,
    selectedItems,
    setActiveTab,
    setSelectedCategory,
    setSortBy,
    setSearchQuery,
    toggleItemSelection,
    clearSelection
  } = useTradingState();

  const { account, isConnected, connectWallet } = useWeb3();
  const { listItemForSale, buyItem, createTradeEscrow } = useTradingContracts();

  // API queries
  const { data: userItems = [], isLoading: itemsLoading } = useUserItems(currentUserId);
  const { data: marketplaceListings = [], isLoading: listingsLoading } = useMarketplaceListings(selectedCategory, sortBy);
  const { data: tradeOffers = [], isLoading: offersLoading } = useTradeOffers(currentUserId);
  const { data: tradingPosts = [], isLoading: postsLoading } = useTradingPosts();
  const { data: escrowContracts = [], isLoading: escrowLoading } = useEscrowContracts(currentUserId);

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <RealisticWastelandCard variant="default" className="p-8 text-center">
        <RealisticText variant="subtitle" className="mb-4">
          Connect Wallet to Access Trading
        </RealisticText>
        <RealisticText variant="body" className="mb-6 text-neutral-400">
          Connect your Web3 wallet to access the wasteland trading hub and manage your NFT inventory.
        </RealisticText>
        <RealisticButton onClick={connectWallet} data-testid="button-connect-wallet">
          Connect Wallet
        </RealisticButton>
      </RealisticWastelandCard>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-neutral-400 border-neutral-400/30';
      case 'uncommon': return 'text-emerald-400 border-emerald-400/30';
      case 'rare': return 'text-blue-400 border-blue-400/30';
      case 'epic': return 'text-purple-400 border-purple-400/30';
      case 'legendary': return 'text-amber-400 border-amber-400/30';
      case 'artifact': return 'text-red-400 border-red-400/30';
      default: return 'text-neutral-400 border-neutral-400/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weapon': return '⚔️';
      case 'armor': return '🛡️';
      case 'tool': return '🔧';
      case 'consumable': return '⚗️';
      case 'blueprint': return '📋';
      case 'territory_deed': return '📜';
      default: return '📦';
    }
  };

  const formatPrice = (priceWei: string): string => {
    const eth = parseFloat(priceWei) / 1e18;
    return `${eth.toFixed(2)} ETH`;
  };

  const handleBuyItem = (listingId: string) => {
    console.log('Buying item from listing:', listingId);
    // Implementation would create escrow contract and initiate purchase
  };

  const handlePlaceBid = (listingId: string, amount: string) => {
    console.log('Placing bid on listing:', listingId, 'Amount:', amount);
    // Implementation would place bid on auction
  };

  const handleCreateListing = (itemId: string, price: string, listingType: string) => {
    console.log('Creating listing for item:', itemId, 'Price:', price, 'Type:', listingType);
    // Implementation would create marketplace listing
  };

  const handleCreateTradeOffer = (offer: Partial<TradeOffer>) => {
    console.log('Creating trade offer:', offer);
    // Implementation would create trade offer
  };

  const handleRespondToOffer = (offerId: string, response: 'accept' | 'decline') => {
    console.log('Responding to offer:', offerId, 'Response:', response);
    // Implementation would accept/decline trade offer
  };

  return (
    <RealisticWastelandCard variant="default" className="p-6">
      <RealisticText variant="subtitle" className="mb-6">
        Wasteland Trading Hub
      </RealisticText>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-neutral-900 border border-neutral-700">
          <TabsTrigger 
            value="marketplace" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Marketplace
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Inventory
          </TabsTrigger>
          <TabsTrigger 
            value="trades" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Trade Offers
          </TabsTrigger>
          <TabsTrigger 
            value="posts" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Trading Posts
          </TabsTrigger>
          <TabsTrigger 
            value="escrow" 
            className="text-xs font-mono data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100"
          >
            Escrow
          </TabsTrigger>
        </TabsList>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="mt-4">
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4 items-center">
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-neutral-100 max-w-xs"
                data-testid="input-search-marketplace"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-neutral-800 border-neutral-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="weapon">Weapons</SelectItem>
                  <SelectItem value="armor">Armor</SelectItem>
                  <SelectItem value="tool">Tools</SelectItem>
                  <SelectItem value="consumable">Consumables</SelectItem>
                  <SelectItem value="blueprint">Blueprints</SelectItem>
                  <SelectItem value="territory_deed">Territory Deeds</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-neutral-800 border-neutral-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rarity_desc">Rarity: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="ending_soon">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Marketplace Listings */}
            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listingsLoading ? (
                  <div className="col-span-2 text-center text-neutral-400">Loading marketplace...</div>
                ) : marketplaceListings.length === 0 ? (
                  <div className="col-span-2 text-center text-neutral-400">No marketplace listings found</div>
                ) : marketplaceListings.map((listing) => (
                  <Card key={listing.id} className="bg-neutral-800 border-neutral-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(listing.item.category)}</span>
                          <CardTitle className="text-neutral-100 text-sm">
                            {listing.item.name}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className={getRarityColor(listing.item.rarity)}>
                          {listing.item.rarity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <RealisticText variant="caption" className="text-neutral-400 line-clamp-2">
                        {listing.item.description}
                      </RealisticText>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Seller:</span>
                          <span className="text-neutral-100">{listing.sellerName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Price:</span>
                          <span className="text-emerald-400 font-mono">{formatPrice(listing.price)}</span>
                        </div>
                        {listing.listingType === 'auction' && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Highest Bid:</span>
                              <span className="text-amber-400 font-mono">
                                {listing.highestBid ? formatPrice(listing.highestBid) : 'No bids'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-400">Ends in:</span>
                              <span className="text-red-400">{listing.auctionEndTime}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {listing.listingType === 'fixed' ? (
                          <RealisticButton 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleBuyItem(listing.id)}
                            data-testid={`button-buy-${listing.id}`}
                          >
                            Buy Now
                          </RealisticButton>
                        ) : (
                          <RealisticButton 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handlePlaceBid(listing.id, '')}
                            data-testid={`button-bid-${listing.id}`}
                          >
                            Place Bid
                          </RealisticButton>
                        )}
                        <RealisticButton 
                          size="sm" 
                          variant="secondary"
                          data-testid={`button-details-${listing.id}`}
                        >
                          Details
                        </RealisticButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <RealisticText variant="body" className="text-neutral-300">
                Your Items ({userItems.length})
              </RealisticText>
              <RealisticButton size="sm" data-testid="button-list-selected">
                List Selected ({selectedItems.length})
              </RealisticButton>
            </div>

            <ScrollArea className="h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {itemsLoading ? (
                  <div className="col-span-2 text-center text-neutral-400">Loading your items...</div>
                ) : userItems.length === 0 ? (
                  <div className="col-span-2 text-center text-neutral-400">No items in your inventory</div>
                ) : userItems.map((item) => (
                  <Card key={item.id} className="bg-neutral-800 border-neutral-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([...selectedItems, item.id]);
                              } else {
                                setSelectedItems(selectedItems.filter(id => id !== item.id));
                              }
                            }}
                            className="rounded border-neutral-600"
                          />
                          <span className="text-lg">{getCategoryIcon(item.category)}</span>
                          <CardTitle className="text-neutral-100 text-sm">
                            {item.name}
                          </CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className={getRarityColor(item.rarity)}>
                            {item.rarity}
                          </Badge>
                          {item.isListed && (
                            <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                              Listed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <RealisticText variant="caption" className="text-neutral-400 line-clamp-2">
                        {item.description}
                      </RealisticText>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Est. Value:</span>
                          <span className="text-emerald-400 font-mono">{item.estimatedValue} ETH</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Token ID:</span>
                          <span className="text-neutral-100 font-mono">#{item.tokenId}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <RealisticButton 
                          size="sm" 
                          variant="secondary"
                          disabled={item.isListed}
                          data-testid={`button-list-item-${item.id}`}
                        >
                          {item.isListed ? 'Listed' : 'List for Sale'}
                        </RealisticButton>
                        <RealisticButton 
                          size="sm" 
                          variant="secondary"
                          data-testid={`button-trade-item-${item.id}`}
                        >
                          Trade
                        </RealisticButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Trade Offers Tab */}
        <TabsContent value="trades" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <RealisticText variant="body" className="text-neutral-300">
                Trade Offers ({tradeOffers.length})
              </RealisticText>
              <RealisticButton size="sm" data-testid="button-create-offer">
                Create Trade Offer
              </RealisticButton>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-4">
                {offersLoading ? (
                  <div className="text-center text-neutral-400">Loading trade offers...</div>
                ) : tradeOffers.length === 0 ? (
                  <div className="text-center text-neutral-400">No trade offers</div>
                ) : tradeOffers.map((offer) => (
                  <Card key={offer.id} className="bg-neutral-800 border-neutral-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-neutral-100 text-sm">
                            Trade with {offer.fromUserName}
                          </CardTitle>
                          <RealisticText variant="caption" className="text-neutral-400">
                            {offer.createdAt} • Expires in {offer.expiresAt}
                          </RealisticText>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            offer.status === 'pending' ? 'text-amber-400 border-amber-400/30' :
                            offer.status === 'accepted' ? 'text-emerald-400 border-emerald-400/30' :
                            'text-red-400 border-red-400/30'
                          }
                        >
                          {offer.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {offer.message && (
                        <div className="p-3 bg-neutral-900 border border-neutral-700 rounded">
                          <RealisticText variant="caption" className="text-neutral-300">
                            "{offer.message}"
                          </RealisticText>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <RealisticText variant="caption" className="text-neutral-400 mb-2">
                            They Offer:
                          </RealisticText>
                          <div className="space-y-2">
                            {offer.offeredItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-2 p-2 bg-neutral-900 rounded">
                                <span>{getCategoryIcon(item.category)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-neutral-100 truncate">{item.name}</div>
                                  <div className="text-xs text-neutral-400">~{item.estimatedValue} ETH</div>
                                </div>
                              </div>
                            ))}
                            {offer.offeredTokens !== '0' && (
                              <div className="flex items-center gap-2 p-2 bg-neutral-900 rounded">
                                <span>💰</span>
                                <div className="flex-1">
                                  <div className="text-xs text-emerald-400 font-mono">
                                    +{formatPrice(offer.offeredTokens)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <RealisticText variant="caption" className="text-neutral-400 mb-2">
                            For Your:
                          </RealisticText>
                          <div className="space-y-2">
                            {offer.requestedItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-2 p-2 bg-neutral-900 rounded">
                                <span>{getCategoryIcon(item.category)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-neutral-100 truncate">{item.name}</div>
                                  <div className="text-xs text-neutral-400">~{item.estimatedValue} ETH</div>
                                </div>
                              </div>
                            ))}
                            {offer.requestedTokens !== '0' && (
                              <div className="flex items-center gap-2 p-2 bg-neutral-900 rounded">
                                <span>💰</span>
                                <div className="flex-1">
                                  <div className="text-xs text-red-400 font-mono">
                                    -{formatPrice(offer.requestedTokens)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {offer.status === 'pending' && (
                        <div className="flex gap-2">
                          <RealisticButton 
                            size="sm" 
                            onClick={() => handleRespondToOffer(offer.id, 'accept')}
                            data-testid={`button-accept-${offer.id}`}
                          >
                            Accept
                          </RealisticButton>
                          <RealisticButton 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleRespondToOffer(offer.id, 'decline')}
                            data-testid={`button-decline-${offer.id}`}
                          >
                            Decline
                          </RealisticButton>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Trading Posts Tab */}
        <TabsContent value="posts" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <RealisticText variant="body" className="text-neutral-300">
                Nearby Trading Posts ({tradingPosts.length})
              </RealisticText>
              <RealisticButton size="sm" data-testid="button-create-post">
                Establish Trading Post
              </RealisticButton>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-4">
                {postsLoading ? (
                  <div className="text-center text-neutral-400">Loading trading posts...</div>
                ) : tradingPosts.length === 0 ? (
                  <div className="text-center text-neutral-400">No trading posts found</div>
                ) : tradingPosts.map((post) => (
                  <Card key={post.id} className="bg-neutral-800 border-neutral-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-neutral-100 text-sm">
                            {post.name}
                          </CardTitle>
                          <RealisticText variant="caption" className="text-neutral-400">
                            {post.territoryName} • {post.distance}km away
                          </RealisticText>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            post.status === 'active' ? 'text-emerald-400 border-emerald-400/30' :
                            'text-red-400 border-red-400/30'
                          }
                        >
                          {post.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <RealisticText variant="caption" className="text-neutral-400">
                        {post.description}
                      </RealisticText>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Owner:</span>
                          <span className="text-neutral-100">{post.ownerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Tax Rate:</span>
                          <span className="text-amber-400">{(post.taxRate / 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">24h Volume:</span>
                          <span className="text-emerald-400 font-mono">{formatPrice(post.volume24h)}</span>
                        </div>
                      </div>

                      <div>
                        <RealisticText variant="caption" className="text-neutral-400 mb-1">
                          Specializations:
                        </RealisticText>
                        <div className="flex gap-1 flex-wrap">
                          {post.specializations.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs text-neutral-300 border-neutral-600">
                              {getCategoryIcon(spec)} {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <RealisticButton 
                          size="sm"
                          data-testid={`button-visit-${post.id}`}
                        >
                          Visit Post
                        </RealisticButton>
                        <RealisticButton 
                          size="sm" 
                          variant="secondary"
                          data-testid={`button-details-post-${post.id}`}
                        >
                          View Details
                        </RealisticButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Escrow Tab */}
        <TabsContent value="escrow" className="mt-4">
          <div className="space-y-4">
            <RealisticText variant="body" className="text-neutral-300">
              Active Escrow Contracts ({escrowContracts.length})
            </RealisticText>

            {escrowLoading ? (
              <div className="p-6 bg-neutral-900 border border-neutral-700 rounded text-center">
                <RealisticText variant="caption" className="text-neutral-400">
                  Loading escrow contracts...
                </RealisticText>
              </div>
            ) : escrowContracts.length === 0 ? (
              <div className="p-6 bg-neutral-900 border border-neutral-700 rounded text-center">
                <RealisticText variant="caption" className="text-neutral-400">
                  No active escrow contracts
                </RealisticText>
                <RealisticText variant="caption" className="text-neutral-500 mt-2">
                  Escrow contracts are automatically created when you buy items or accept trade offers
                </RealisticText>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {escrowContracts.map((contract) => (
                    <Card key={contract.id} className="bg-neutral-800 border-neutral-700">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-neutral-100 text-sm">
                            Escrow #{contract.id.substring(0, 8)}
                          </CardTitle>
                          <Badge 
                            variant="outline" 
                            className={
                              contract.status === 'active' ? 'text-amber-400 border-amber-400/30' :
                              contract.status === 'completed' ? 'text-emerald-400 border-emerald-400/30' :
                              contract.status === 'disputed' ? 'text-red-400 border-red-400/30' :
                              'text-neutral-400 border-neutral-400/30'
                            }
                          >
                            {contract.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Amount:</span>
                            <span className="text-emerald-400 font-mono">{formatPrice(contract.amount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Created:</span>
                            <span className="text-neutral-100">{new Date(contract.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        {contract.status === 'active' && (
                          <div className="flex gap-2">
                            <RealisticButton 
                              size="sm"
                              data-testid={`button-complete-escrow-${contract.id}`}
                            >
                              Complete
                            </RealisticButton>
                            <RealisticButton 
                              size="sm" 
                              variant="secondary"
                              data-testid={`button-dispute-escrow-${contract.id}`}
                            >
                              Dispute
                            </RealisticButton>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="p-4 bg-neutral-900 border border-neutral-700 rounded">
              <RealisticText variant="subtitle" className="mb-3 text-neutral-100">
                Escrow System Features
              </RealisticText>
              <div className="space-y-2 text-sm text-neutral-400">
                <div>• Automated smart contract protection for all trades</div>
                <div>• Dispute resolution system with community arbitrators</div>
                <div>• Item verification and authenticity checks</div>
                <div>• Automatic release upon successful delivery</div>
                <div>• Emergency cancellation with full refunds</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </RealisticWastelandCard>
  );
}