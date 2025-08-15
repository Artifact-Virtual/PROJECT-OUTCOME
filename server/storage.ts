import { 
  users, alliances, allianceMembers, territories, battles, messages, courierTransactions,
  items, marketplaceListings, tradeOffers, escrowContracts, tradingPosts, nftMints,
  type User, type InsertUser, type Alliance, type InsertAlliance, 
  type AllianceMember, type InsertAllianceMember, type Territory, type InsertTerritory,
  type Battle, type InsertBattle, type Message, type InsertMessage,
  type CourierTransaction, type InsertCourierTransaction,
  type Item, type InsertItem, type MarketplaceListing, type InsertMarketplaceListing,
  type TradeOffer, type InsertTradeOffer, type EscrowContract, type InsertEscrowContract,
  type TradingPost, type InsertTradingPost, type NftMint, type InsertNftMint
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByAddress(address: string): Promise<User | undefined>;
  getUserByCallSign(callSign: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Alliance operations
  getAlliance(id: string): Promise<Alliance | undefined>;
  createAlliance(alliance: InsertAlliance): Promise<Alliance>;
  getUserAlliance(userId: string): Promise<{ alliance: Alliance; member: AllianceMember } | undefined>;
  joinAlliance(userId: string, allianceId: string, role?: string): Promise<AllianceMember>;
  
  // Territory operations
  getTerritory(x: number, y: number): Promise<Territory | undefined>;
  getTerritories(limit?: number): Promise<Territory[]>;
  claimTerritory(territoryData: InsertTerritory): Promise<Territory>;
  getUserTerritories(userId: string): Promise<Territory[]>;
  
  // Battle operations
  createBattle(battle: InsertBattle): Promise<Battle>;
  getBattle(id: string): Promise<Battle | undefined>;
  completeBattle(id: string, winnerId: string): Promise<Battle>;
  getUserBattles(userId: string, limit?: number): Promise<Battle[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(channel: string, allianceId?: string, limit?: number): Promise<Message[]>;
  
  // Courier operations
  createCourierTransaction(transaction: InsertCourierTransaction): Promise<CourierTransaction>;
  getCourierTransaction(id: string): Promise<CourierTransaction | undefined>;
  updateCourierTransaction(id: string, updates: Partial<CourierTransaction>): Promise<CourierTransaction>;
  getUserCourierTransactions(userId: string): Promise<CourierTransaction[]>;
  
  // Leaderboard
  getLeaderboard(limit?: number): Promise<User[]>;
  
  // Trading operations
  createItem(item: InsertItem): Promise<Item>;
  getItem(id: string): Promise<Item | undefined>;
  getUserItems(userId: string): Promise<Item[]>;
  updateItem(id: string, updates: Partial<Item>): Promise<Item>;
  
  // Marketplace operations
  createListing(listing: InsertMarketplaceListing): Promise<MarketplaceListing>;
  getListing(id: string): Promise<MarketplaceListing | undefined>;
  getMarketplaceListings(category?: string, sortBy?: string, limit?: number): Promise<MarketplaceListing[]>;
  updateListing(id: string, updates: Partial<MarketplaceListing>): Promise<MarketplaceListing>;
  
  // Trade offers
  createTradeOffer(offer: InsertTradeOffer): Promise<TradeOffer>;
  getTradeOffer(id: string): Promise<TradeOffer | undefined>;
  getUserTradeOffers(userId: string, type?: 'sent' | 'received'): Promise<TradeOffer[]>;
  updateTradeOffer(id: string, updates: Partial<TradeOffer>): Promise<TradeOffer>;
  
  // Escrow contracts
  createEscrowContract(contract: InsertEscrowContract): Promise<EscrowContract>;
  getEscrowContract(id: string): Promise<EscrowContract | undefined>;
  getUserEscrowContracts(userId: string, type?: 'buyer' | 'seller'): Promise<EscrowContract[]>;
  updateEscrowContract(id: string, updates: Partial<EscrowContract>): Promise<EscrowContract>;
  
  // Trading posts
  createTradingPost(post: InsertTradingPost): Promise<TradingPost>;
  getTradingPost(id: string): Promise<TradingPost | undefined>;
  getTradingPosts(territoryId?: string): Promise<TradingPost[]>;
  updateTradingPost(id: string, updates: Partial<TradingPost>): Promise<TradingPost>;
  
  // NFT Minting operations
  checkNftEligibility(walletAddress: string): Promise<{ eligible: boolean; reason?: string }>;
  createNftMint(mint: InsertNftMint): Promise<NftMint>;
  getNftMint(tokenId: string): Promise<NftMint | undefined>;
  getNftMintByWallet(walletAddress: string): Promise<NftMint | undefined>;
  updateNftMint(tokenId: string, updates: Partial<NftMint>): Promise<NftMint>;
  confirmNftMint(tokenId: string, userId: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByAddress(address: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.address, address));
    return user || undefined;
  }

  async getUserByCallSign(callSign: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.callSign, callSign));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async getAlliance(id: string): Promise<Alliance | undefined> {
    const [alliance] = await db.select().from(alliances).where(eq(alliances.id, id));
    return alliance || undefined;
  }

  async createAlliance(insertAlliance: InsertAlliance): Promise<Alliance> {
    const [alliance] = await db.insert(alliances).values(insertAlliance).returning();
    return alliance;
  }

  async getUserAlliance(userId: string): Promise<{ alliance: Alliance; member: AllianceMember } | undefined> {
    const result = await db
      .select()
      .from(allianceMembers)
      .innerJoin(alliances, eq(allianceMembers.allianceId, alliances.id))
      .where(eq(allianceMembers.userId, userId))
      .limit(1);

    if (result.length === 0) return undefined;

    return {
      alliance: result[0].alliances,
      member: result[0].alliance_members,
    };
  }

  async joinAlliance(userId: string, allianceId: string, role: string = "member"): Promise<AllianceMember> {
    const [member] = await db
      .insert(allianceMembers)
      .values({ userId, allianceId, role })
      .returning();

    // Update alliance member count
    await db
      .update(alliances)
      .set({ memberCount: sql`member_count + 1` })
      .where(eq(alliances.id, allianceId));

    return member;
  }

  async getTerritory(x: number, y: number): Promise<Territory | undefined> {
    const [territory] = await db
      .select()
      .from(territories)
      .where(and(eq(territories.x, x), eq(territories.y, y)));
    return territory || undefined;
  }

  async getTerritories(limit: number = 100): Promise<Territory[]> {
    return await db.select().from(territories).limit(limit);
  }

  async claimTerritory(territoryData: InsertTerritory): Promise<Territory> {
    const [territory] = await db.insert(territories).values(territoryData).returning();
    return territory;
  }

  async getUserTerritories(userId: string): Promise<Territory[]> {
    return await db.select().from(territories).where(eq(territories.ownerId, userId));
  }

  async createBattle(battle: InsertBattle): Promise<Battle> {
    const [newBattle] = await db.insert(battles).values(battle).returning();
    return newBattle;
  }

  async getBattle(id: string): Promise<Battle | undefined> {
    const [battle] = await db.select().from(battles).where(eq(battles.id, id));
    return battle || undefined;
  }

  async completeBattle(id: string, winnerId: string): Promise<Battle> {
    const [battle] = await db
      .update(battles)
      .set({
        winnerId,
        status: "completed",
        completedAt: sql`now()`,
      })
      .where(eq(battles.id, id))
      .returning();

    // Update user stats
    const battleData = await this.getBattle(id);
    if (battleData) {
      // Winner gets +100 XP
      await db
        .update(users)
        .set({
          xp: sql`xp + 100`,
          wins: sql`wins + 1`,
          reputation: sql`reputation + 10`,
        })
        .where(eq(users.id, winnerId));

      // Loser gets +25 XP
      const loserId = winnerId === battleData.challengerId ? battleData.defenderId : battleData.challengerId;
      await db
        .update(users)
        .set({
          xp: sql`xp + 25`,
          losses: sql`losses + 1`,
        })
        .where(eq(users.id, loserId));
    }

    return battle;
  }

  async getUserBattles(userId: string, limit: number = 10): Promise<Battle[]> {
    return await db
      .select()
      .from(battles)
      .where(or(eq(battles.challengerId, userId), eq(battles.defenderId, userId)))
      .orderBy(desc(battles.createdAt))
      .limit(limit);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    
    // Update user message count
    await db
      .update(users)
      .set({
        messageCount: sql`message_count + 1`,
        lastMessageTime: sql`now()`,
      })
      .where(eq(users.id, message.senderId));

    return newMessage;
  }

  async getMessages(channel: string, allianceId?: string, limit: number = 50): Promise<Message[]> {
    let query = db
      .select()
      .from(messages)
      .where(eq(messages.channel, channel))
      .orderBy(desc(messages.createdAt))
      .limit(limit);

    if (allianceId && channel === "alliance") {
      query = db
        .select()
        .from(messages)
        .where(and(eq(messages.channel, channel), eq(messages.allianceId, allianceId)))
        .orderBy(desc(messages.createdAt))
        .limit(limit);
    }

    return await query;
  }

  async createCourierTransaction(transaction: InsertCourierTransaction): Promise<CourierTransaction> {
    const [newTransaction] = await db.insert(courierTransactions).values(transaction).returning();
    return newTransaction;
  }

  async getCourierTransaction(id: string): Promise<CourierTransaction | undefined> {
    const [transaction] = await db.select().from(courierTransactions).where(eq(courierTransactions.id, id));
    return transaction || undefined;
  }

  async updateCourierTransaction(id: string, updates: Partial<CourierTransaction>): Promise<CourierTransaction> {
    const [transaction] = await db
      .update(courierTransactions)
      .set(updates)
      .where(eq(courierTransactions.id, id))
      .returning();
    return transaction;
  }

  async getUserCourierTransactions(userId: string): Promise<CourierTransaction[]> {
    return await db
      .select()
      .from(courierTransactions)
      .where(eq(courierTransactions.userId, userId))
      .orderBy(desc(courierTransactions.createdAt));
  }

  async getLeaderboard(limit: number = 10): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.xp))
      .limit(limit);
  }

  // Trading operations
  async createItem(insertItem: InsertItem): Promise<Item> {
    const [item] = await db.insert(items).values(insertItem).returning();
    return item;
  }

  async getItem(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async getUserItems(userId: string): Promise<Item[]> {
    const userItems = await db.select().from(items).where(eq(items.ownerId, userId));
    return userItems;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    const [item] = await db.update(items).set(updates).where(eq(items.id, id)).returning();
    return item;
  }

  // Marketplace operations
  async createListing(insertListing: InsertMarketplaceListing): Promise<MarketplaceListing> {
    const [listing] = await db.insert(marketplaceListings).values(insertListing).returning();
    return listing;
  }

  async getListing(id: string): Promise<MarketplaceListing | undefined> {
    const [listing] = await db.select().from(marketplaceListings).where(eq(marketplaceListings.id, id));
    return listing || undefined;
  }

  async getMarketplaceListings(category?: string, sortBy?: string, limit: number = 50): Promise<MarketplaceListing[]> {
    let query = db.select().from(marketplaceListings)
      .where(eq(marketplaceListings.status, 'active'));

    if (category && category !== 'all') {
      query = query.innerJoin(items, eq(marketplaceListings.itemId, items.id))
        .where(and(
          eq(marketplaceListings.status, 'active'),
          eq(items.category, category)
        ));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        query = query.orderBy(marketplaceListings.price);
        break;
      case 'price_desc':
        query = query.orderBy(desc(marketplaceListings.price));
        break;
      case 'newest':
        query = query.orderBy(desc(marketplaceListings.createdAt));
        break;
      default:
        query = query.orderBy(marketplaceListings.createdAt);
    }

    const listings = await query.limit(limit);
    return listings;
  }

  async updateListing(id: string, updates: Partial<MarketplaceListing>): Promise<MarketplaceListing> {
    const [listing] = await db.update(marketplaceListings).set(updates).where(eq(marketplaceListings.id, id)).returning();
    return listing;
  }

  // Trade offers
  async createTradeOffer(insertOffer: InsertTradeOffer): Promise<TradeOffer> {
    const [offer] = await db.insert(tradeOffers).values(insertOffer).returning();
    return offer;
  }

  async getTradeOffer(id: string): Promise<TradeOffer | undefined> {
    const [offer] = await db.select().from(tradeOffers).where(eq(tradeOffers.id, id));
    return offer || undefined;
  }

  async getUserTradeOffers(userId: string, type?: 'sent' | 'received'): Promise<TradeOffer[]> {
    let query = db.select().from(tradeOffers);
    
    if (type === 'sent') {
      query = query.where(eq(tradeOffers.fromUserId, userId));
    } else if (type === 'received') {
      query = query.where(eq(tradeOffers.toUserId, userId));
    } else {
      query = query.where(or(
        eq(tradeOffers.fromUserId, userId),
        eq(tradeOffers.toUserId, userId)
      ));
    }

    const offers = await query.orderBy(desc(tradeOffers.createdAt));
    return offers;
  }

  async updateTradeOffer(id: string, updates: Partial<TradeOffer>): Promise<TradeOffer> {
    const [offer] = await db.update(tradeOffers).set(updates).where(eq(tradeOffers.id, id)).returning();
    return offer;
  }

  // Escrow contracts
  async createEscrowContract(insertContract: InsertEscrowContract): Promise<EscrowContract> {
    const [contract] = await db.insert(escrowContracts).values(insertContract).returning();
    return contract;
  }

  async getEscrowContract(id: string): Promise<EscrowContract | undefined> {
    const [contract] = await db.select().from(escrowContracts).where(eq(escrowContracts.id, id));
    return contract || undefined;
  }

  async getUserEscrowContracts(userId: string, type?: 'buyer' | 'seller'): Promise<EscrowContract[]> {
    let query = db.select().from(escrowContracts);
    
    if (type === 'buyer') {
      query = query.where(eq(escrowContracts.buyerId, userId));
    } else if (type === 'seller') {
      query = query.where(eq(escrowContracts.sellerId, userId));
    } else {
      query = query.where(or(
        eq(escrowContracts.buyerId, userId),
        eq(escrowContracts.sellerId, userId)
      ));
    }

    const contracts = await query.orderBy(desc(escrowContracts.createdAt));
    return contracts;
  }

  async updateEscrowContract(id: string, updates: Partial<EscrowContract>): Promise<EscrowContract> {
    const [contract] = await db.update(escrowContracts).set(updates).where(eq(escrowContracts.id, id)).returning();
    return contract;
  }

  // Trading posts
  async createTradingPost(insertPost: InsertTradingPost): Promise<TradingPost> {
    const [post] = await db.insert(tradingPosts).values(insertPost).returning();
    return post;
  }

  async getTradingPost(id: string): Promise<TradingPost | undefined> {
    const [post] = await db.select().from(tradingPosts).where(eq(tradingPosts.id, id));
    return post || undefined;
  }

  async getTradingPosts(territoryId?: string): Promise<TradingPost[]> {
    let query = db.select().from(tradingPosts).where(eq(tradingPosts.status, 'active'));
    
    if (territoryId) {
      query = query.where(and(
        eq(tradingPosts.status, 'active'),
        eq(tradingPosts.territoryId, territoryId)
      ));
    }

    const posts = await query.orderBy(desc(tradingPosts.volume24h));
    return posts;
  }

  async updateTradingPost(id: string, updates: Partial<TradingPost>): Promise<TradingPost> {
    const [post] = await db.update(tradingPosts).set(updates).where(eq(tradingPosts.id, id)).returning();
    return post;
  }

  // NFT Minting operations
  async checkNftEligibility(walletAddress: string): Promise<{ eligible: boolean; reason?: string }> {
    // Check if wallet already has an NFT
    const existingMint = await db.select().from(nftMints).where(eq(nftMints.walletAddress, walletAddress));
    
    if (existingMint.length > 0) {
      return { eligible: false, reason: "Wallet already owns an OCSH NFT. Only 1 NFT per wallet is allowed." };
    }
    
    // Check if user already has NFT through user table
    const existingUser = await db.select().from(users).where(and(
      eq(users.address, walletAddress),
      eq(users.hasNft, true)
    ));
    
    if (existingUser.length > 0) {
      return { eligible: false, reason: "User already owns an OCSH NFT." };
    }
    
    return { eligible: true };
  }

  async createNftMint(insertMint: InsertNftMint): Promise<NftMint> {
    const [mint] = await db.insert(nftMints).values(insertMint).returning();
    return mint;
  }

  async getNftMint(tokenId: string): Promise<NftMint | undefined> {
    const [mint] = await db.select().from(nftMints).where(eq(nftMints.tokenId, tokenId));
    return mint || undefined;
  }

  async getNftMintByWallet(walletAddress: string): Promise<NftMint | undefined> {
    const [mint] = await db.select().from(nftMints).where(eq(nftMints.walletAddress, walletAddress));
    return mint || undefined;
  }

  async updateNftMint(tokenId: string, updates: Partial<NftMint>): Promise<NftMint> {
    const [mint] = await db.update(nftMints).set(updates).where(eq(nftMints.tokenId, tokenId)).returning();
    return mint;
  }

  async confirmNftMint(tokenId: string, userId: string): Promise<User> {
    // Get the mint record
    const mint = await this.getNftMint(tokenId);
    if (!mint) {
      throw new Error("NFT mint not found");
    }

    // Update user with NFT information
    const [user] = await db.update(users).set({
      tokenId: tokenId,
      hasNft: true,
      selectedTerritoryX: mint.selectedTerritoryX,
      selectedTerritoryY: mint.selectedTerritoryY,
      nftMintedAt: new Date()
    }).where(eq(users.id, userId)).returning();

    // Update mint status to confirmed
    await this.updateNftMint(tokenId, { status: 'confirmed' });

    // Auto-claim the selected territory if available
    const existingTerritory = await this.getTerritory(mint.selectedTerritoryX, mint.selectedTerritoryY);
    if (!existingTerritory || existingTerritory.ownerId === null) {
      await this.claimTerritory({
        x: mint.selectedTerritoryX,
        y: mint.selectedTerritoryY,
        ownerId: userId,
        claimedAt: new Date(),
        controlEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        status: "claimed"
      });
    }

    return user;
  }
}

export const storage = new DatabaseStorage();
