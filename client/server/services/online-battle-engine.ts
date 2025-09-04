import { db } from "../db";
import { users, alliances, territories, allianceMembers, battles } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { AlliancePowerCalculator } from "./alliance-power-calculator";

export interface BattleResult {
  winnerId: string;
  winnerName: string;
  loserId: string;
  loserName: string;
  challengerPower: number;
  defenderPower: number;
  powerDifference: number;
  victoryMargin: number;
  isDecisive: boolean;
  battleData: any;
}

/**
 * Online-Based Battle Engine
 * Power calculations use ONLY online alliance members for dynamic strategic gameplay
 */
export class OnlineBattleEngine {
  private alliancePowerCalculator: AlliancePowerCalculator;

  constructor() {
    this.alliancePowerCalculator = new AlliancePowerCalculator();
  }

  /**
   * Execute battle using live online member power calculations
   */
  async executeBattle(challengerId: string, defenderId: string, territoryId?: string): Promise<BattleResult> {
    // Get challenger and defender data
    const challenger = await db.select().from(users).where(eq(users.id, challengerId)).limit(1);
    const defender = await db.select().from(users).where(eq(users.id, defenderId)).limit(1);

    if (!challenger[0] || !defender[0]) {
      throw new Error("Invalid challenger or defender");
    }

    // CRITICAL: Both players must be online to participate
    if (!challenger[0].isOnline || !defender[0].isOnline) {
      throw new Error("Both players must be online to participate in battle");
    }

    // Get alliance memberships
    const challengerAlliance = await this.getUserAlliance(challengerId);
    const defenderAlliance = await this.getUserAlliance(defenderId);

    // Calculate LIVE power using ONLY online members
    let challengerPower: number;
    let defenderPower: number;
    let challengerOnlineCount = 1;
    let defenderOnlineCount = 1;

    if (challengerAlliance) {
      const alliancePowerData = await this.alliancePowerCalculator.calculateLiveAlliancePower(challengerAlliance.id);
      challengerPower = alliancePowerData.totalPower;
      challengerOnlineCount = alliancePowerData.onlineMemberCount;
    } else {
      challengerPower = this.calculateIndividualPower(challenger[0]);
    }

    if (defenderAlliance) {
      const alliancePowerData = await this.alliancePowerCalculator.calculateLiveAlliancePower(defenderAlliance.id);
      defenderPower = alliancePowerData.totalPower;
      defenderOnlineCount = alliancePowerData.onlineMemberCount;
    } else {
      defenderPower = this.calculateIndividualPower(defender[0]);
    }

    // Determine winner based on live aggregate power (fully deterministic)
    const winner = challengerPower > defenderPower ? challenger[0] : defender[0];
    const loser = winner.id === challengerId ? defender[0] : challenger[0];

    // Calculate victory margin
    const powerDifference = Math.abs(challengerPower - defenderPower);
    const loserPower = Math.min(challengerPower, defenderPower);
    const victoryMargin = loserPower > 0 ? powerDifference / loserPower : 1;

    const battleResult: BattleResult = {
      winnerId: winner.id,
      winnerName: winner.callSign,
      loserId: loser.id,
      loserName: loser.callSign,
      challengerPower,
      defenderPower,
      powerDifference,
      victoryMargin,
      isDecisive: victoryMargin > 0.3,
      battleData: {
        battleType: territoryId ? 'territory_conquest' : 'direct_challenge',
        onlineBased: true,
        challengerOnlineCount,
        defenderOnlineCount,
        challengerAlliance: challengerAlliance?.name || null,
        defenderAlliance: defenderAlliance?.name || null,
        timestamp: new Date().toISOString()
      }
    };

    // Create battle record
    await db.insert(battles).values({
      challengerId,
      defenderId,
      winnerId: winner.id,
      territoryId,
      status: 'completed',
      battleData: battleResult.battleData,
      completedAt: sql`now()`
    });

    // Update player stats
    await this.updatePlayerStats(winner.id, true);
    await this.updatePlayerStats(loser.id, false);

    // Handle territory conquest if applicable
    if (territoryId && winner.id === challengerId) {
      await this.handleTerritoryConquest(territoryId, challengerId, challengerAlliance?.id);
    }

    return battleResult;
  }

  /**
   * Calculate individual player power
   */
  private calculateIndividualPower(user: any): number {
    const levelPower = user.level * 50;
    const xpPower = Math.sqrt(user.xp || 0) * 2;
    const reputationPower = (user.reputation || 0) * 3;
    const winPower = user.wins * 10;
    
    return levelPower + xpPower + reputationPower + winPower;
  }

  /**
   * Get user's alliance membership
   */
  private async getUserAlliance(userId: string) {
    const membership = await db
      .select({
        id: alliances.id,
        name: alliances.name,
        tag: alliances.tag
      })
      .from(allianceMembers)
      .innerJoin(alliances, eq(allianceMembers.allianceId, alliances.id))
      .where(eq(allianceMembers.userId, userId))
      .limit(1);

    return membership[0] || null;
  }

  /**
   * Update player stats after battle
   */
  private async updatePlayerStats(userId: string, won: boolean): Promise<void> {
    if (won) {
      await db
        .update(users)
        .set({
          wins: sql`${users.wins} + 1`,
          xp: sql`${users.xp} + 100`,
          reputation: sql`${users.reputation} + 10`
        })
        .where(eq(users.id, userId));
    } else {
      await db
        .update(users)
        .set({
          losses: sql`${users.losses} + 1`,
          xp: sql`${users.xp} + 25`,
          reputation: sql`${users.reputation} + 2`
        })
        .where(eq(users.id, userId));
    }
  }

  /**
   * Handle territory conquest after successful battle
   */
  private async handleTerritoryConquest(territoryId: string, winnerId: string, allianceId?: string): Promise<void> {
    await db
      .update(territories)
      .set({
        ownerId: winnerId,
        allianceId: allianceId || null,
        claimedAt: sql`now()`,
        controlEndsAt: sql`now() + interval '24 hours'`,
        status: 'claimed'
      })
      .where(eq(territories.id, territoryId));
  }

  /**
   * Predict battle outcome between two players/alliances
   */
  async predictBattleOutcome(challengerId: string, defenderId: string): Promise<{
    predictedWinner: string | null;
    challengerPower: number;
    defenderPower: number;
    powerDifference: number;
    victoryMargin: number;
    isDecisive: boolean;
    requiresBothOnline: boolean;
    recommendation: string;
  }> {
    const challenger = await db.select().from(users).where(eq(users.id, challengerId)).limit(1);
    const defender = await db.select().from(users).where(eq(users.id, defenderId)).limit(1);

    if (!challenger[0] || !defender[0]) {
      throw new Error("Invalid players");
    }

    // Check if both are online
    if (!challenger[0].isOnline || !defender[0].isOnline) {
      return {
        predictedWinner: null,
        challengerPower: 0,
        defenderPower: 0,
        powerDifference: 0,
        victoryMargin: 0,
        isDecisive: false,
        requiresBothOnline: true,
        recommendation: "Both players must be online to battle. Coordinate with your opponent for a fair fight."
      };
    }

    // Get alliance data
    const challengerAlliance = await this.getUserAlliance(challengerId);
    const defenderAlliance = await this.getUserAlliance(defenderId);

    // Calculate current live power
    let challengerPower: number;
    let defenderPower: number;

    if (challengerAlliance) {
      const alliancePowerData = await this.alliancePowerCalculator.calculateLiveAlliancePower(challengerAlliance.id);
      challengerPower = alliancePowerData.totalPower;
    } else {
      challengerPower = this.calculateIndividualPower(challenger[0]);
    }

    if (defenderAlliance) {
      const alliancePowerData = await this.alliancePowerCalculator.calculateLiveAlliancePower(defenderAlliance.id);
      defenderPower = alliancePowerData.totalPower;
    } else {
      defenderPower = this.calculateIndividualPower(defender[0]);
    }

    const powerDifference = Math.abs(challengerPower - defenderPower);
    const loserPower = Math.min(challengerPower, defenderPower);
    const victoryMargin = loserPower > 0 ? powerDifference / loserPower : 0;
    const isDecisive = victoryMargin > 0.3;

    let predictedWinner: string | null = null;
    let recommendation = "";

    if (challengerPower > defenderPower) {
      predictedWinner = challengerId;
      recommendation = isDecisive ? "Clear advantage - attack now!" : "Moderate advantage - coordinate for victory";
    } else if (defenderPower > challengerPower) {
      predictedWinner = defenderId;
      recommendation = isDecisive ? "Strong defense - attacker should wait for reinforcements" : "Close battle - either side could win";
    } else {
      recommendation = "Perfect balance - outcome depends on strategy and timing";
    }

    return {
      predictedWinner,
      challengerPower,
      defenderPower,
      powerDifference,
      victoryMargin,
      isDecisive,
      requiresBothOnline: false,
      recommendation
    };
  }
}