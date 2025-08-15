import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull().unique(),
  callSign: text("call_sign").notNull().unique(),
  tokenId: text("token_id").unique(), // NFT token ID (null if not minted)
  hasNft: boolean("has_nft").notNull().default(false),
  selectedTerritoryX: integer("selected_territory_x"), // Territory chosen during minting
  selectedTerritoryY: integer("selected_territory_y"),
  nftMintedAt: timestamp("nft_minted_at"), // When NFT was minted
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  reputation: integer("reputation").notNull().default(0),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  messageCount: integer("message_count").notNull().default(0),
  lastMessageTime: timestamp("last_message_time"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const alliances = pgTable("alliances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  tag: text("tag").notNull().unique(),
  leaderId: varchar("leader_id").notNull().references(() => users.id),
  memberCount: integer("member_count").notNull().default(1),
  territoryCount: integer("territory_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const allianceMembers = pgTable("alliance_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  allianceId: varchar("alliance_id").notNull().references(() => alliances.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default("member"), // leader, member, invited
  joinedAt: timestamp("joined_at").notNull().default(sql`now()`),
});

export const territories = pgTable("territories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  ownerId: varchar("owner_id").references(() => users.id),
  allianceId: varchar("alliance_id").references(() => alliances.id),
  claimedAt: timestamp("claimed_at"),
  controlEndsAt: timestamp("control_ends_at"),
  status: text("status").notNull().default("unclaimed"), // unclaimed, claimed, contested
});

export const battles = pgTable("battles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengerId: varchar("challenger_id").notNull().references(() => users.id),
  defenderId: varchar("defender_id").notNull().references(() => users.id),
  winnerId: varchar("winner_id").references(() => users.id),
  territoryId: varchar("territory_id").references(() => territories.id),
  status: text("status").notNull().default("pending"), // pending, completed, cancelled
  battleData: jsonb("battle_data"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  completedAt: timestamp("completed_at"),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  channel: text("channel").notNull().default("global"), // global, alliance
  allianceId: varchar("alliance_id").references(() => alliances.id),
  txHash: text("tx_hash"),
  fee: text("fee"), // in wei
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const courierTransactions = pgTable("courier_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  txHex: text("tx_hex").notNull(),
  encodedFrames: text("encoded_frames").notNull(),
  status: text("status").notNull().default("pending"), // pending, encoded, transmitted, confirmed
  channel: text("channel"), // radio, sms, mesh
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  transmittedAt: timestamp("transmitted_at"),
  confirmedAt: timestamp("confirmed_at"),
});

// Trading System Tables
export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: text("token_id").notNull().unique(),
  contractAddress: text("contract_address").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // weapon, armor, tool, consumable, blueprint, territory_deed
  rarity: text("rarity").notNull().default("common"), // common, uncommon, rare, epic, legendary, artifact
  attributes: jsonb("attributes"), // item stats, abilities, etc.
  imageUrl: text("image_url"),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  isListed: boolean("is_listed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const marketplaceListings = pgTable("marketplace_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  price: text("price").notNull(), // in wei
  currency: text("currency").notNull().default("ETH"), // ETH, USDC, etc.
  listingType: text("listing_type").notNull().default("fixed"), // fixed, auction, bundle
  status: text("status").notNull().default("active"), // active, sold, cancelled, expired
  auctionEndTime: timestamp("auction_end_time"),
  reservePrice: text("reserve_price"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  soldAt: timestamp("sold_at"),
});

// Player Inventory System for Strategic Items
export const playerItems = pgTable("player_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemId: text("item_id").notNull(), // References game-items.ts strategic items
  quantity: integer("quantity").notNull().default(1),
  isActive: boolean("is_active").notNull().default(false), // Whether item effects are currently applied
  durability: integer("durability"), // For depleting items
  expiresAt: timestamp("expires_at"), // For temporary items
  acquiredAt: timestamp("acquired_at").notNull().default(sql`now()`),
});

// Item Usage Tracking - Track when consumables/temporary items are used
export const itemUsageLog = pgTable("item_usage_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemId: text("item_id").notNull(),
  usageType: text("usage_type").notNull(), // 'consumed', 'activated', 'expired', 'depleted'
  effectsApplied: jsonb("effects_applied"), // What effects were applied
  usedAt: timestamp("used_at").notNull().default(sql`now()`),
});

// Active Item Effects - Track currently active temporary effects
export const activeItemEffects = pgTable("active_item_effects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  itemId: text("item_id").notNull(),
  effectType: text("effect_type").notNull(),
  effectValue: integer("effect_value").notNull(),
  expiresAt: timestamp("expires_at"), // When effect ends
  appliedAt: timestamp("applied_at").notNull().default(sql`now()`),
});

// Strategic Item Marketplace (Base ETH + ARCx tokens)
export const strategicItemListings = pgTable("strategic_item_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  itemId: text("item_id").notNull(), // References strategic items from game-items.ts
  quantity: integer("quantity").notNull().default(1),
  priceETH: text("price_eth"), // Price in Base ETH (wei)
  priceARCX: text("price_arcx"), // Alternative price in ARCx tokens
  currency: text("currency").notNull().default("ETH"), // ETH or ARCX
  status: text("status").notNull().default("active"), // active, sold, cancelled
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  expiresAt: timestamp("expires_at"),
});

// Strategic Item Purchase Transactions
export const strategicItemTransactions = pgTable("strategic_item_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  listingId: varchar("listing_id").notNull().references(() => strategicItemListings.id),
  itemId: text("item_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: text("price").notNull(), // Amount paid (in wei for ETH or tokens for ARCx)
  currency: text("currency").notNull(),
  txHash: text("tx_hash"), // Blockchain transaction hash
  status: text("status").notNull().default("pending"), // pending, completed, failed
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const tradeOffers = pgTable("trade_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fromUserId: varchar("from_user_id").notNull().references(() => users.id),
  toUserId: varchar("to_user_id").notNull().references(() => users.id),
  offeredItems: jsonb("offered_items").notNull(), // array of item IDs
  requestedItems: jsonb("requested_items").notNull(), // array of item IDs or tokens
  offeredTokens: text("offered_tokens").default("0"), // additional tokens in wei
  requestedTokens: text("requested_tokens").default("0"),
  message: text("message"),
  status: text("status").notNull().default("pending"), // pending, accepted, declined, cancelled, executed
  expiresAt: timestamp("expires_at"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  respondedAt: timestamp("responded_at"),
  executedAt: timestamp("executed_at"),
});

export const escrowContracts = pgTable("escrow_contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractAddress: text("contract_address").notNull().unique(),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  itemId: varchar("item_id").references(() => items.id),
  tradeOfferId: varchar("trade_offer_id").references(() => tradeOffers.id),
  amount: text("amount").notNull(), // in wei
  status: text("status").notNull().default("created"), // created, funded, completed, disputed, cancelled
  disputeReason: text("dispute_reason"),
  resolutionData: jsonb("resolution_data"),
  createdTxHash: text("created_tx_hash"),
  completedTxHash: text("completed_tx_hash"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  completedAt: timestamp("completed_at"),
});

export const tradingPosts = pgTable("trading_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  territoryId: varchar("territory_id").notNull().references(() => territories.id),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  taxRate: integer("tax_rate").notNull().default(0), // percentage * 100 (e.g., 250 = 2.5%)
  specializations: jsonb("specializations"), // array of item categories this post specializes in
  volume24h: text("volume_24h").default("0"), // trading volume in wei
  status: text("status").notNull().default("active"), // active, inactive, destroyed
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  alliance: one(allianceMembers, {
    fields: [users.id],
    references: [allianceMembers.userId],
  }),
  ownedTerritories: many(territories, { relationName: "territoryOwner" }),
  sentBattles: many(battles, { relationName: "battleChallenger" }),
  receivedBattles: many(battles, { relationName: "battleDefender" }),
  wonBattles: many(battles, { relationName: "battleWinner" }),
  sentMessages: many(messages),
  courierTransactions: many(courierTransactions),
  ownedItems: many(items),
  listings: many(marketplaceListings),
  sentTradeOffers: many(tradeOffers, { relationName: "tradeOfferFrom" }),
  receivedTradeOffers: many(tradeOffers, { relationName: "tradeOfferTo" }),
  buyerEscrows: many(escrowContracts, { relationName: "escrowBuyer" }),
  sellerEscrows: many(escrowContracts, { relationName: "escrowSeller" }),
  tradingPosts: many(tradingPosts),
}));

export const alliancesRelations = relations(alliances, ({ one, many }) => ({
  leader: one(users, {
    fields: [alliances.leaderId],
    references: [users.id],
  }),
  members: many(allianceMembers),
  territories: many(territories),
  messages: many(messages),
}));

export const allianceMembersRelations = relations(allianceMembers, ({ one }) => ({
  alliance: one(alliances, {
    fields: [allianceMembers.allianceId],
    references: [alliances.id],
  }),
  user: one(users, {
    fields: [allianceMembers.userId],
    references: [users.id],
  }),
}));

export const territoriesRelations = relations(territories, ({ one, many }) => ({
  owner: one(users, {
    fields: [territories.ownerId],
    references: [users.id],
    relationName: "territoryOwner",
  }),
  alliance: one(alliances, {
    fields: [territories.allianceId],
    references: [alliances.id],
  }),
  battles: many(battles),
}));

export const battlesRelations = relations(battles, ({ one }) => ({
  challenger: one(users, {
    fields: [battles.challengerId],
    references: [users.id],
    relationName: "battleChallenger",
  }),
  defender: one(users, {
    fields: [battles.defenderId],
    references: [users.id],
    relationName: "battleDefender",
  }),
  winner: one(users, {
    fields: [battles.winnerId],
    references: [users.id],
    relationName: "battleWinner",
  }),
  territory: one(territories, {
    fields: [battles.territoryId],
    references: [territories.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  alliance: one(alliances, {
    fields: [messages.allianceId],
    references: [alliances.id],
  }),
}));

export const courierTransactionsRelations = relations(courierTransactions, ({ one }) => ({
  user: one(users, {
    fields: [courierTransactions.userId],
    references: [users.id],
  }),
}));

// Trading Relations
export const itemsRelations = relations(items, ({ one, many }) => ({
  owner: one(users, {
    fields: [items.ownerId],
    references: [users.id],
  }),
  listing: one(marketplaceListings),
  escrowContracts: many(escrowContracts),
}));

export const marketplaceListingsRelations = relations(marketplaceListings, ({ one }) => ({
  item: one(items, {
    fields: [marketplaceListings.itemId],
    references: [items.id],
  }),
  seller: one(users, {
    fields: [marketplaceListings.sellerId],
    references: [users.id],
  }),
}));

export const tradeOffersRelations = relations(tradeOffers, ({ one, many }) => ({
  fromUser: one(users, {
    fields: [tradeOffers.fromUserId],
    references: [users.id],
    relationName: "tradeOfferFrom",
  }),
  toUser: one(users, {
    fields: [tradeOffers.toUserId],
    references: [users.id],
    relationName: "tradeOfferTo",
  }),
  escrowContracts: many(escrowContracts),
}));

export const escrowContractsRelations = relations(escrowContracts, ({ one }) => ({
  buyer: one(users, {
    fields: [escrowContracts.buyerId],
    references: [users.id],
    relationName: "escrowBuyer",
  }),
  seller: one(users, {
    fields: [escrowContracts.sellerId],
    references: [users.id],
    relationName: "escrowSeller",
  }),
  item: one(items, {
    fields: [escrowContracts.itemId],
    references: [items.id],
  }),
  tradeOffer: one(tradeOffers, {
    fields: [escrowContracts.tradeOfferId],
    references: [tradeOffers.id],
  }),
}));

export const tradingPostsRelations = relations(tradingPosts, ({ one }) => ({
  territory: one(territories, {
    fields: [tradingPosts.territoryId],
    references: [territories.id],
  }),
  owner: one(users, {
    fields: [tradingPosts.ownerId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAllianceSchema = createInsertSchema(alliances).omit({
  id: true,
  memberCount: true,
  territoryCount: true,
  createdAt: true,
});

export const insertAllianceMemberSchema = createInsertSchema(allianceMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertTerritorySchema = createInsertSchema(territories).omit({
  id: true,
});

export const insertBattleSchema = createInsertSchema(battles).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertCourierTransactionSchema = createInsertSchema(courierTransactions).omit({
  id: true,
  createdAt: true,
});

// Trading Insert Schemas
export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  createdAt: true,
});

export const insertMarketplaceListingSchema = createInsertSchema(marketplaceListings).omit({
  id: true,
  createdAt: true,
});

export const insertTradeOfferSchema = createInsertSchema(tradeOffers).omit({
  id: true,
  createdAt: true,
});

export const insertEscrowContractSchema = createInsertSchema(escrowContracts).omit({
  id: true,
  createdAt: true,
});

export const insertTradingPostSchema = createInsertSchema(tradingPosts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Alliance = typeof alliances.$inferSelect;
export type InsertAlliance = z.infer<typeof insertAllianceSchema>;
export type AllianceMember = typeof allianceMembers.$inferSelect;
export type InsertAllianceMember = z.infer<typeof insertAllianceMemberSchema>;
export type Territory = typeof territories.$inferSelect;
export type InsertTerritory = z.infer<typeof insertTerritorySchema>;
export type Battle = typeof battles.$inferSelect;
export type InsertBattle = z.infer<typeof insertBattleSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type CourierTransaction = typeof courierTransactions.$inferSelect;
export type InsertCourierTransaction = z.infer<typeof insertCourierTransactionSchema>;

// Trading Types
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type InsertMarketplaceListing = z.infer<typeof insertMarketplaceListingSchema>;
export type TradeOffer = typeof tradeOffers.$inferSelect;
export type InsertTradeOffer = z.infer<typeof insertTradeOfferSchema>;
export type EscrowContract = typeof escrowContracts.$inferSelect;
export type InsertEscrowContract = z.infer<typeof insertEscrowContractSchema>;
export type TradingPost = typeof tradingPosts.$inferSelect;
export type InsertTradingPost = z.infer<typeof insertTradingPostSchema>;

// NFT Minting Table
export const nftMints = pgTable("nft_mints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: text("token_id").notNull().unique(),
  walletAddress: text("wallet_address").notNull().unique(), // Enforce 1 NFT per wallet
  userId: varchar("user_id").notNull().references(() => users.id),
  selectedTerritoryX: integer("selected_territory_x").notNull(),
  selectedTerritoryY: integer("selected_territory_y").notNull(),
  mintTxHash: text("mint_tx_hash").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, failed
  metadata: jsonb("metadata"), // NFT attributes and traits
  mintedAt: timestamp("minted_at").notNull().default(sql`now()`),
});

export const insertNftMintSchema = createInsertSchema(nftMints).omit({
  id: true,
  mintedAt: true,
});

// NFT Minting Types
export type NftMint = typeof nftMints.$inferSelect;
export type InsertNftMint = z.infer<typeof insertNftMintSchema>;
