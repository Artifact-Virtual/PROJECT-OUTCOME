import { spawn } from "child_process";
import { randomUUID } from "crypto";
import path from "path";

export interface EncodeResult {
  frames: string;
  frameCount: number;
  crc32: string;
  success: boolean;
  error?: string;
}

export interface DecodeResult {
  txHex: string;
  isValid: boolean;
  crc32: string;
  success: boolean;
  error?: string;
}

export interface BroadcastResult {
  txHash: string;
  success: boolean;
  network: string;
  error?: string;
}

export class CourierService {
  private pythonPath: string;
  private courierCliPath: string;

  constructor() {
    // In production, these paths should be configurable via environment variables
    this.pythonPath = process.env.PYTHON_PATH || "python3";
    this.courierCliPath = process.env.COURIER_CLI_PATH || "courier_cli.py";
  }

  async encodeTx(txHex: string): Promise<EncodeResult> {
    return new Promise((resolve) => {
      const outputFile = `/tmp/frames_${randomUUID()}.txt`;
      
      const args = [
        this.courierCliPath,
        "encode-tx",
        "--hex", txHex,
        "--output", outputFile
      ];

      const process = spawn(this.pythonPath, args);
      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", async (code) => {
        if (code !== 0) {
          resolve({
            frames: "",
            frameCount: 0,
            crc32: "",
            success: false,
            error: stderr || "Failed to encode transaction"
          });
          return;
        }

        try {
          // Read the encoded frames from the output file
          const fs = await import("fs");
          const frames = await fs.promises.readFile(outputFile, "utf-8");
          
          // Clean up temp file
          await fs.promises.unlink(outputFile).catch(() => {});
          
          // Parse frame count and CRC32 from stdout
          const frameCount = this.extractFrameCount(stdout);
          const crc32 = this.extractCRC32(stdout);

          resolve({
            frames: frames.trim(),
            frameCount,
            crc32,
            success: true
          });
        } catch (error) {
          resolve({
            frames: "",
            frameCount: 0,
            crc32: "",
            success: false,
            error: "Failed to read encoded frames"
          });
        }
      });
    });
  }

  async decodeFrames(frames: string): Promise<DecodeResult> {
    return new Promise(async (resolve) => {
      const inputFile = `/tmp/input_frames_${randomUUID()}.txt`;
      const outputFile = `/tmp/recovered_${randomUUID()}.hex`;

      try {
        // Write frames to temporary input file
        const fs = await import("fs");
        await fs.promises.writeFile(inputFile, frames);

        const args = [
          this.courierCliPath,
          "decode-frames",
          "--input", inputFile,
          "--output", outputFile
        ];

        const process = spawn(this.pythonPath, args);
        let stdout = "";
        let stderr = "";

        process.stdout.on("data", (data) => {
          stdout += data.toString();
        });

        process.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        process.on("close", async (code) => {
          try {
            // Clean up input file
            await fs.promises.unlink(inputFile).catch(() => {});

            if (code !== 0) {
              resolve({
                txHex: "",
                isValid: false,
                crc32: "",
                success: false,
                error: stderr || "Failed to decode frames"
              });
              return;
            }

            // Read the recovered transaction
            const txHex = await fs.promises.readFile(outputFile, "utf-8");
            
            // Clean up output file
            await fs.promises.unlink(outputFile).catch(() => {});

            // Parse validation status and CRC32 from stdout
            const isValid = this.extractValidationStatus(stdout);
            const crc32 = this.extractCRC32(stdout);

            resolve({
              txHex: txHex.trim(),
              isValid,
              crc32,
              success: true
            });
          } catch (error) {
            resolve({
              txHex: "",
              isValid: false,
              crc32: "",
              success: false,
              error: "Failed to read decoded transaction"
            });
          }
        });
      } catch (error) {
        resolve({
          txHex: "",
          isValid: false,
          crc32: "",
          success: false,
          error: "Failed to write input frames"
        });
      }
    });
  }

  async broadcastTx(txHex: string, network: string = "ethereum"): Promise<BroadcastResult> {
    return new Promise((resolve) => {
      const rpcUrl = this.getRPCUrl(network);
      if (!rpcUrl) {
        resolve({
          txHash: "",
          success: false,
          network,
          error: `Unsupported network: ${network}`
        });
        return;
      }

      const toolName = network === "bitcoin" ? "push-btc" : "push-eth";
      const args = [
        this.courierCliPath,
        toolName,
        "--hex", txHex,
        "--rpc-url", rpcUrl
      ];

      // Add Bitcoin-specific auth if needed
      if (network === "bitcoin") {
        const btcUser = process.env.BTC_RPC_USER;
        const btcPassword = process.env.BTC_RPC_PASSWORD;
        if (btcUser && btcPassword) {
          args.push("--user", btcUser, "--password", btcPassword);
        }
      }

      const process = spawn(this.pythonPath, args);
      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (code) => {
        if (code !== 0) {
          resolve({
            txHash: "",
            success: false,
            network,
            error: stderr || "Failed to broadcast transaction"
          });
          return;
        }

        // Extract transaction hash from stdout
        const txHash = this.extractTxHash(stdout);

        resolve({
          txHash,
          success: true,
          network
        });
      });
    });
  }

  async getStatus(): Promise<{ online: boolean; services: string[]; error?: string }> {
    return new Promise((resolve) => {
      const args = [this.courierCliPath, "list-services"];
      const process = spawn(this.pythonPath, args);
      let stdout = "";
      let stderr = "";

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (code) => {
        if (code !== 0) {
          resolve({
            online: false,
            services: [],
            error: stderr || "Courier service unavailable"
          });
          return;
        }

        const services = this.parseServices(stdout);
        resolve({
          online: true,
          services
        });
      });
    });
  }

  private getRPCUrl(network: string): string | null {
    switch (network) {
      case "ethereum":
        return process.env.ETH_RPC_URL || "https://mainnet.infura.io/v3/YOUR_PROJECT_ID";
      case "base":
        return process.env.BASE_RPC_URL || "https://mainnet.base.org";
      case "bitcoin":
        return process.env.BTC_RPC_URL || "https://bitcoin-rpc.example.com";
      default:
        return null;
    }
  }

  private extractFrameCount(output: string): number {
    const match = output.match(/(\d+)\s+frames?/i);
    return match ? parseInt(match[1]) : 0;
  }

  private extractCRC32(output: string): string {
    const match = output.match(/CRC32[:\s]+([a-fA-F0-9]{8})/i);
    return match ? match[1] : "";
  }

  private extractValidationStatus(output: string): boolean {
    return output.toLowerCase().includes("valid") || output.toLowerCase().includes("success");
  }

  private extractTxHash(output: string): string {
    // Look for transaction hash patterns (0x followed by 64 hex characters)
    const match = output.match(/(?:hash|txid)[:\s]*(0x[a-fA-F0-9]{64})/i);
    return match ? match[1] : "";
  }

  private parseServices(output: string): string[] {
    const lines = output.split('\n').filter(line => line.trim());
    return lines.filter(line => 
      line.toLowerCase().includes('service') || 
      line.toLowerCase().includes('available') ||
      line.toLowerCase().includes('online')
    );
  }
}
