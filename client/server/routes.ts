import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { BattleEngine } from "./services/battle-engine";
import { AlliancePowerCalculator } from "./services/alliance-power-calculator";
import { 
  insertUserSchema, insertAllianceSchema, insertBattleSchema, insertMessageSchema, insertCourierTransactionSchema,
  insertItemSchema, insertMarketplaceListingSchema, insertTradeOfferSchema, insertEscrowContractSchema, insertTradingPostSchema,
  insertNftMintSchema
} from "@shared/schema";
import { setupWebSocket } from "./services/websocket";
import { CourierService } from "./services/courier";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  setupWebSocket(wss);
  
  // Initialize Courier service
  const courierService = new CourierService();

  // User routes
  app.get("/api/users/:address", async (req, res) => {
    try {
      const user = await storage.getUserByAddress(req.params.address);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/users/:id/alliance", async (req, res) => {
    try {
      const userAlliance = await storage.getUserAlliance(req.params.id);
      res.json(userAlliance);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user alliance" });
    }
  });

  // Alliance routes
  app.post("/api/alliances", async (req, res) => {
    try {
      const allianceData = insertAllianceSchema.parse(req.body);
      const alliance = await storage.createAlliance(allianceData);
      res.status(201).json(alliance);
    } catch (error) {
      res.status(400).json({ message: "Invalid alliance data" });
    }
  });

  app.post("/api/alliances/:id/join", async (req, res) => {
    try {
      const { userId, role = "member" } = req.body;
      const member = await storage.joinAlliance(userId, req.params.id, role);
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: "Failed to join alliance" });
    }
  });

  // Territory routes
  app.get("/api/territories", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const territories = await storage.getTerritories(limit);
      res.json(territories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get territories" });
    }
  });

  app.get("/api/territories/:x/:y", async (req, res) => {
    try {
      const x = parseInt(req.params.x);
      const y = parseInt(req.params.y);
      const territory = await storage.getTerritory(x, y);
      res.json(territory);
    } catch (error) {
      res.status(500).json({ message: "Failed to get territory" });
    }
  });

  app.post("/api/territories/claim", async (req, res) => {
    try {
      const territory = await storage.claimTerritory(req.body);
      res.status(201).json(territory);
    } catch (error) {
      res.status(400).json({ message: "Failed to claim territory" });
    }
  });

  // Battle routes
  app.post("/api/battles", async (req, res) => {
    try {
      const battleData = insertBattleSchema.parse(req.body);
      const battle = await storage.createBattle(battleData);
      res.status(201).json(battle);
    } catch (error) {
      res.status(400).json({ message: "Invalid battle data" });
    }
  });

  app.patch("/api/battles/:id/complete", async (req, res) => {
    try {
      const { winnerId } = req.body;
      const battle = await storage.completeBattle(req.params.id, winnerId);
      res.json(battle);
    } catch (error) {
      res.status(400).json({ message: "Failed to complete battle" });
    }
  });

  // Enhanced battle resolution using aggregate power calculations
  app.post("/api/battles/:id/resolve", async (req, res) => {
    try {
      const battleEngine = new BattleEngine();
      const battle = await storage.getBattle(req.params.id);
      
      if (!battle) {
        return res.status(404).json({ message: "Battle not found" });
      }

      if (battle.status !== "pending") {
        return res.status(400).json({ message: "Battle already resolved" });
      }

      if (!battle.territoryId) {
        return res.status(400).json({ message: "Battle must have an associated territory" });
      }

      // Use battle engine to calculate outcome based on aggregate power
      const result = await battleEngine.resolveBattle(
        battle.challengerId,
        battle.defenderId,
        battle.territoryId
      );

      // Complete the battle with calculated results
      const completedBattle = await storage.completeBattle(
        req.params.id,
        result.winnerId,
        result.battleData
      );

      // Update territory ownership if battle was for territory control
      if (battle.territoryId && result.winnerId === battle.challengerId) {
        await storage.claimTerritory(
          parseInt(String(battle.territoryId)), 
          parseInt(String(battle.territoryId)), 
          result.winnerId
        );
      }

      res.json({
        battle: completedBattle,
        resolution: result.battleData,
        powerDifference: result.powerDifference,
      });

    } catch (error) {
      console.error("Battle resolution error:", error);
      res.status(500).json({ message: "Failed to resolve battle" });
    }
  });

  // Get alliance power rankings
  app.get("/api/alliances/power-rankings", async (req, res) => {
    try {
      const calculator = new AlliancePowerCalculator();
      const rankings = await calculator.getAlliancePowerRankings();
      res.json(rankings);
    } catch (error) {
      console.error("Alliance power calculation error:", error);
      res.status(500).json({ message: "Failed to calculate alliance power" });
    }
  });

  // Get specific alliance power breakdown
  app.get("/api/alliances/:id/power", async (req, res) => {
    try {
      const calculator = new AlliancePowerCalculator();
      const powerData = await calculator.calculateAllianceTotalPower(req.params.id);
      res.json(powerData);
    } catch (error) {
      console.error("Alliance power calculation error:", error);
      res.status(500).json({ message: "Failed to calculate alliance power" });
    }
  });

  // Predict battle outcome between alliances
  app.post("/api/alliances/battle-prediction", async (req, res) => {
    try {
      const { alliance1Id, alliance2Id } = req.body;
      const calculator = new AlliancePowerCalculator();
      const prediction = await calculator.predictAllianceBattle(alliance1Id, alliance2Id);
      res.json(prediction);
    } catch (error) {
      console.error("Battle prediction error:", error);
      res.status(500).json({ message: "Failed to predict battle outcome" });
    }
  });

  app.get("/api/battles/user/:userId", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const battles = await storage.getUserBattles(req.params.userId, limit);
      res.json(battles);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user battles" });
    }
  });

  // Message routes
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      
      // Broadcast message via WebSocket
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'new_message',
            data: message
          }));
        }
      });
      
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.get("/api/messages/:channel", async (req, res) => {
    try {
      const { channel } = req.params;
      const { allianceId, limit = "50" } = req.query;
      const messages = await storage.getMessages(
        channel, 
        allianceId as string, 
        parseInt(limit as string)
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // Courier routes
  app.post("/api/courier/encode", async (req, res) => {
    try {
      const { txHex, userId } = req.body;
      const result = await courierService.encodeTx(txHex);
      
      const transaction = await storage.createCourierTransaction({
        userId,
        txHex,
        encodedFrames: result.frames,
        status: "encoded"
      });
      
      res.json({ ...result, transactionId: transaction.id });
    } catch (error) {
      res.status(500).json({ message: "Failed to encode transaction" });
    }
  });

  app.post("/api/courier/decode", async (req, res) => {
    try {
      const { frames } = req.body;
      const result = await courierService.decodeFrames(frames);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to decode frames" });
    }
  });

  app.post("/api/courier/broadcast", async (req, res) => {
    try {
      const { txHex, network = "ethereum" } = req.body;
      const result = await courierService.broadcastTx(txHex, network);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to broadcast transaction" });
    }
  });

  app.get("/api/courier/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getUserCourierTransactions(req.params.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get courier transactions" });
    }
  });

  // Leaderboard route
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to get leaderboard" });
    }
  });

  // Trading API Routes
  
  // Items
  app.get("/api/items", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      const items = await storage.getUserItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user items" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const itemData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid item data" });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    try {
      const item = await storage.getItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to get item" });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const item = await storage.updateItem(req.params.id, req.body);
      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to update item" });
    }
  });

  // Marketplace
  app.get("/api/marketplace", async (req, res) => {
    try {
      const category = req.query.category as string;
      const sortBy = req.query.sortBy as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const listings = await storage.getMarketplaceListings(category, sortBy, limit);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to get marketplace listings" });
    }
  });

  app.post("/api/marketplace", async (req, res) => {
    try {
      const listingData = insertMarketplaceListingSchema.parse(req.body);
      const listing = await storage.createListing(listingData);
      
      // Update item as listed
      await storage.updateItem(listingData.itemId, { isListed: true });
      
      res.status(201).json(listing);
    } catch (error) {
      res.status(400).json({ message: "Invalid listing data" });
    }
  });

  app.get("/api/marketplace/:id", async (req, res) => {
    try {
      const listing = await storage.getListing(req.params.id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: "Failed to get listing" });
    }
  });

  app.patch("/api/marketplace/:id", async (req, res) => {
    try {
      const listing = await storage.updateListing(req.params.id, req.body);
      res.json(listing);
    } catch (error) {
      res.status(400).json({ message: "Failed to update listing" });
    }
  });

  app.post("/api/marketplace/:id/buy", async (req, res) => {
    try {
      const { buyerId, escrowData } = req.body;
      const listing = await storage.getListing(req.params.id);
      
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      
      if (listing.status !== 'active') {
        return res.status(400).json({ message: "Listing not available" });
      }
      
      // Create escrow contract
      const escrow = await storage.createEscrowContract({
        contractAddress: escrowData.contractAddress,
        buyerId,
        sellerId: listing.sellerId,
        itemId: listing.itemId,
        amount: listing.price,
        createdTxHash: escrowData.txHash
      });
      
      // Update listing status
      await storage.updateListing(req.params.id, { 
        status: 'sold',
        soldAt: new Date()
      });
      
      res.json({ escrow, listing });
    } catch (error) {
      res.status(400).json({ message: "Failed to purchase item" });
    }
  });

  // Trade Offers
  app.get("/api/trades", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const type = req.query.type as 'sent' | 'received' | undefined;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const offers = await storage.getUserTradeOffers(userId, type);
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trade offers" });
    }
  });

  app.post("/api/trades", async (req, res) => {
    try {
      const offerData = insertTradeOfferSchema.parse(req.body);
      const offer = await storage.createTradeOffer(offerData);
      res.status(201).json(offer);
    } catch (error) {
      res.status(400).json({ message: "Invalid trade offer data" });
    }
  });

  app.get("/api/trades/:id", async (req, res) => {
    try {
      const offer = await storage.getTradeOffer(req.params.id);
      if (!offer) {
        return res.status(404).json({ message: "Trade offer not found" });
      }
      res.json(offer);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trade offer" });
    }
  });

  app.patch("/api/trades/:id", async (req, res) => {
    try {
      const offer = await storage.updateTradeOffer(req.params.id, req.body);
      res.json(offer);
    } catch (error) {
      res.status(400).json({ message: "Failed to update trade offer" });
    }
  });

  app.post("/api/trades/:id/respond", async (req, res) => {
    try {
      const { response, txHash } = req.body; // response: 'accept' | 'decline'
      const updates: any = { 
        status: response === 'accept' ? 'accepted' : 'declined',
        respondedAt: new Date()
      };
      
      if (txHash) {
        updates.txHash = txHash;
      }
      
      if (response === 'accept') {
        updates.executedAt = new Date();
        updates.status = 'executed';
      }
      
      const offer = await storage.updateTradeOffer(req.params.id, updates);
      res.json(offer);
    } catch (error) {
      res.status(400).json({ message: "Failed to respond to trade offer" });
    }
  });

  // Escrow Contracts
  app.get("/api/escrow", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const type = req.query.type as 'buyer' | 'seller' | undefined;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const contracts = await storage.getUserEscrowContracts(userId, type);
      res.json(contracts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get escrow contracts" });
    }
  });

  app.post("/api/escrow", async (req, res) => {
    try {
      const contractData = insertEscrowContractSchema.parse(req.body);
      const contract = await storage.createEscrowContract(contractData);
      res.status(201).json(contract);
    } catch (error) {
      res.status(400).json({ message: "Invalid escrow contract data" });
    }
  });

  app.get("/api/escrow/:id", async (req, res) => {
    try {
      const contract = await storage.getEscrowContract(req.params.id);
      if (!contract) {
        return res.status(404).json({ message: "Escrow contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to get escrow contract" });
    }
  });

  app.patch("/api/escrow/:id", async (req, res) => {
    try {
      const contract = await storage.updateEscrowContract(req.params.id, req.body);
      res.json(contract);
    } catch (error) {
      res.status(400).json({ message: "Failed to update escrow contract" });
    }
  });

  app.post("/api/escrow/:id/complete", async (req, res) => {
    try {
      const { txHash } = req.body;
      const contract = await storage.updateEscrowContract(req.params.id, {
        status: 'completed',
        completedAt: new Date(),
        completedTxHash: txHash
      });
      
      // Transfer item ownership if applicable
      if (contract.itemId) {
        await storage.updateItem(contract.itemId, {
          ownerId: contract.buyerId,
          isListed: false
        });
      }
      
      res.json(contract);
    } catch (error) {
      res.status(400).json({ message: "Failed to complete escrow" });
    }
  });

  app.post("/api/escrow/:id/dispute", async (req, res) => {
    try {
      const { reason, evidence } = req.body;
      const contract = await storage.updateEscrowContract(req.params.id, {
        status: 'disputed',
        disputeReason: reason,
        resolutionData: { evidence, disputedAt: new Date() }
      });
      res.json(contract);
    } catch (error) {
      res.status(400).json({ message: "Failed to dispute escrow" });
    }
  });

  // Trading Posts
  app.get("/api/trading-posts", async (req, res) => {
    try {
      const territoryId = req.query.territoryId as string;
      const posts = await storage.getTradingPosts(territoryId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trading posts" });
    }
  });

  app.post("/api/trading-posts", async (req, res) => {
    try {
      const postData = insertTradingPostSchema.parse(req.body);
      const post = await storage.createTradingPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid trading post data" });
    }
  });

  app.get("/api/trading-posts/:id", async (req, res) => {
    try {
      const post = await storage.getTradingPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Trading post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to get trading post" });
    }
  });

  app.patch("/api/trading-posts/:id", async (req, res) => {
    try {
      const post = await storage.updateTradingPost(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Failed to update trading post" });
    }
  });

  // NFT Minting API Routes
  
  // Check if wallet is eligible to mint
  app.get("/api/nft/eligibility/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const eligibility = await storage.checkNftEligibility(walletAddress);
      res.json(eligibility);
    } catch (error) {
      res.status(500).json({ message: "Failed to check NFT eligibility" });
    }
  });

  // Get available territories for minting
  app.get("/api/nft/available-territories", async (req, res) => {
    try {
      // Get all territories and filter for unclaimed ones
      const allTerritories = await storage.getTerritories(1000); // Get many territories
      const availableTerritories = allTerritories.filter(t => !t.ownerId || t.status === 'unclaimed');
      
      // Return territories in a grid format with strategic value
      const territoryGrid = availableTerritories.map(territory => ({
        x: territory.x,
        y: territory.y,
        strategicValue: Math.floor(Math.random() * 100) + 1, // Mock strategic value
        resources: ['water', 'tech', 'fuel', 'weapons'][Math.floor(Math.random() * 4)],
        threat_level: Math.floor(Math.random() * 5) + 1,
        nearby_alliances: Math.floor(Math.random() * 3),
      }));
      
      res.json(territoryGrid);
    } catch (error) {
      res.status(500).json({ message: "Failed to get available territories" });
    }
  });

  // Create NFT mint record
  app.post("/api/nft/mint", async (req, res) => {
    try {
      const mintData = insertNftMintSchema.parse(req.body);
      
      // Check eligibility first
      const eligibility = await storage.checkNftEligibility(mintData.walletAddress);
      if (!eligibility.eligible) {
        return res.status(400).json({ message: eligibility.reason });
      }
      
      // Create mint record
      const mint = await storage.createNftMint(mintData);
      res.status(201).json(mint);
    } catch (error) {
      res.status(400).json({ message: "Invalid NFT mint data" });
    }
  });

  // Confirm NFT mint (called after blockchain transaction)
  app.post("/api/nft/confirm", async (req, res) => {
    try {
      const { tokenId, userId, txHash } = req.body;
      
      // Update mint with transaction hash
      await storage.updateNftMint(tokenId, { 
        mintTxHash: txHash,
        status: 'confirmed' 
      });
      
      // Update user and claim territory
      const user = await storage.confirmNftMint(tokenId, userId);
      
      res.json({ user, message: "NFT minted successfully and territory claimed!" });
    } catch (error) {
      res.status(400).json({ message: "Failed to confirm NFT mint" });
    }
  });

  // Get NFT mint status
  app.get("/api/nft/mint/:tokenId", async (req, res) => {
    try {
      const mint = await storage.getNftMint(req.params.tokenId);
      if (!mint) {
        return res.status(404).json({ message: "NFT mint not found" });
      }
      res.json(mint);
    } catch (error) {
      res.status(500).json({ message: "Failed to get NFT mint" });
    }
  });

  // Get user's NFT status
  app.get("/api/nft/user/:walletAddress", async (req, res) => {
    try {
      const mint = await storage.getNftMintByWallet(req.params.walletAddress);
      res.json(mint || { hasNft: false });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user NFT status" });
    }
  });

  return httpServer;
}
