import { db } from "../db";
import { users, alliances, territories, allianceMembers } from "@shared/schema";
import { eq, and, sql, count } from "drizzle-orm";

/**
 * ONLINE-BASED Alliance Power Calculator
 * Power is calculated ONLY from online alliance members, creating dynamic strategic gameplay
 * where timing, coordination, and active participation are crucial for victory
 */
export class AlliancePowerCalculator {
  
  /**
   * Calculate LIVE alliance power based on ONLINE members only
   * This creates dynamic battles where alliance coordination and timing matter
   */
  async calculateLiveAlliancePower(allianceId: string): Promise<{
    totalPower: number;
    onlineMemberCount: number;
    totalMemberCount: number;
    territoryCount: number;
    onlinePercentage: number;
    aggregateStats: {
      totalLevel: number;
      totalXp: number;
      totalReputation: number;
      totalWins: number;
    };
    powerBreakdown: {
      onlineMemberPower: number;
      territoryPower: number;
      coordinationBonus: number;
      activityMultiplier: number;
    };
    onlineMembers: Array<{
      id: string;
      callSign: string;
      level: number;
      xp: number;
      reputation: number;
      wins: number;
      individualPower: number;
    }>;
  }> {
    // Get ONLY ONLINE alliance member stats
    const onlineMemberStats = await db
      .select({
        userId: users.id,
        callSign: users.callSign,
        level: users.level,
        xp: users.xp,
        reputation: users.reputation,
        wins: users.wins,
        isOnline: users.isOnline,
      })
      .from(users)
      .innerJoin(allianceMembers, eq(users.id, allianceMembers.userId))
      .where(
        and(
          eq(allianceMembers.allianceId, allianceId),
          eq(users.isOnline, true) // CRITICAL: Only online members count!
        )
      );

    // Get total member count for comparison
    const totalMemberCount = await db
      .select({ count: count() })
      .from(allianceMembers)
      .where(eq(allianceMembers.allianceId, allianceId));

    // Get alliance territory count (territories always contribute)
    const territoryStats = await db
      .select({
        territoryCount: count(),
      })
      .from(territories)
      .where(eq(territories.allianceId, allianceId));

    const onlineMembers = onlineMemberStats.map(member => {
      const individualPower = this.calculateIndividualPower(member);
      return {
        id: member.userId,
        callSign: member.callSign,
        level: member.level,
        xp: member.xp,
        reputation: member.reputation,
        wins: member.wins,
        individualPower,
      };
    });

    // Aggregate online member stats
    const aggregateStats = {
      totalLevel: onlineMembers.reduce((sum, m) => sum + m.level, 0),
      totalXp: onlineMembers.reduce((sum, m) => sum + m.xp, 0),
      totalReputation: onlineMembers.reduce((sum, m) => sum + m.reputation, 0),
      totalWins: onlineMembers.reduce((sum, m) => sum + m.wins, 0),
    };

    const onlineMemberCount = onlineMembers.length;
    const totalMembers = totalMemberCount[0]?.count || 0;
    const territoryCount = territoryStats[0]?.territoryCount || 0;
    const onlinePercentage = totalMembers > 0 ? (onlineMemberCount / totalMembers) * 100 : 0;

    // Calculate power components
    const onlineMemberPower = this.calculateOnlineMemberPower(onlineMembers);
    const territoryPower = this.calculateTerritoryPower(territoryCount);
    const coordinationBonus = this.calculateOnlineCoordinationBonus(onlineMembers, onlinePercentage);
    const activityMultiplier = this.calculateActivityMultiplier(onlinePercentage);

    const totalPower = (onlineMemberPower + territoryPower + coordinationBonus) * activityMultiplier;

    return {
      totalPower: Math.round(totalPower),
      onlineMemberCount,
      totalMemberCount: totalMembers,
      territoryCount,
      onlinePercentage: Math.round(onlinePercentage),
      aggregateStats,
      powerBreakdown: {
        onlineMemberPower: Math.round(onlineMemberPower),
        territoryPower: Math.round(territoryPower),
        coordinationBonus: Math.round(coordinationBonus),
        activityMultiplier: Math.round(activityMultiplier * 100) / 100,
      },
      onlineMembers,
    };
  }

  /**
   * Get LIVE alliance power rankings based on online members only
   * Rankings change dynamically as members come online/offline
   */
  async getLiveAlliancePowerRankings(): Promise<Array<{
    allianceId: string;
    allianceName: string;
    allianceTag: string;
    livePower: number;
    onlineMemberCount: number;
    totalMemberCount: number;
    territoryCount: number;
    onlinePercentage: number;
    avgPowerPerOnlineMember: number;
    status: 'dominant' | 'strong' | 'active' | 'dormant';
  }>> {
    // Get all alliances
    const allAlliances = await db.select().from(alliances);
    
    const rankings = [];
    
    for (const alliance of allAlliances) {
      const powerData = await this.calculateLiveAlliancePower(alliance.id);
      
      // Determine alliance status based on activity
      let status: 'dominant' | 'strong' | 'active' | 'dormant' = 'dormant';
      if (powerData.onlinePercentage > 70 && powerData.totalPower > 500) status = 'dominant';
      else if (powerData.onlinePercentage > 50 && powerData.totalPower > 200) status = 'strong';
      else if (powerData.onlineMemberCount > 0) status = 'active';
      
      rankings.push({
        allianceId: alliance.id,
        allianceName: alliance.name,
        allianceTag: alliance.tag,
        livePower: powerData.totalPower,
        onlineMemberCount: powerData.onlineMemberCount,
        totalMemberCount: powerData.totalMemberCount,
        territoryCount: powerData.territoryCount,
        onlinePercentage: powerData.onlinePercentage,
        avgPowerPerOnlineMember: powerData.onlineMemberCount > 0 ? Math.round(powerData.totalPower / powerData.onlineMemberCount) : 0,
        status,
      });
    }

    // Sort by live power descending
    return rankings.sort((a, b) => b.livePower - a.livePower);
  }

  /**
   * Predict LIVE battle outcome based on currently online members
   * Battle predictions change in real-time as members come online/offline
   */
  async predictLiveAllianceBattle(alliance1Id: string, alliance2Id: string): Promise<{
    predictedWinner: string | null;
    powerDifference: number;
    victoryMargin: number;
    alliance1LivePower: number;
    alliance2LivePower: number;
    alliance1OnlineCount: number;
    alliance2OnlineCount: number;
    alliance1OnlinePercentage: number;
    alliance2OnlinePercentage: number;
    isDecisive: boolean;
    battleRecommendation: string;
    strategicAdvice: string;
  }> {
    const alliance1Data = await this.calculateLiveAlliancePower(alliance1Id);
    const alliance2Data = await this.calculateLiveAlliancePower(alliance2Id);

    const powerDifference = Math.abs(alliance1Data.totalPower - alliance2Data.totalPower);
    const predictedWinner = alliance1Data.totalPower > alliance2Data.totalPower ? alliance1Id : 
                           alliance2Data.totalPower > alliance1Data.totalPower ? alliance2Id : null;
    
    const loserPower = Math.min(alliance1Data.totalPower, alliance2Data.totalPower);
    const victoryMargin = loserPower > 0 ? powerDifference / loserPower : 0;
    const isDecisive = victoryMargin > 0.3; // 30%+ power advantage

    // Generate strategic recommendations
    let battleRecommendation = "";
    let strategicAdvice = "";

    if (alliance1Data.onlineMemberCount === 0 && alliance2Data.onlineMemberCount === 0) {
      battleRecommendation = "No online members in either alliance - battle not possible";
      strategicAdvice = "Wait for members to come online before engaging";
    } else if (isDecisive) {
      battleRecommendation = `Decisive advantage for ${predictedWinner === alliance1Id ? 'Alliance 1' : 'Alliance 2'}`;
      strategicAdvice = predictedWinner === alliance1Id ? 
        "Alliance 1 should attack immediately" : "Alliance 2 should attack immediately";
    } else if (victoryMargin < 0.1) {
      battleRecommendation = "Extremely close battle - outcome uncertain";
      strategicAdvice = "Consider waiting for more members online or coordinate a surprise attack";
    } else {
      battleRecommendation = `Moderate advantage for ${predictedWinner === alliance1Id ? 'Alliance 1' : 'Alliance 2'}`;
      strategicAdvice = "Victory possible but not guaranteed - coordinate your online members";
    }

    return {
      predictedWinner,
      powerDifference,
      victoryMargin,
      alliance1LivePower: alliance1Data.totalPower,
      alliance2LivePower: alliance2Data.totalPower,
      alliance1OnlineCount: alliance1Data.onlineMemberCount,
      alliance2OnlineCount: alliance2Data.onlineMemberCount,
      alliance1OnlinePercentage: alliance1Data.onlinePercentage,
      alliance2OnlinePercentage: alliance2Data.onlinePercentage,
      isDecisive,
      battleRecommendation,
      strategicAdvice,
    };
  }

  /**
   * Calculate individual member power for fair aggregation
   */
  private calculateIndividualPower(member: any): number {
    const levelPower = member.level * 50;
    const xpPower = Math.sqrt(member.xp || 0) * 2;
    const reputationPower = (member.reputation || 0) * 3;
    const winPower = member.wins * 10;
    
    return levelPower + xpPower + reputationPower + winPower;
  }

  /**
   * Aggregate power from all online members
   */
  private calculateOnlineMemberPower(onlineMembers: any[]): number {
    const rawPower = onlineMembers.reduce((total, member) => total + member.individualPower, 0);
    
    // Online member synergy bonus (more online = better coordination)
    const synergy = onlineMembers.length > 1 ? 1 + (onlineMembers.length * 0.15) : 1;
    
    return rawPower * synergy;
  }

  /**
   * Territory power scales exponentially and is always active
   */
  private calculateTerritoryPower(territoryCount: number): number {
    const basePower = territoryCount * 75;
    const exponentialBonus = territoryCount > 3 ? Math.pow(territoryCount - 3, 1.3) * 25 : 0;
    
    return basePower + exponentialBonus;
  }

  /**
   * Coordination bonus based on online member activity and collaboration
   */
  private calculateOnlineCoordinationBonus(onlineMembers: any[], onlinePercentage: number): number {
    if (onlineMembers.length === 0) return 0;
    
    const baseCoordination = onlineMembers.reduce((sum, m) => sum + m.wins, 0) * 3;
    const activityBonus = onlinePercentage > 50 ? baseCoordination * 0.5 : 0;
    const teamworkMultiplier = onlineMembers.length > 2 ? 1.3 : 1.0;
    
    return (baseCoordination + activityBonus) * teamworkMultiplier;
  }

  /**
   * Activity multiplier rewards alliances with high online participation
   */
  private calculateActivityMultiplier(onlinePercentage: number): number {
    if (onlinePercentage >= 80) return 1.5; // Exceptional coordination
    if (onlinePercentage >= 60) return 1.3; // Strong coordination  
    if (onlinePercentage >= 40) return 1.1; // Good coordination
    if (onlinePercentage >= 20) return 1.0; // Basic coordination
    return 0.8; // Poor coordination penalty
  }

  /**
   * Update user online status (call this from WebSocket connections)
   */
  async updateUserOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await db
      .update(users)
      .set({ 
        isOnline,
        lastOnline: sql`now()`
      })
      .where(eq(users.id, userId));
  }

  /**
   * Automatically mark users offline if they haven't been seen for 10 minutes
   */
  async cleanupOfflineUsers(): Promise<void> {
    await db
      .update(users)
      .set({ isOnline: false })
      .where(sql`${users.lastOnline} < now() - interval '10 minutes'`);
  }
}