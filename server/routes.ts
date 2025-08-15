import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertUserSchema, insertAllianceSchema, insertBattleSchema, insertMessageSchema, insertCourierTransactionSchema,
  insertItemSchema, insertMarketplaceListingSchema, insertTradeOfferSchema, insertEscrowContractSchema, insertTradingPostSchema
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

  return httpServer;
}
