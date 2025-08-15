import { db } from "../db";
import { users, alliances, territories, allianceMembers } from "@shared/schema";
import { eq, and, sql, count } from "drizzle-orm";

/**
 * Standalone service for calculating alliance aggregate power
 * Demonstrates how alliance coordination affects battle outcomes
 */
export class AlliancePowerCalculator {
  
  /**
   * Calculate total alliance power for leaderboards and comparisons
   */
  async calculateAllianceTotalPower(allianceId: string): Promise<{
    totalPower: number;
    memberCount: number;
    territoryCount: number;
    aggregateStats: {
      totalLevel: number;
      totalXp: number;
      totalReputation: number;
      totalWins: number;
    };
    powerBreakdown: {
      memberPower: number;
      territoryPower: number;
      coordinationBonus: number;
    };
  }> {
    // Get all alliance member stats
    const memberStats = await db
      .select({
        totalLevel: sql<number>`SUM(${users.level})`,
        totalXp: sql<number>`SUM(${users.xp})`,
        totalReputation: sql<number>`SUM(${users.reputation})`,
        totalWins: sql<number>`SUM(${users.wins})`,
        memberCount: count(),
      })
      .from(users)
      .innerJoin(allianceMembers, eq(users.id, allianceMembers.userId))
      .where(eq(allianceMembers.allianceId, allianceId))
      .groupBy(allianceMembers.allianceId);

    // Get alliance territory count
    const territoryStats = await db
      .select({
        territoryCount: count(),
      })
      .from(territories)
      .where(eq(territories.allianceId, allianceId));

    const stats = memberStats[0] || {
      totalLevel: 0,
      totalXp: 0,
      totalReputation: 0,
      totalWins: 0,
      memberCount: 0,
    };

    const territoryCount = territoryStats[0]?.territoryCount || 0;

    // Calculate power components
    const memberPower = this.calculateMemberPower(stats);
    const territoryPower = this.calculateTerritoryPower(territoryCount);
    const coordinationBonus = this.calculateCoordinationBonus(stats);

    const totalPower = memberPower + territoryPower + coordinationBonus;

    return {
      totalPower,
      memberCount: stats.memberCount,
      territoryCount,
      aggregateStats: {
        totalLevel: stats.totalLevel,
        totalXp: stats.totalXp,
        totalReputation: stats.totalReputation,
        totalWins: stats.totalWins,
      },
      powerBreakdown: {
        memberPower,
        territoryPower,
        coordinationBonus,
      },
    };
  }

  /**
   * Get alliance power rankings for the entire server
   */
  async getAlliancePowerRankings(): Promise<Array<{
    allianceId: string;
    allianceName: string;
    allianceTag: string;
    totalPower: number;
    memberCount: number;
    territoryCount: number;
    avgPowerPerMember: number;
  }>> {
    // Get all alliances
    const allAlliances = await db.select().from(alliances);
    
    const rankings = [];
    
    for (const alliance of allAlliances) {
      const powerData = await this.calculateAllianceTotalPower(alliance.id);
      
      rankings.push({
        allianceId: alliance.id,
        allianceName: alliance.name,
        allianceTag: alliance.tag,
        totalPower: powerData.totalPower,
        memberCount: powerData.memberCount,
        territoryCount: powerData.territoryCount,
        avgPowerPerMember: powerData.memberCount > 0 ? Math.round(powerData.totalPower / powerData.memberCount) : 0,
      });
    }

    // Sort by total power descending
    return rankings.sort((a, b) => b.totalPower - a.totalPower);
  }

  /**
   * Predict battle outcome between two alliances
   */
  async predictAllianceBattle(alliance1Id: string, alliance2Id: string): Promise<{
    predictedWinner: string;
    powerDifference: number;
    victoryMargin: number;
    alliance1Power: number;
    alliance2Power: number;
    isDecisive: boolean;
  }> {
    const alliance1Power = await this.calculateAllianceTotalPower(alliance1Id);
    const alliance2Power = await this.calculateAllianceTotalPower(alliance2Id);

    const powerDifference = Math.abs(alliance1Power.totalPower - alliance2Power.totalPower);
    const predictedWinner = alliance1Power.totalPower > alliance2Power.totalPower ? alliance1Id : alliance2Id;
    const loserPower = Math.min(alliance1Power.totalPower, alliance2Power.totalPower);
    const victoryMargin = loserPower > 0 ? powerDifference / loserPower : 1;
    const isDecisive = victoryMargin > 0.3; // 30%+ power advantage

    return {
      predictedWinner,
      powerDifference,
      victoryMargin,
      alliance1Power: alliance1Power.totalPower,
      alliance2Power: alliance2Power.totalPower,
      isDecisive,
    };
  }

  private calculateMemberPower(stats: any): number {
    // Raw aggregate member power
    const rawPower = stats.totalLevel * 40 + Math.sqrt(stats.totalXp) + stats.totalReputation * 3;
    
    // Member count multiplier
    const memberMultiplier = 1 + (stats.memberCount * 0.1);
    
    return rawPower * memberMultiplier;
  }

  private calculateTerritoryPower(territoryCount: number): number {
    // Territory power scales exponentially
    const basePower = territoryCount * 50;
    const exponentialBonus = territoryCount > 5 ? Math.pow(territoryCount - 5, 1.5) * 20 : 0;
    
    return basePower + exponentialBonus;
  }

  private calculateCoordinationBonus(stats: any): number {
    // Coordination bonus based on collective wins and member count
    const baseCoordination = stats.totalWins * 2;
    const teamworkMultiplier = stats.memberCount > 3 ? 1.2 : 1.0;
    
    return baseCoordination * teamworkMultiplier;
  }
}