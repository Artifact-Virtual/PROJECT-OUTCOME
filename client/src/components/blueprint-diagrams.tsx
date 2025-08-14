import { motion } from "framer-motion";

// Technical Blueprint SVG Component
export const TechnicalBlueprint = ({ children, title, specs }: { 
  children: React.ReactNode; 
  title: string; 
  specs?: string[];
}) => (
  <div className="relative bg-neutral-900 border border-cyan-400/30 p-4">
    {/* Blueprint grid background */}
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 600">
      <defs>
        <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="0.5"/>
        </pattern>
        <pattern id="blueprintGridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprintGrid)"/>
      <rect width="100%" height="100%" fill="url(#blueprintGridMajor)"/>
    </svg>
    
    {/* Title block */}
    <div className="relative z-10 mb-4 border border-cyan-400/50 bg-neutral-800/80 p-2">
      <div className="text-cyan-100 font-mono text-sm font-bold">{title}</div>
      {specs && (
        <div className="text-cyan-300/70 font-mono text-xs mt-1">
          {specs.map((spec, i) => (
            <div key={i}>{spec}</div>
          ))}
        </div>
      )}
    </div>
    
    {/* Diagram content */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Mesh Network Topology Diagram
export const MeshNetworkDiagram = () => (
  <TechnicalBlueprint 
    title="MESH NETWORK TOPOLOGY - BONE NET PROTOCOL"
    specs={["SPEC: P2P-RELAY-001", "FREQ: 2.4GHz-5GHz", "RANGE: 100-300m"]}
  >
    <svg viewBox="0 0 800 500" className="w-full h-64 border border-cyan-400/30">
      <defs>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#22d3ee"/>
        </marker>
      </defs>
      
      {/* Network Nodes */}
      <g filter="url(#nodeGlow)">
        {/* Primary Hub */}
        <rect x="375" y="225" width="50" height="50" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="2"/>
        <text x="400" y="245" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">PRIMARY</text>
        <text x="400" y="255" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">HUB-001</text>
        <text x="400" y="265" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">192.168.1.1</text>
        
        {/* Edge Nodes */}
        <rect x="150" y="100" width="40" height="40" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
        <text x="170" y="115" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">NODE-A</text>
        <text x="170" y="125" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">.2.1</text>
        
        <rect x="600" y="100" width="40" height="40" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
        <text x="620" y="115" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">NODE-B</text>
        <text x="620" y="125" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">.2.2</text>
        
        <rect x="100" y="350" width="40" height="40" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
        <text x="120" y="365" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">NODE-C</text>
        <text x="120" y="375" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">.2.3</text>
        
        <rect x="660" y="350" width="40" height="40" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
        <text x="680" y="365" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">NODE-D</text>
        <text x="680" y="375" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">.2.4</text>
      </g>
      
      {/* Connection Lines with Data Flow */}
      <g stroke="#22d3ee" strokeWidth="1.5" markerEnd="url(#arrowhead)">
        <line x1="375" y1="250" x2="190" y2="140" opacity="0.8"/>
        <line x1="400" y1="225" x2="600" y2="140" opacity="0.8"/>
        <line x1="375" y1="275" x2="140" y2="350" opacity="0.8"/>
        <line x1="425" y1="275" x2="660" y2="350" opacity="0.8"/>
        
        {/* Cross connections */}
        <line x1="190" y1="120" x2="600" y2="120" opacity="0.5" strokeDasharray="5,5"/>
        <line x1="140" y1="370" x2="660" y2="370" opacity="0.5" strokeDasharray="5,5"/>
      </g>
      
      {/* Signal Strength Indicators */}
      <g fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.6">
        <circle cx="400" cy="250" r="60">
          <animate attributeName="r" values="60;80;60" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="170" cy="120" r="30">
          <animate attributeName="r" values="30;45;30" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2.5s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* Technical Specifications */}
      <rect x="50" y="450" width="200" height="40" fill="rgba(0,0,0,0.7)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="60" y="465" fill="#22d3ee" fontSize="8" fontFamily="monospace">PROTOCOL: BONE-NET-P2P</text>
      <text x="60" y="475" fill="#22d3ee" fontSize="8" fontFamily="monospace">LATENCY: ~50-200ms</text>
      <text x="60" y="485" fill="#22d3ee" fontSize="8" fontFamily="monospace">THROUGHPUT: 1-10 TX/min</text>
    </svg>
  </TechnicalBlueprint>
);

// SMS Gateway Diagram
export const SMSGatewayDiagram = () => (
  <TechnicalBlueprint 
    title="SMS TRANSACTION GATEWAY - SIGNAL SCRIPT"
    specs={["SPEC: SMS-TX-002", "BAND: 850/900/1800/1900MHz", "PROTOCOL: GSM/CDMA"]}
  >
    <svg viewBox="0 0 800 500" className="w-full h-64 border border-cyan-400/30">
      <defs>
        <filter id="signalGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Cell Tower */}
      <g filter="url(#signalGlow)">
        <rect x="390" y="150" width="20" height="200" fill="#22d3ee" opacity="0.8"/>
        <polygon points="400,150 380,120 420,120" fill="#22d3ee" opacity="0.8"/>
        <line x1="385" y1="130" x2="415" y2="130" stroke="#22d3ee" strokeWidth="3"/>
        <line x1="390" y1="140" x2="410" y2="140" stroke="#22d3ee" strokeWidth="2"/>
        <text x="400" y="370" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">CELL TOWER</text>
        <text x="400" y="380" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">BTS-001</text>
      </g>
      
      {/* Mobile Devices */}
      <g>
        <rect x="150" y="280" width="30" height="50" rx="5" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="1"/>
        <rect x="155" y="285" width="20" height="15" fill="#22d3ee" opacity="0.3"/>
        <text x="165" y="345" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">SENDER</text>
        
        <rect x="620" y="280" width="30" height="50" rx="5" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="1"/>
        <rect x="625" y="285" width="20" height="15" fill="#22d3ee" opacity="0.3"/>
        <text x="635" y="345" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">RECEIVER</text>
        
        {/* Gateway Server */}
        <rect x="350" y="400" width="100" height="60" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2"/>
        <text x="400" y="420" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">SMS GATEWAY</text>
        <text x="400" y="430" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">PARSER/RELAY</text>
        <text x="400" y="445" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">api.sms-relay.net</text>
      </g>
      
      {/* Signal Waves */}
      <g stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.6">
        <path d="M 180 305 Q 290 250 390 180">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M 410 180 Q 520 250 620 305">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin="1s"/>
        </path>
        <path d="M 400 350 L 400 400" strokeWidth="2"/>
      </g>
      
      {/* Message Format */}
      <rect x="500" y="50" width="250" height="120" fill="rgba(0,0,0,0.8)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="510" y="70" fill="#22d3ee" fontSize="8" fontFamily="monospace" fontWeight="bold">SMS TX FORMAT:</text>
      <text x="510" y="85" fill="#22d3ee" fontSize="7" fontFamily="monospace">TO: +1234567890</text>
      <text x="510" y="95" fill="#22d3ee" fontSize="7" fontFamily="monospace">TX:0x1a2b3c4d5e6f...</text>
      <text x="510" y="105" fill="#22d3ee" fontSize="7" fontFamily="monospace">SIG:r=0xab12cd34...</text>
      <text x="510" y="115" fill="#22d3ee" fontSize="7" fontFamily="monospace">    s=0xef56gh78...</text>
      <text x="510" y="125" fill="#22d3ee" fontSize="7" fontFamily="monospace">    v=27</text>
      <text x="510" y="140" fill="#22d3ee" fontSize="7" fontFamily="monospace">GAS:21000</text>
      <text x="510" y="155" fill="#22d3ee" fontSize="6" fontFamily="monospace">MAX: 160 chars per SMS</text>
    </svg>
  </TechnicalBlueprint>
);

// Ham Radio Diagram
export const HamRadioDiagram = () => (
  <TechnicalBlueprint 
    title="HAM RADIO BLOCKCHAIN RELAY - STATIC HAUL"
    specs={["SPEC: HAM-TX-005", "FREQ: 3.5-29.7MHz HF", "POWER: 5-100W"]}
  >
    <svg viewBox="0 0 800 500" className="w-full h-64 border border-cyan-400/30">
      <defs>
        <filter id="radioGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Ionosphere */}
      <ellipse cx="400" cy="80" rx="350" ry="40" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="1" strokeDasharray="5,5"/>
      <text x="400" y="50" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">IONOSPHERE - F2 LAYER</text>
      
      {/* Ground Stations */}
      <g filter="url(#radioGlow)">
        {/* Station A */}
        <rect x="100" y="350" width="60" height="40" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="2"/>
        <rect x="120" y="330" width="20" height="20" fill="#22d3ee" opacity="0.6"/>
        <line x1="130" y1="330" x2="130" y2="300" stroke="#22d3ee" strokeWidth="3"/>
        <text x="130" y="405" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">HAM-STATION-A</text>
        <text x="130" y="415" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">KN4ABC</text>
        
        {/* Station B */}
        <rect x="640" y="350" width="60" height="40" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="2"/>
        <rect x="660" y="330" width="20" height="20" fill="#22d3ee" opacity="0.6"/>
        <line x1="670" y1="330" x2="670" y2="300" stroke="#22d3ee" strokeWidth="3"/>
        <text x="670" y="405" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">HAM-STATION-B</text>
        <text x="670" y="415" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">W5XYZ</text>
        
        {/* Relay Station */}
        <rect x="370" y="250" width="60" height="40" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
        <rect x="390" y="230" width="20" height="20" fill="#22d3ee" opacity="0.4"/>
        <line x1="400" y1="230" x2="400" y2="200" stroke="#22d3ee" strokeWidth="2"/>
        <text x="400" y="305" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">RELAY-001</text>
      </g>
      
      {/* Radio Wave Propagation */}
      <g stroke="#22d3ee" strokeWidth="2" fill="none">
        <path d="M 130 300 Q 250 150 400 200" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite"/>
        </path>
        <path d="M 400 200 Q 550 150 670 300" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="3s" repeatCount="indefinite" begin="1.5s"/>
        </path>
        
        {/* Skip propagation via ionosphere */}
        <path d="M 130 300 Q 400 100 670 300" opacity="0.4" strokeDasharray="10,5">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite"/>
        </path>
      </g>
      
      {/* Data Packet Visualization */}
      <rect x="50" y="450" width="300" height="40" fill="rgba(0,0,0,0.8)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="60" y="465" fill="#22d3ee" fontSize="8" fontFamily="monospace">PACKET: [HDR][TX-DATA][CRC][EOF]</text>
      <text x="60" y="475" fill="#22d3ee" fontSize="8" fontFamily="monospace">ENCODING: Base64 | COMPRESSION: GZIP</text>
      <text x="60" y="485" fill="#22d3ee" fontSize="8" fontFamily="monospace">FREQ: 14.230 MHz | MODE: PSK31</text>
      
      {/* Technical specs */}
      <rect x="450" y="450" width="200" height="40" fill="rgba(0,0,0,0.8)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="460" y="465" fill="#22d3ee" fontSize="8" fontFamily="monospace">PROPAGATION: SKYWAVE</text>
      <text x="460" y="475" fill="#22d3ee" fontSize="8" fontFamily="monospace">RANGE: 500-3000 km</text>
      <text x="460" y="485" fill="#22d3ee" fontSize="8" fontFamily="monospace">LATENCY: 100-500ms</text>
    </svg>
  </TechnicalBlueprint>
);

// Physical Handshake Diagram
export const PhysicalHandshakeDiagram = () => (
  <TechnicalBlueprint 
    title="PHYSICAL HANDSHAKE PROTOCOL - COURIER NETWORK"
    specs={["SPEC: PHY-TX-003", "TRANSPORT: HUMAN COURIER", "SECURITY: MULTI-LAYER"]}
  >
    <svg viewBox="0 0 800 500" className="w-full h-64 border border-cyan-400/30">
      <defs>
        <filter id="courierGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <pattern id="securePattern" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="none"/>
          <circle cx="2" cy="2" r="0.5" fill="rgba(34,211,238,0.3)"/>
        </pattern>
      </defs>
      
      {/* Offline Wallet */}
      <g filter="url(#courierGlow)">
        <rect x="50" y="200" width="80" height="60" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="2"/>
        <rect x="60" y="210" width="60" height="20" fill="rgba(34,211,238,0.3)"/>
        <text x="90" y="285" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">OFFLINE WALLET</text>
        <text x="90" y="295" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">LEDGER/TREZOR</text>
        <text x="90" y="305" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">AIR-GAPPED</text>
      </g>
      
      {/* Transaction Packaging */}
      <rect x="200" y="180" width="100" height="100" fill="url(#securePattern)" stroke="#22d3ee" strokeWidth="2"/>
      <text x="250" y="200" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">SECURE PACKAGE</text>
      <text x="250" y="220" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">• QR CODE</text>
      <text x="250" y="235" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">• USB ENCRYPTED</text>
      <text x="250" y="250" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">• TAMPER SEAL</text>
      <text x="250" y="265" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">• CHECKSUM</text>
      
      {/* Courier Transport */}
      <g>
        <ellipse cx="450" cy="230" rx="60" ry="40" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2"/>
        <circle cx="430" cy="220" r="8" fill="rgba(34,211,238,0.4)"/>
        <rect x="440" y="215" width="20" height="10" fill="rgba(34,211,238,0.3)"/>
        <path d="M 460 225 L 470 235 L 460 245 L 450 235 Z" fill="rgba(34,211,238,0.3)"/>
        <text x="450" y="285" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">COURIER TRANSPORT</text>
        <text x="450" y="295" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">VERIFIED CARRIER</text>
      </g>
      
      {/* Broadcast Station */}
      <g filter="url(#courierGlow)">
        <rect x="620" y="200" width="80" height="60" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="2"/>
        <rect x="630" y="210" width="60" height="20" fill="rgba(34,211,238,0.4)"/>
        <circle cx="660" cy="170" r="8" fill="#22d3ee" opacity="0.6"/>
        <text x="660" y="285" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">BROADCAST STN</text>
        <text x="660" y="295" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">ONLINE NODE</text>
        <text x="660" y="305" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">ETH MAINNET</text>
      </g>
      
      {/* Data Flow Arrows */}
      <g stroke="#22d3ee" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)">
        <line x1="130" y1="230" x2="190" y2="230"/>
        <line x1="300" y1="230" x2="380" y2="230"/>
        <line x1="520" y1="230" x2="610" y2="230"/>
      </g>
      
      {/* Security Verification Steps */}
      <rect x="50" y="350" width="700" height="120" fill="rgba(0,0,0,0.8)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="60" y="370" fill="#22d3ee" fontSize="9" fontFamily="monospace" fontWeight="bold">SECURITY VERIFICATION PROTOCOL:</text>
      
      <text x="70" y="390" fill="#22d3ee" fontSize="7" fontFamily="monospace">1. OFFLINE SIGNING: Hardware wallet creates signed transaction in air-gapped environment</text>
      <text x="70" y="405" fill="#22d3ee" fontSize="7" fontFamily="monospace">2. PACKAGE CREATION: Transaction encoded with AES-256, checksum generated, tamper seal applied</text>
      <text x="70" y="420" fill="#22d3ee" fontSize="7" fontFamily="monospace">3. COURIER VERIFICATION: Multi-factor authentication, GPS tracking, chain of custody logging</text>
      <text x="70" y="435" fill="#22d3ee" fontSize="7" fontFamily="monospace">4. BROADCAST VALIDATION: Seal verification, checksum validation, signature verification before broadcast</text>
      <text x="70" y="450" fill="#22d3ee" fontSize="7" fontFamily="monospace">5. NETWORK CONFIRMATION: Transaction broadcast to Ethereum mainnet with gas optimization</text>
      
      {/* Transport path indicator */}
      <path d="M 90 320 Q 250 100 450 150 Q 550 120 660 180" stroke="rgba(34,211,238,0.4)" strokeWidth="2" strokeDasharray="10,5" fill="none">
        <animate attributeName="stroke-dashoffset" values="0;-20" dur="3s" repeatCount="indefinite"/>
      </path>
      <text x="400" y="130" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">SECURE TRANSPORT ROUTE</text>
    </svg>
  </TechnicalBlueprint>
);

// USB Sneakernet Diagram  
export const USBSneakernetDiagram = () => (
  <TechnicalBlueprint 
    title="USB SNEAKERNET PROTOCOL - DATA RELIC SYSTEM"
    specs={["SPEC: USB-TX-004", "STORAGE: USB 3.0/3.1", "ENCRYPTION: AES-256"]}
  >
    <svg viewBox="0 0 800 500" className="w-full h-64 border border-cyan-400/30">
      <defs>
        <filter id="usbGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Offline Computer */}
      <g filter="url(#usbGlow)">
        <rect x="80" y="150" width="120" height="80" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2"/>
        <rect x="90" y="160" width="100" height="60" fill="rgba(34,211,238,0.2)"/>
        <circle cx="150" cy="190" r="3" fill="#ff4444"/>
        <text x="140" y="250" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">OFFLINE PC</text>
        <text x="140" y="260" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">AIR-GAPPED</text>
        <text x="140" y="270" textAnchor="middle" fill="#ff4444" fontSize="6" fontFamily="monospace">NO NETWORK</text>
      </g>
      
      {/* USB Device */}
      <g filter="url(#usbGlow)">
        <rect x="350" y="180" width="100" height="20" rx="10" fill="rgba(34,211,238,0.3)" stroke="#22d3ee" strokeWidth="2"/>
        <rect x="340" y="185" width="10" height="10" fill="#22d3ee"/>
        <rect x="335" y="187" width="5" height="6" fill="#22d3ee"/>
        <text x="400" y="220" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">USB DATA RELIC</text>
        <text x="400" y="235" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">ENCRYPTED STORAGE</text>
        <text x="400" y="245" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">32GB CAPACITY</text>
      </g>
      
      {/* Online Computer */}
      <g filter="url(#usbGlow)">
        <rect x="600" y="150" width="120" height="80" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2"/>
        <rect x="610" y="160" width="100" height="60" fill="rgba(34,211,238,0.2)"/>
        <circle cx="670" cy="190" r="3" fill="#44ff44"/>
        <text x="660" y="250" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">ONLINE PC</text>
        <text x="660" y="260" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">CONNECTED</text>
        <text x="660" y="270" textAnchor="middle" fill="#44ff44" fontSize="6" fontFamily="monospace">ETHERNET/WIFI</text>
      </g>
      
      {/* File System Structure */}
      <rect x="50" y="300" width="300" height="150" fill="rgba(0,0,0,0.8)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="60" y="320" fill="#22d3ee" fontSize="8" fontFamily="monospace" fontWeight="bold">USB FILE STRUCTURE:</text>
      <text x="70" y="340" fill="#22d3ee" fontSize="7" fontFamily="monospace">/transaction_queue/</text>
      <text x="80" y="355" fill="#22d3ee" fontSize="7" fontFamily="monospace">├── pending/</text>
      <text x="90" y="370" fill="#22d3ee" fontSize="7" fontFamily="monospace">│   ├── tx_001.json (2.1KB)</text>
      <text x="90" y="385" fill="#22d3ee" fontSize="7" fontFamily="monospace">│   ├── tx_002.json (1.8KB)</text>
      <text x="90" y="400" fill="#22d3ee" fontSize="7" fontFamily="monospace">│   └── tx_003.json (2.3KB)</text>
      <text x="80" y="415" fill="#22d3ee" fontSize="7" fontFamily="monospace">├── signed/</text>
      <text x="90" y="430" fill="#22d3ee" fontSize="7" fontFamily="monospace">│   └── batch_001.sig (512B)</text>
      <text x="80" y="445" fill="#22d3ee" fontSize="7" fontFamily="monospace">└── broadcasted/</text>
      
      {/* Network Connection */}
      <rect x="450" y="300" width="300" height="150" fill="rgba(0,0,0,0.8)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="460" y="320" fill="#22d3ee" fontSize="8" fontFamily="monospace" fontWeight="bold">BROADCAST SEQUENCE:</text>
      <text x="470" y="340" fill="#22d3ee" fontSize="7" fontFamily="monospace">1. Insert USB → Mount filesystem</text>
      <text x="470" y="355" fill="#22d3ee" fontSize="7" fontFamily="monospace">2. Scan pending/ directory</text>
      <text x="470" y="370" fill="#22d3ee" fontSize="7" fontFamily="monospace">3. Validate transaction signatures</text>
      <text x="470" y="385" fill="#22d3ee" fontSize="7" fontFamily="monospace">4. Estimate gas prices</text>
      <text x="470" y="400" fill="#22d3ee" fontSize="7" fontFamily="monospace">5. Broadcast to network</text>
      <text x="470" y="415" fill="#22d3ee" fontSize="7" fontFamily="monospace">6. Move to broadcasted/</text>
      <text x="470" y="430" fill="#22d3ee" fontSize="7" fontFamily="monospace">7. Generate confirmation receipt</text>
      
      {/* Data flow arrows */}
      <g stroke="#22d3ee" strokeWidth="3" fill="none">
        <path d="M 200 190 Q 275 160 340 190" markerEnd="url(#arrowhead)">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
        </path>
        <path d="M 450 190 Q 525 160 600 190" markerEnd="url(#arrowhead)">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" begin="1s"/>
        </path>
      </g>
      
      {/* Transport indicator */}
      <text x="400" y="140" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">PHYSICAL TRANSPORT</text>
      <path d="M 270 170 Q 400 120 530 170" stroke="rgba(34,211,238,0.4)" strokeWidth="2" strokeDasharray="8,4" fill="none">
        <animate attributeName="stroke-dashoffset" values="0;-24" dur="4s" repeatCount="indefinite"/>
      </path>
    </svg>
  </TechnicalBlueprint>
);

// Radio Broadcast Diagram
export const RadioBroadcastDiagram = () => (
  <TechnicalBlueprint 
    title="RADIO BROADCAST SYSTEM - GHOST MODE PROTOCOL"
    specs={["SPEC: RF-TX-006", "FREQ: VHF/UHF", "MODULATION: PSK/FSK"]}
  >
    <svg viewBox="0 0 800 500" className="w-full h-64 border border-cyan-400/30">
      <defs>
        <filter id="broadcastGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Transmitter Station */}
      <g filter="url(#broadcastGlow)">
        <rect x="100" y="250" width="80" height="60" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="2"/>
        <rect x="130" y="200" width="20" height="50" fill="#22d3ee" opacity="0.8"/>
        <line x1="140" y1="200" x2="140" y2="150" stroke="#22d3ee" strokeWidth="4"/>
        <line x1="120" y1="170" x2="160" y2="170" stroke="#22d3ee" strokeWidth="3"/>
        <line x1="125" y1="185" x2="155" y2="185" stroke="#22d3ee" strokeWidth="2"/>
        <text x="140" y="330" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">TX STATION</text>
        <text x="140" y="340" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">50W VHF</text>
      </g>
      
      {/* Receiver Stations */}
      <g filter="url(#broadcastGlow)">
        <rect x="550" y="180" width="60" height="40" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
        <rect x="570" y="160" width="20" height="20" fill="#22d3ee" opacity="0.6"/>
        <line x1="580" y1="160" x2="580" y2="140" stroke="#22d3ee" strokeWidth="2"/>
        <text x="580" y="240" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">RX-A</text>
        
        <rect x="650" y="280" width="60" height="40" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
        <rect x="670" y="260" width="20" height="20" fill="#22d3ee" opacity="0.6"/>
        <line x1="680" y1="260" x2="680" y2="240" stroke="#22d3ee" strokeWidth="2"/>
        <text x="680" y="340" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">RX-B</text>
        
        <rect x="600" y="380" width="60" height="40" fill="rgba(34,211,238,0.15)" stroke="#22d3ee" strokeWidth="1"/>
        <rect x="620" y="360" width="20" height="20" fill="#22d3ee" opacity="0.6"/>
        <line x1="630" y1="360" x2="630" y2="340" stroke="#22d3ee" strokeWidth="2"/>
        <text x="630" y="440" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">RX-C</text>
      </g>
      
      {/* Radio Waves */}
      <g stroke="#22d3ee" fill="none" opacity="0.7">
        <circle cx="140" cy="280" r="80" strokeWidth="1">
          <animate attributeName="r" values="80;120;80" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="140" cy="280" r="120" strokeWidth="1">
          <animate attributeName="r" values="120;160;120" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="140" cy="280" r="160" strokeWidth="1">
          <animate attributeName="r" values="160;200;160" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite"/>
        </circle>
      </g>
      
      {/* Signal Path Lines */}
      <g stroke="#22d3ee" strokeWidth="2" fill="none" opacity="0.6">
        <line x1="180" y1="280" x2="550" y2="200">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
        </line>
        <line x1="180" y1="280" x2="650" y2="300">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.8s" repeatCount="indefinite" begin="0.5s"/>
        </line>
        <line x1="180" y1="280" x2="600" y2="400">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite" begin="1s"/>
        </line>
      </g>
      
      {/* Modulation Info */}
      <rect x="250" y="50" width="300" height="120" fill="rgba(0,0,0,0.8)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="260" y="70" fill="#22d3ee" fontSize="8" fontFamily="monospace" fontWeight="bold">MODULATION SCHEMES:</text>
      <text x="270" y="90" fill="#22d3ee" fontSize="7" fontFamily="monospace">• PSK31: Phase Shift Keying - 31.25 baud</text>
      <text x="270" y="105" fill="#22d3ee" fontSize="7" fontFamily="monospace">• FSK: Frequency Shift Keying - 300 baud</text>
      <text x="270" y="120" fill="#22d3ee" fontSize="7" fontFamily="monospace">• RTTY: Radio Teletype - 45.45 baud</text>
      <text x="270" y="135" fill="#22d3ee" fontSize="7" fontFamily="monospace">• MFSK: Multi-FSK - Variable rate</text>
      <text x="270" y="150" fill="#22d3ee" fontSize="7" fontFamily="monospace">• Spread Spectrum: Anti-jam capable</text>
      
      {/* Technical specs */}
      <rect x="50" y="380" width="200" height="80" fill="rgba(0,0,0,0.8)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="60" y="400" fill="#22d3ee" fontSize="8" fontFamily="monospace">FREQUENCY BANDS:</text>
      <text x="70" y="415" fill="#22d3ee" fontSize="7" fontFamily="monospace">VHF: 144-148 MHz</text>
      <text x="70" y="430" fill="#22d3ee" fontSize="7" fontFamily="monospace">UHF: 420-450 MHz</text>
      <text x="70" y="445" fill="#22d3ee" fontSize="7" fontFamily="monospace">RANGE: 50-500 km</text>
    </svg>
  </TechnicalBlueprint>
);

// Satellite Communication Diagram
export const SatelliteDiagram = () => (
  <TechnicalBlueprint 
    title="SATELLITE UPLINK SYSTEM - SKYCHAIN RELAY"
    specs={["SPEC: SAT-TX-007", "FREQ: 1-40GHz", "ORBIT: LEO/GEO"]}
  >
    <svg viewBox="0 0 800 500" className="w-full h-64 border border-cyan-400/30">
      <defs>
        <filter id="satGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Satellites */}
      <g filter="url(#satGlow)">
        <rect x="200" y="50" width="30" height="20" fill="#22d3ee" opacity="0.8"/>
        <rect x="190" y="40" width="50" height="5" fill="#22d3ee" opacity="0.6"/>
        <rect x="190" y="75" width="50" height="5" fill="#22d3ee" opacity="0.6"/>
        <text x="215" y="95" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">LEO-SAT-1</text>
        
        <rect x="580" y="60" width="30" height="20" fill="#22d3ee" opacity="0.8"/>
        <rect x="570" y="50" width="50" height="5" fill="#22d3ee" opacity="0.6"/>
        <rect x="570" y="85" width="50" height="5" fill="#22d3ee" opacity="0.6"/>
        <text x="595" y="105" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">GEO-SAT-2</text>
      </g>
      
      {/* Ground Stations */}
      <g>
        {/* Transmit Station */}
        <ellipse cx="150" cy="400" rx="40" ry="20" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="2"/>
        <path d="M 150 380 Q 140 360 120 350 Q 150 340 180 350 Q 160 360 150 380" fill="rgba(34,211,238,0.3)" stroke="#22d3ee" strokeWidth="1"/>
        <text x="150" y="440" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">UPLINK DISH</text>
        <text x="150" y="450" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">TX-STATION</text>
        
        {/* Receive Station */}
        <ellipse cx="650" cy="400" rx="40" ry="20" fill="rgba(34,211,238,0.2)" stroke="#22d3ee" strokeWidth="2"/>
        <path d="M 650 380 Q 640 360 620 350 Q 650 340 680 350 Q 660 360 650 380" fill="rgba(34,211,238,0.3)" stroke="#22d3ee" strokeWidth="1"/>
        <text x="650" y="440" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">DOWNLINK DISH</text>
        <text x="650" y="450" textAnchor="middle" fill="#22d3ee" fontSize="7" fontFamily="monospace">RX-STATION</text>
        
        {/* Ground Control */}
        <rect x="350" y="380" width="100" height="60" fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="2"/>
        <text x="400" y="395" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">GROUND CONTROL</text>
        <text x="400" y="405" textAnchor="middle" fill="#22d3ee" fontSize="8" fontFamily="monospace">BLOCKCHAIN NODE</text>
        <text x="400" y="420" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">node.skychain.net</text>
        <text x="400" y="430" textAnchor="middle" fill="#22d3ee" fontSize="6" fontFamily="monospace">SYNC: ETH MAINNET</text>
      </g>
      
      {/* Communication Beams */}
      <g stroke="#22d3ee" strokeWidth="2" fill="none">
        {/* Uplink */}
        <line x1="150" y1="360" x2="215" y2="70" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
        </line>
        
        {/* Satellite to Satellite */}
        <line x1="230" y1="60" x2="580" y2="70" opacity="0.6" strokeDasharray="5,5">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="1s"/>
        </line>
        
        {/* Downlink */}
        <line x1="595" y1="80" x2="650" y2="360" opacity="0.7">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" begin="2s"/>
        </line>
        
        {/* Ground network */}
        <line x1="400" y1="380" x2="400" y2="320" strokeWidth="3"/>
        <text x="410" y="350" fill="#22d3ee" fontSize="6" fontFamily="monospace">FIBER UPLINK</text>
      </g>
      
      {/* Orbital indicators */}
      <ellipse cx="400" cy="250" rx="350" ry="150" fill="none" stroke="rgba(34,211,238,0.2)" strokeWidth="1" strokeDasharray="10,10"/>
      <text x="50" y="150" fill="#22d3ee" fontSize="7" fontFamily="monospace">LEO ORBIT: 160-2000km</text>
      
      {/* Technical specifications */}
      <rect x="50" y="300" width="200" height="60" fill="rgba(0,0,0,0.8)" stroke="rgba(34,211,238,0.5)" strokeWidth="1"/>
      <text x="60" y="315" fill="#22d3ee" fontSize="8" fontFamily="monospace">UPLINK: 14.0-14.5 GHz</text>
      <text x="60" y="325" fill="#22d3ee" fontSize="8" fontFamily="monospace">DOWNLINK: 11.7-12.2 GHz</text>
      <text x="60" y="335" fill="#22d3ee" fontSize="8" fontFamily="monospace">LATENCY: 250-600ms</text>
      <text x="60" y="345" fill="#22d3ee" fontSize="8" fontFamily="monospace">BANDWIDTH: 10-100 Mbps</text>
      <text x="60" y="355" fill="#22d3ee" fontSize="8" fontFamily="monospace">COVERAGE: GLOBAL</text>
    </svg>
  </TechnicalBlueprint>
);