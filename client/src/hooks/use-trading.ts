import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// API Types
interface ApiItem {
  id: string;
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  category: string;
  rarity: string;
  attributes: Record<string, any>;
  imageUrl?: string;
  ownerId: string;
  isListed: boolean;
  createdAt: string;
}

interface ApiMarketplaceListing {
  id: string;
  itemId: string;
  sellerId: string;
  price: string;
  currency: string;
  listingType: string;
  status: string;
  auctionEndTime?: string;
  reservePrice?: string;
  txHash?: string;
  createdAt: string;
  soldAt?: string;
}

interface ApiTradeOffer {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredItems: string[];
  requestedItems: string[];
  offeredTokens: string;
  requestedTokens: string;
  message?: string;
  status: string;
  expiresAt?: string;
  txHash?: string;
  createdAt: string;
}

interface ApiEscrowContract {
  id: string;
  contractAddress: string;
  buyerId: string;
  sellerId: string;
  itemId?: string;
  tradeOfferId?: string;
  amount: string;
  status: string;
  disputeReason?: string;
  resolutionData?: any;
  createdTxHash?: string;
  completedTxHash?: string;
  createdAt: string;
  completedAt?: string;
}

interface ApiTradingPost {
  id: string;
  territoryId: string;
  ownerId: string;
  name: string;
  description: string;
  taxRate: number;
  specializations: string[];
  volume24h: string;
  status: string;
  createdAt: string;
}

// Custom hooks for trading functionality
export function useUserItems(userId: string) {
  return useQuery({
    queryKey: ['/api/items', userId],
    queryFn: () => apiRequest(`/api/items?userId=${userId}`) as Promise<ApiItem[]>,
    enabled: !!userId,
  });
}

export function useMarketplaceListings(category?: string, sortBy?: string) {
  return useQuery({
    queryKey: ['/api/marketplace', category, sortBy],
    queryFn: () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (sortBy) params.append('sortBy', sortBy);
      return apiRequest(`/api/marketplace?${params.toString()}`) as Promise<ApiMarketplaceListing[]>;
    },
  });
}

export function useTradeOffers(userId: string, type?: 'sent' | 'received') {
  return useQuery({
    queryKey: ['/api/trades', userId, type],
    queryFn: () => {
      const params = new URLSearchParams({ userId });
      if (type) params.append('type', type);
      return apiRequest(`/api/trades?${params.toString()}`) as Promise<ApiTradeOffer[]>;
    },
    enabled: !!userId,
  });
}

export function useEscrowContracts(userId: string, type?: 'buyer' | 'seller') {
  return useQuery({
    queryKey: ['/api/escrow', userId, type],
    queryFn: () => {
      const params = new URLSearchParams({ userId });
      if (type) params.append('type', type);
      return apiRequest(`/api/escrow?${params.toString()}`) as Promise<ApiEscrowContract[]>;
    },
    enabled: !!userId,
  });
}

export function useTradingPosts(territoryId?: string) {
  return useQuery({
    queryKey: ['/api/trading-posts', territoryId],
    queryFn: () => {
      const params = new URLSearchParams();
      if (territoryId) params.append('territoryId', territoryId);
      return apiRequest(`/api/trading-posts?${params.toString()}`) as Promise<ApiTradingPost[]>;
    },
  });
}

// Mutation hooks for trading actions
export function useCreateListing() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listingData: {
      itemId: string;
      sellerId: string;
      price: string;
      currency?: string;
      listingType?: string;
    }) => apiRequest('/api/marketplace', {
      method: 'POST',
      body: JSON.stringify(listingData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    },
  });
}

export function useBuyItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ listingId, buyerId, escrowData }: {
      listingId: string;
      buyerId: string;
      escrowData: { contractAddress: string; txHash: string };
    }) => apiRequest(`/api/marketplace/${listingId}/buy`, {
      method: 'POST',
      body: JSON.stringify({ buyerId, escrowData }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/marketplace'] });
      queryClient.invalidateQueries({ queryKey: ['/api/escrow'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    },
  });
}

export function useCreateTradeOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (offerData: {
      fromUserId: string;
      toUserId: string;
      offeredItems: string[];
      requestedItems: string[];
      offeredTokens?: string;
      requestedTokens?: string;
      message?: string;
      expiresAt?: string;
    }) => apiRequest('/api/trades', {
      method: 'POST',
      body: JSON.stringify(offerData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
    },
  });
}

export function useRespondToTradeOffer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ offerId, response, txHash }: {
      offerId: string;
      response: 'accept' | 'decline';
      txHash?: string;
    }) => apiRequest(`/api/trades/${offerId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response, txHash }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trades'] });
      queryClient.invalidateQueries({ queryKey: ['/api/escrow'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    },
  });
}

export function useCompleteEscrow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ escrowId, txHash }: { escrowId: string; txHash: string }) => 
      apiRequest(`/api/escrow/${escrowId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ txHash }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/escrow'] });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    },
  });
}

export function useDisputeEscrow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ escrowId, reason, evidence }: {
      escrowId: string;
      reason: string;
      evidence: any;
    }) => apiRequest(`/api/escrow/${escrowId}/dispute`, {
      method: 'POST',
      body: JSON.stringify({ reason, evidence }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/escrow'] });
    },
  });
}

export function useCreateTradingPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postData: {
      territoryId: string;
      ownerId: string;
      name: string;
      description: string;
      taxRate: number;
      specializations: string[];
    }) => apiRequest('/api/trading-posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trading-posts'] });
    },
  });
}

// Trading state management hook
export function useTradingState() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('price_asc');
  const [activeTab, setActiveTab] = useState('marketplace');

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('price_asc');
  };

  return {
    selectedItems,
    searchQuery,
    selectedCategory,
    sortBy,
    activeTab,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setActiveTab,
    toggleItemSelection,
    clearSelection,
    resetFilters,
  };
}