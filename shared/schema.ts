import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull().unique(),
  callSign: text("call_sign").notNull().unique(),
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
