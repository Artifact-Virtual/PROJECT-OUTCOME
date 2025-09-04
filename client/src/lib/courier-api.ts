import { apiRequest } from "./queryClient";

export interface EncodeResult {
  frames: string;
  transactionId: string;
  frameCount: number;
  crc32: string;
}

export interface DecodeResult {
  txHex: string;
  isValid: boolean;
  crc32: string;
}

export interface BroadcastResult {
  txHash: string;
  success: boolean;
  network: string;
}

export class CourierAPI {
  async encodeTx(txHex: string, userId: string): Promise<EncodeResult> {
    const response = await apiRequest("POST", "/api/courier/encode", {
      txHex,
      userId,
    });
    return await response.json();
  }

  async decodeFrames(frames: string): Promise<DecodeResult> {
    const response = await apiRequest("POST", "/api/courier/decode", {
      frames,
    });
    return await response.json();
  }

  async broadcastTx(txHex: string, network = "ethereum"): Promise<BroadcastResult> {
    const response = await apiRequest("POST", "/api/courier/broadcast", {
      txHex,
      network,
    });
    return await response.json();
  }

  async getUserTransactions(userId: string): Promise<any[]> {
    const response = await apiRequest("GET", `/api/courier/transactions/${userId}`);
    return await response.json();
  }
}

export const courierApi = new CourierAPI();
