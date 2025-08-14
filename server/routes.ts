import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertUserSchema, insertAllianceSchema, insertBattleSchema, insertMessageSchema } from "@shared/schema";
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

  return httpServer;
}
