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