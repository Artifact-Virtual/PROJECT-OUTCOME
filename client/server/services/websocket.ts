import { WebSocketServer, WebSocket } from "ws";
import { storage } from "../storage";

interface WSMessage {
  type: string;
  data: any;
  timestamp: number;
}

interface ConnectedClient {
  socket: WebSocket;
  userId?: string;
  allianceId?: string;
  lastPing: number;
}

export class WebSocketService {
  private clients: Map<string, ConnectedClient> = new Map();
  private pingInterval: NodeJS.Timeout;

  constructor(private wss: WebSocketServer) {
    this.setupEventHandlers();
    this.startPingInterval();
  }

  private setupEventHandlers() {
    this.wss.on("connection", (socket: WebSocket) => {
      const clientId = this.generateClientId();
      
      this.clients.set(clientId, {
        socket,
        lastPing: Date.now()
      });

      console.log(`WebSocket client connected: ${clientId}`);

      socket.on("message", (data) => {
        this.handleMessage(clientId, data);
      });

      socket.on("close", () => {
        this.clients.delete(clientId);
        console.log(`WebSocket client disconnected: ${clientId}`);
      });

      socket.on("error", (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.clients.delete(clientId);
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: "connected",
        data: { clientId },
        timestamp: Date.now()
      });
    });
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      const now = Date.now();
      const timeout = 30000; // 30 seconds

      for (const [clientId, client] of this.clients.entries()) {
        if (now - client.lastPing > timeout) {
          client.socket.terminate();
          this.clients.delete(clientId);
          console.log(`Client ${clientId} timed out`);
        } else if (client.socket.readyState === WebSocket.OPEN) {
          client.socket.ping();
        }
      }
    }, 15000); // Check every 15 seconds
  }

  private handleMessage(clientId: string, data: any) {
    try {
      const message = JSON.parse(data.toString());
      const client = this.clients.get(clientId);
      
      if (!client) return;

      switch (message.type) {
        case "authenticate":
          this.handleAuthentication(clientId, message.data);
          break;
        case "join_alliance":
          this.handleJoinAlliance(clientId, message.data);
          break;
        case "ping":
          client.lastPing = Date.now();
          this.sendToClient(clientId, {
            type: "pong",
            data: {},
            timestamp: Date.now()
          });
          break;
        default:
          console.log(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error(`Error handling message from ${clientId}:`, error);
    }
  }

  private handleAuthentication(clientId: string, data: { userId: string }) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.userId = data.userId;
    
    // Get user's alliance if any
    storage.getUserAlliance(data.userId).then(userAlliance => {
      if (userAlliance && client) {
        client.allianceId = userAlliance.alliance.id;
      }
    });

    this.sendToClient(clientId, {
      type: "authenticated",
      data: { userId: data.userId },
      timestamp: Date.now()
    });
  }

  private handleJoinAlliance(clientId: string, data: { allianceId: string }) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.allianceId = data.allianceId;
    
    this.sendToClient(clientId, {
      type: "alliance_joined",
      data: { allianceId: data.allianceId },
      timestamp: Date.now()
    });
  }

  private sendToClient(clientId: string, message: WSMessage) {
    const client = this.clients.get(clientId);
    if (client && client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(JSON.stringify(message));
    }
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for broadcasting game events
  public broadcastMessage(message: any, senderId: string) {
    const wsMessage: WSMessage = {
      type: "new_message",
      data: message,
      timestamp: Date.now()
    };

    // Send to all clients in the same channel
    for (const [clientId, client] of this.clients.entries()) {
      if (client.socket.readyState === WebSocket.OPEN) {
        // For global messages, send to everyone
        if (message.channel === "global") {
          client.socket.send(JSON.stringify(wsMessage));
        }
        // For alliance messages, send only to alliance members
        else if (message.channel === "alliance" && client.allianceId === message.allianceId) {
          client.socket.send(JSON.stringify(wsMessage));
        }
      }
    }
  }

  public broadcastBattleUpdate(battle: any) {
    const wsMessage: WSMessage = {
      type: "battle_update",
      data: battle,
      timestamp: Date.now()
    };

    // Send to all authenticated clients
    for (const [clientId, client] of this.clients.entries()) {
      if (client.userId && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify(wsMessage));
      }
    }
  }

  public broadcastTerritoryUpdate(territory: any) {
    const wsMessage: WSMessage = {
      type: "territory_update",
      data: territory,
      timestamp: Date.now()
    };

    // Send to all authenticated clients
    for (const [clientId, client] of this.clients.entries()) {
      if (client.userId && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify(wsMessage));
      }
    }
  }

  public broadcastAllianceUpdate(alliance: any) {
    const wsMessage: WSMessage = {
      type: "alliance_update",
      data: alliance,
      timestamp: Date.now()
    };

    // Send to alliance members
    for (const [clientId, client] of this.clients.entries()) {
      if (client.allianceId === alliance.id && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify(wsMessage));
      }
    }
  }

  public notifyUserLevelUp(userId: string, newLevel: number) {
    const wsMessage: WSMessage = {
      type: "level_up",
      data: { userId, newLevel },
      timestamp: Date.now()
    };

    // Send to the specific user
    for (const [clientId, client] of this.clients.entries()) {
      if (client.userId === userId && client.socket.readyState === WebSocket.OPEN) {
        client.socket.send(JSON.stringify(wsMessage));
        break;
      }
    }
  }

  public getConnectedUsersCount(): number {
    return Array.from(this.clients.values()).filter(client => client.userId).length;
  }

  public getAllianceMembers(allianceId: string): string[] {
    return Array.from(this.clients.values())
      .filter(client => client.allianceId === allianceId && client.userId)
      .map(client => client.userId!);
  }

  public shutdown() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    for (const [clientId, client] of this.clients.entries()) {
      if (client.socket.readyState === WebSocket.OPEN) {
        client.socket.close();
      }
    }

    this.clients.clear();
  }
}

export function setupWebSocket(wss: WebSocketServer): WebSocketService {
  return new WebSocketService(wss);
}
