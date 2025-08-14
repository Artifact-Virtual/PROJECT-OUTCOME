import { 
  users, alliances, allianceMembers, territories, battles, messages, courierTransactions,
  type User, type InsertUser, type Alliance, type InsertAlliance, 
  type AllianceMember, type InsertAllianceMember, type Territory, type InsertTerritory,
  type Battle, type InsertBattle, type Message, type InsertMessage,
  type CourierTransaction, type InsertCourierTransaction
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
}

export const storage = new DatabaseStorage();
