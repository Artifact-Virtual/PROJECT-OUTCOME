import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RealisticWastelandCard, RealisticText, RealisticButton } from "./realistic-wasteland";
import { 
  MeshNetworkDiagram, 
  SMSGatewayDiagram, 
  HamRadioDiagram, 
  SatelliteDiagram 
} from './blueprint-diagrams';

interface Protocol {
  id: string;
  name: string;
  category: string;
  description: string;
  diagram: React.ReactNode;
  code: string;
  frequency?: string;
  range?: string;
  encryption?: string;
}

const PROTOCOLS: Protocol[] = [
  {
    id: "PRTCL1",
    name: "BONE NET",
    category: "Mesh Networking",
    description: "Create a decentralized, peer-to-peer network where devices connect directly to each other. Transactions are passed from device to device like whispers through a crowd.",
    diagram: <MeshNetworkDiagram />,
    code: `// BONE NET Protocol Implementation
class BoneNetNode {
  constructor(nodeId) {
    this.id = nodeId;
    this.peers = new Map();
    this.messageQueue = [];
  }

  connectToPeer(peerId, connection) {
    this.peers.set(peerId, connection);
    console.log(\`Connected to peer: \${peerId}\`);
  }

  broadcastTransaction(txData) {
    const packet = {
      id: generateId(),
      data: txData,
      hops: 0,
      timestamp: Date.now()
    };
    
    this.peers.forEach((conn, peerId) => {
      conn.send(JSON.stringify(packet));
    });
  }
}`,
    frequency: "2.4GHz ISM Band",
    range: "100-300m per hop",
    encryption: "AES-256-GCM"
  },
  {
    id: "PRTCL2",
    name: "SIGNAL SCRIPT",
    category: "SMS Transactions",
    description: "Utilize existing cellular towers for basic communication. Transactions can be sent via plain-text SMS containing simple commands, wallet addresses, and signatures.",
    diagram: <SMSGatewayDiagram />,
    code: `// SMS Transaction Protocol
function encodeSMSTransaction(tx) {
  const message = [
    'TX',
    tx.to.slice(0, 10),
    tx.value + 'ETH',
    'SIGN',
    tx.signature.slice(0, 16) + '...'
  ].join(':');
  
  return message;
}

function decodeSMSTransaction(smsText) {
  const parts = smsText.split(':');
  return {
    type: parts[0],
    to: parts[1],
    value: parseFloat(parts[2]),
    signature: parts[4]
  };
}`,
    frequency: "850-1900MHz Cellular",
    range: "Cell tower coverage",
    encryption: "SMS + App-level crypto"
  },
  {
    id: "PRTCL3",
    name: "PHYSICAL HANDSHAKE",
    category: "Offline Hardware Transfer",
    description: "Physical-delivery method for transactions. One person signs a transaction, another physically carries the data to a location with internet access.",
    diagram: `
    [WALLET A] → [SIGN TX] → [USB/QR] → [COURIER] → [BROADCAST STATION]
                     │                      │              │
                [OFFLINE]            [TRANSPORT]      [ONLINE]
                     │                      │              │
                [LOCAL SIGN]          [SNEAKERNET]    [BLOCKCHAIN]
    
    SECURITY LAYERS:
    • Hardware wallet signing
    • Encrypted data containers  
    • Multiple courier verification
    • Tamper-evident seals`,
    code: `// Physical Handshake Protocol
class PhysicalHandshake {
  static createTransportPackage(signedTx) {
    const package = {
      payload: encrypt(signedTx, randomKey()),
      checksum: sha256(signedTx),
      timestamp: Date.now(),
      courier_id: generateCourierId()
    };
    
    return {
      qr_code: generateQR(package),
      usb_data: package,
      verification: createTamperSeal(package)
    };
  }
  
  static verifyAndBroadcast(package) {
    if (verifyTamperSeal(package)) {
      const tx = decrypt(package.payload);
      return broadcastToNetwork(tx);
    }
    throw new Error('Package compromised');
  }
}`,
    frequency: "Physical Transport",
    range: "Unlimited (human transport)",
    encryption: "Hardware wallet + AES"
  },
  {
    id: "PRTCL4",
    name: "DATA RELIC",
    category: "USB Sneakernet",
    description: "Use a portable storage device as the data carrier. A signed transaction file is saved to a USB stick, physically moved to a device that has network access.",
    diagram: `
    [OFFLINE PC] → [USB STICK] → [ONLINE PC] → [BLOCKCHAIN]
         │             │             │             │
    [SIGN & SAVE] → [TRANSPORT] → [LOAD & TX] → [BROADCAST]
    
    FILE STRUCTURE:
    /transaction_queue/
    ├── pending/
    │   ├── tx_001.json
    │   └── tx_002.json
    ├── signed/
    │   └── batch_001.sig
    └── broadcasted/
        └── confirmed_001.json`,
    code: `// Data Relic USB Protocol
class DataRelic {
  static saveTransaction(usbPath, transaction) {
    const filename = \`tx_\${Date.now()}.json\`;
    const filepath = path.join(usbPath, 'pending', filename);
    
    const txPackage = {
      transaction,
      signature: signTransaction(transaction),
      metadata: {
        created: Date.now(),
        device_id: getDeviceId(),
        checksum: hashTransaction(transaction)
      }
    };
    
    fs.writeFileSync(filepath, JSON.stringify(txPackage));
    return filename;
  }
  
  static processPendingTransactions(usbPath) {
    const pendingDir = path.join(usbPath, 'pending');
    const files = fs.readdirSync(pendingDir);
    
    return files.map(file => {
      const data = JSON.parse(fs.readFileSync(file));
      return validateAndBroadcast(data);
    });
  }
}`,
    frequency: "USB 3.0/3.1",
    range: "Physical transport required",
    encryption: "File-level encryption"
  },
  {
    id: "PRTCL5",
    name: "STATIC HAUL",
    category: "Ham Radio Blockchain",
    description: "Harness amateur radio power. If ham radio transmits emails across vast distances, it can transmit blockchain data - resilient, cross-border communication.",
    diagram: <HamRadioDiagram />,
    code: `// Ham Radio Protocol Implementation
class StaticHaul {
  constructor(callsign, frequency) {
    this.callsign = callsign;
    this.frequency = frequency;
    this.ax25 = new AX25Protocol();
  }
  
  transmitTransaction(transaction) {
    const packet = this.ax25.createPacket({
      source: this.callsign,
      destination: "BLKCHN",
      data: compressTransaction(transaction),
      protocol: "TCP/IP"
    });
    
    return this.radio.transmit(packet, this.frequency);
  }
  
  receiveTransactions() {
    const packets = this.radio.listen(this.frequency);
    return packets
      .filter(p => p.destination === "BLKCHN")
      .map(p => decompressTransaction(p.data));
  }
}`,
    frequency: "3-30MHz HF Bands",
    range: "Global (HF skip)",
    encryption: "Digital signature + FEC"
  },
  {
    id: "PRTCL6",
    name: "GHOST MODE",
    category: "Radio Broadcast",
    description: "Leverage radio broadcasts to transmit transactions. Signed, compressed data packets converted to radio waves and broadcast over air.",
    diagram: `
    [TX DATA] → [MODULATE] → [BROADCAST] ~~~~ [RECEIVE] → [DEMOD] → [DECODE]
         │           │           │      RF       │         │         │
    [COMPRESS]   [FM/AM/SSB]  [ANTENNA]     [ANTENNA]  [SDR/RADIO] [EXTRACT]
    
    MODULATION SCHEMES:
    • FSK: Frequency Shift Keying
    • PSK: Phase Shift Keying  
    • OFDM: Orthogonal Frequency Division
    • Spread Spectrum: Anti-jam`,
    code: `// Ghost Mode Broadcast Protocol  
class GhostMode {
  constructor(frequency, modulation = 'PSK31') {
    this.frequency = frequency;
    this.modulation = modulation;
    this.sdr = new SDRInterface();
  }
  
  broadcastTransaction(tx) {
    const compressed = lzma.compress(JSON.stringify(tx));
    const encoded = base64.encode(compressed);
    const modulated = this.modulateData(encoded);
    
    return this.sdr.transmit({
      frequency: this.frequency,
      data: modulated,
      power: calculateOptimalPower(),
      duration: calculateTransmissionTime(encoded.length)
    });
  }
  
  scanForTransactions() {
    const signals = this.sdr.scan(this.frequency);
    return signals
      .filter(s => s.containsBlockchainData())
      .map(s => this.demodulateAndDecode(s));
  }
}`,
    frequency: "Various ISM bands",
    range: "Line of sight + atmospheric",
    encryption: "Spread spectrum + crypto"
  },
  {
    id: "PRTCL7",
    name: "SKYCHAIN RELAY",
    category: "Satellite Link",
    description: "Broadcast transactions directly into space using satellite dish. Satellite relays data back to receiving station connected to blockchain network.",
    diagram: <SatelliteDiagram />,
    code: `// Skychain Satellite Protocol
class SkychainRelay {
  constructor(satellite, groundStation) {
    this.satellite = satellite;
    this.station = groundStation;
    this.dish = new SatelliteDish();
  }
  
  calculatePassWindow() {
    return this.satellite.getNextPass(
      this.station.latitude,
      this.station.longitude
    );
  }
  
  uplinkTransaction(tx, passWindow) {
    const packet = {
      payload: tx,
      timestamp: Date.now(),
      destination: "BLOCKCHAIN_NET",
      priority: tx.gasPrice > 1000000000 ? "HIGH" : "NORMAL"
    };
    
    return this.dish.transmit({
      target: this.satellite,
      data: packet,
      window: passWindow,
      frequency: this.satellite.uplinkFreq
    });
  }
  
  receiveDownlink() {
    return this.dish.listen(this.satellite.downlinkFreq)
      .filter(p => p.destination === "BLOCKCHAIN_NET");
  }
}`,
    frequency: "1-40GHz (various bands)",
    range: "Global via satellite",
    encryption: "Satellite-grade encryption"
  }
];

interface HolographicProtocolProps {
  protocolId?: string;
  onClose?: () => void;
}

export const HolographicProtocol = ({ protocolId, onClose }: HolographicProtocolProps) => {
  const protocol = PROTOCOLS.find(p => p.id === protocolId);

  if (!protocol) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, rotateY: -90, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.5, rotateY: 90, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6
          }}
          className="max-w-6xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <RealisticWastelandCard variant="dark" className="p-0 overflow-hidden relative">
            {/* Holographic border glow */}
            <div className="absolute inset-0 border-2 border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.3)] pointer-events-none">
              <div className="absolute inset-2 border border-cyan-300/20 shadow-[inset_0_0_20px_rgba(34,211,238,0.2)]"></div>
            </div>
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-700 bg-gradient-to-r from-neutral-900 to-neutral-800 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-16 h-16 bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center relative"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(34,211,238,0.5)",
                        "0 0 40px rgba(34,211,238,0.8)",
                        "0 0 20px rgba(34,211,238,0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-2xl text-cyan-300">📡</span>
                    <div className="absolute inset-0 bg-cyan-400/10 animate-pulse"></div>
                  </motion.div>
                  <div>
                    <RealisticText variant="title" className="text-2xl text-cyan-100">
                      {protocol.name}
                    </RealisticText>
                    <RealisticText variant="subtitle" className="text-cyan-300/70">
                      {protocol.category} • {protocol.id}
                    </RealisticText>
                  </div>
                </div>
                <RealisticButton variant="ghost" onClick={onClose} className="text-cyan-300 hover:text-cyan-100">
                  ✕ CLOSE
                </RealisticButton>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Protocol Description */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <RealisticText variant="subtitle" className="text-cyan-200 border-b border-cyan-400/30 pb-2">
                  PROTOCOL DESCRIPTION
                </RealisticText>
                <RealisticText variant="body" className="text-neutral-300 leading-relaxed">
                  {protocol.description}
                </RealisticText>

                {/* Technical Specs */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="p-3 bg-neutral-800/50 border border-cyan-400/30">
                    <RealisticText variant="caption" className="text-cyan-300">FREQUENCY</RealisticText>
                    <RealisticText variant="body" className="text-neutral-200 font-mono text-xs">
                      {protocol.frequency}
                    </RealisticText>
                  </div>
                  <div className="p-3 bg-neutral-800/50 border border-cyan-400/30">
                    <RealisticText variant="caption" className="text-cyan-300">RANGE</RealisticText>
                    <RealisticText variant="body" className="text-neutral-200 font-mono text-xs">
                      {protocol.range}
                    </RealisticText>
                  </div>
                  <div className="p-3 bg-neutral-800/50 border border-cyan-400/30">
                    <RealisticText variant="caption" className="text-cyan-300">ENCRYPTION</RealisticText>
                    <RealisticText variant="body" className="text-neutral-200 font-mono text-xs">
                      {protocol.encryption}
                    </RealisticText>
                  </div>
                </div>
              </motion.div>

              {/* Network Diagram */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <RealisticText variant="subtitle" className="text-cyan-200 border-b border-cyan-400/30 pb-2">
                  TECHNICAL BLUEPRINT
                </RealisticText>
                <div className="border border-cyan-400/50 overflow-hidden">
                  {protocol.diagram}
                </div>
              </motion.div>
            </div>

            {/* Code Implementation */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-6 border-t border-neutral-700"
            >
              <RealisticText variant="subtitle" className="text-cyan-200 border-b border-cyan-400/30 pb-2 mb-4">
                IMPLEMENTATION CODE
              </RealisticText>
              <div className="p-4 bg-black border border-cyan-400/50 font-mono text-xs text-emerald-300 leading-relaxed overflow-auto max-h-96">
                <pre className="whitespace-pre-wrap">{protocol.code}</pre>
              </div>
            </motion.div>

            {/* Floating holographic elements */}
            <motion.div
              className="absolute top-4 right-4 w-4 h-4 bg-cyan-400 rounded-full opacity-60"
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-3 h-3 bg-cyan-300 rounded-full opacity-40"
              animate={{
                y: [0, -15, 0],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </RealisticWastelandCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const ProtocolGrid = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  return (
    <div className="space-y-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROTOCOLS.map((protocol) => (
          <motion.div
            key={protocol.id}
            className="p-4 bg-neutral-800 border border-neutral-700 hover:border-cyan-400/50 transition-all cursor-pointer relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedProtocol(protocol.id)}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-1 bg-cyan-500/20 border border-cyan-400/50 text-xs font-mono text-cyan-300">
                {protocol.id}
              </div>
            </div>
            <RealisticText variant="body" className="text-neutral-100 font-mono text-sm mb-1">
              {protocol.name}
            </RealisticText>
            <RealisticText variant="caption" className="text-neutral-400">
              {protocol.category}
            </RealisticText>
            
            {/* Hover glow */}
            <motion.div
              className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Ensure modal renders properly */}
      {selectedProtocol && (
        <HolographicProtocol 
          protocolId={selectedProtocol}
          onClose={() => setSelectedProtocol(null)}
        />
      )}
    </div>
  );
};