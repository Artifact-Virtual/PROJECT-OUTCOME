import { db } from "../db";
import { users, alliances, territories, allianceMembers, battles } from "@shared/schema";
import { eq, and, sql, count } from "drizzle-orm";

interface BattleParticipant {
  id: string;
  level: number;
  xp: number;
  reputation: number;
  wins: number;
  losses: number;
  allianceId?: string;
  territoryCount: number;
  alliancePower: number;
  strategicAdvantage: number;
}

interface BattleContext {
  territoryX: number;
  territoryY: number;
  isDefending: boolean;
  adjacentAlliedTerritories: number;
  resourceControl: number;
}

export class BattleEngine {
  /**
   * Calculate comprehensive battle power for a participant
   */
  async calculateBattlePower(userId: string, context: BattleContext): Promise<number> {
    const participant = await this.getParticipantData(userId);
    
    // Base individual power (40% weight)
    const individualPower = this.calculateIndividualPower(participant);
    
    // Alliance power (35% weight)
    const alliancePower = await this.calculateAlliancePower(participant, context);
    
    // Territory control bonus (15% weight)
    const territoryPower = this.calculateTerritoryPower(participant, context);
    
    // Strategic positioning (10% weight)
    const strategicPower = this.calculateStrategicPower(context);
    
    const totalPower = 
      (individualPower * 0.40) +
      (alliancePower * 0.35) +
      (territoryPower * 0.15) +
      (strategicPower * 0.10);
    
    return Math.max(1, Math.round(totalPower));
  }

  /**
   * Individual player power based on stats
   */
  private calculateIndividualPower(participant: BattleParticipant): number {
    const baseLevel = participant.level * 50;
    const xpBonus = Math.sqrt(participant.xp) * 2;
    const reputationBonus = participant.reputation * 5;
    const winRatio = participant.wins / Math.max(1, participant.wins + participant.losses);
    const winBonus = winRatio * 200;
    
    return baseLevel + xpBonus + reputationBonus + winBonus;
  }

  /**
   * Alliance aggregate power calculation - pure mathematical approach
   */
  private async calculateAlliancePower(participant: BattleParticipant, context: BattleContext): Promise<number> {
    if (!participant.allianceId) return 0;
    
    // Get alliance aggregate stats - sum of all member capabilities
    const allianceStats = await db
      .select({
        totalLevel: sql<number>`SUM(${users.level})`,
        totalXp: sql<number>`SUM(${users.xp})`,
        totalReputation: sql<number>`SUM(${users.reputation})`,
        totalWins: sql<number>`SUM(${users.wins})`,
        memberCount: count(),
      })
      .from(users)
      .innerJoin(allianceMembers, eq(users.id, allianceMembers.userId))
      .where(eq(allianceMembers.allianceId, participant.allianceId))
      .groupBy(allianceMembers.allianceId);

    if (!allianceStats[0]) return 0;

    const stats = allianceStats[0];
    
    // Direct aggregate power - larger, stronger alliances should always win
    const rawPower = stats.totalLevel * 40 + Math.sqrt(stats.totalXp) + stats.totalReputation * 3;
    
    // Member count multiplier (more members = more power)
    const memberMultiplier = 1 + (stats.memberCount * 0.1);
    
    // Alliance coordination bonus based on collective wins
    const coordinationBonus = stats.totalWins * 2;
    
    return (rawPower * memberMultiplier) + coordinationBonus;
  }

  /**
   * Territory control power calculation - pure territorial mathematics
   */
  private calculateTerritoryPower(participant: BattleParticipant, context: BattleContext): number {
    // Base territorial power scales linearly with holdings
    const personalTerritoryPower = participant.territoryCount * 40;
    
    // Adjacent territory control creates exponential advantage
    const adjacentPower = context.adjacentAlliedTerritories * 25;
    
    // Supply line bonus - more territories = better logistics
    const logisticalAdvantage = participant.territoryCount > 3 ? participant.territoryCount * 10 : 0;
    
    // Defensive positioning grants mathematical advantage
    const defensiveAdvantage = context.isDefending ? 80 : 0;
    
    // Resource control scales territorial effectiveness
    const resourceEfficiency = (1 + context.resourceControl * 0.2);
    
    return (personalTerritoryPower + adjacentPower + logisticalAdvantage + defensiveAdvantage) * resourceEfficiency;
  }

  /**
   * Strategic positioning calculations
   */
  private calculateStrategicPower(context: BattleContext): number {
    // Border territory bonus (higher risk, higher reward)
    const borderBonus = this.isBorderTerritory(context.territoryX, context.territoryY) ? 30 : 0;
    
    // Central positioning bonus
    const centralBonus = this.isCentralTerritory(context.territoryX, context.territoryY) ? 20 : 0;
    
    return borderBonus + centralBonus;
  }

  /**
   * Resolve battle using power calculations with controlled randomness
   */
  async resolveBattle(challengerId: string, defenderId: string, territoryId: string): Promise<{
    winnerId: string;
    battleData: any;
    powerDifference: number;
  }> {
    // Get territory context
    const territory = await db.select().from(territories).where(eq(territories.id, territoryId)).limit(1);
    if (!territory[0]) throw new Error("Territory not found");

    const context: BattleContext = {
      territoryX: territory[0].x,
      territoryY: territory[0].y,
      isDefending: false,
      adjacentAlliedTerritories: 0,
      resourceControl: 1,
    };

    // Calculate defender context (they get defensive bonus)
    const defenderContext = { ...context, isDefending: true };
    defenderContext.adjacentAlliedTerritories = await this.getAdjacentAlliedTerritories(
      defenderId, 
      territory[0].x, 
      territory[0].y
    );

    // Calculate challenger context
    const challengerContext = { ...context, isDefending: false };
    challengerContext.adjacentAlliedTerritories = await this.getAdjacentAlliedTerritories(
      challengerId, 
      territory[0].x, 
      territory[0].y
    );

    // Calculate battle powers
    const challengerPower = await this.calculateBattlePower(challengerId, challengerContext);
    const defenderPower = await this.calculateBattlePower(defenderId, defenderContext);

    const powerDifference = Math.abs(challengerPower - defenderPower);
    const totalPower = challengerPower + defenderPower;
    
    // Determine winner purely based on aggregate power calculations
    // Higher power always wins - no random elements
    const winnerId = challengerPower > defenderPower ? challengerId : defenderId;
    
    // Calculate victory margin for battle data
    const victoryMargin = powerDifference / Math.min(challengerPower, defenderPower);
    const isDecisiveVictory = victoryMargin > 0.5; // 50%+ power advantage
    
    const battleData = {
      challengerPower,
      defenderPower,
      powerDifference,
      victoryMargin,
      isDecisiveVictory,
      resolutionMethod: "pure_aggregate_calculation",
      powerBreakdown: {
        winner: winnerId === challengerId ? "challenger" : "defender",
        winnerPower: winnerId === challengerId ? challengerPower : defenderPower,
        loserPower: winnerId === challengerId ? defenderPower : challengerPower,
      },
      timestamp: new Date().toISOString(),
    };

    return {
      winnerId,
      battleData,
      powerDifference,
    };
  }

  /**
   * Get participant battle data
   */
  private async getParticipantData(userId: string): Promise<BattleParticipant> {
    // Get user data with alliance membership
    const userData = await db
      .select({
        id: users.id,
        level: users.level,
        xp: users.xp,
        reputation: users.reputation,
        wins: users.wins,
        losses: users.losses,
        allianceId: allianceMembers.allianceId,
      })
      .from(users)
      .leftJoin(allianceMembers, eq(users.id, allianceMembers.userId))
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData[0]) throw new Error("User not found");

    // Get territory count
    const territoryCount = await db
      .select({ count: count() })
      .from(territories)
      .where(eq(territories.ownerId, userId));

    return {
      ...userData[0],
      allianceId: userData[0].allianceId || undefined,
      territoryCount: territoryCount[0]?.count || 0,
      alliancePower: 0, // Will be calculated
      strategicAdvantage: 0, // Will be calculated
    };
  }

  /**
   * Count adjacent allied territories
   */
  private async getAdjacentAlliedTerritories(userId: string, x: number, y: number): Promise<number> {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0]) return 0;

    const userAlliance = await db
      .select()
      .from(allianceMembers)
      .where(eq(allianceMembers.userId, userId))
      .limit(1);

    if (!userAlliance[0]) return 0;

    // Check 8 adjacent positions
    const adjacentPositions = [
      [x-1, y-1], [x, y-1], [x+1, y-1],
      [x-1, y],             [x+1, y],
      [x-1, y+1], [x, y+1], [x+1, y+1],
    ];

    let alliedCount = 0;
    for (const [adjX, adjY] of adjacentPositions) {
      const territory = await db
        .select()
        .from(territories)
        .where(and(
          eq(territories.x, adjX),
          eq(territories.y, adjY),
          eq(territories.allianceId, userAlliance[0].allianceId)
        ))
        .limit(1);

      if (territory.length > 0) alliedCount++;
    }

    return alliedCount;
  }

  /**
   * Check if territory is on map border (higher strategic value)
   */
  private isBorderTerritory(x: number, y: number): boolean {
    const mapSize = 20; // Assuming 20x20 grid
    return x === 0 || y === 0 || x === mapSize - 1 || y === mapSize - 1;
  }

  /**
   * Check if territory is central (stable control)
   */
  private isCentralTerritory(x: number, y: number): boolean {
    const mapSize = 20;
    const center = mapSize / 2;
    const distance = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
    return distance <= 3; // Within 3 units of center
  }
}