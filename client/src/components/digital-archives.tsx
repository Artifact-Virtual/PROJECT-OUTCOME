import { useState } from 'react';
import { 
  RealisticWastelandCard,
  RealisticText,
  RealisticButton
} from "@/components/realistic-wasteland";

interface Protocol {
  id: string;
  name: string;
  description: string;
  type: 'network' | 'communication' | 'transport' | 'emergency';
  status: 'active' | 'offline' | 'deprecated';
  lastUpdate: string;
  diagram?: string;
  specifications: {
    frequency?: string;
    range?: string;
    dataRate?: string;
    security?: string;
    power?: string;
    backup?: string;
  };
  implementation: string[];
  notes: string;
}

const OCSH_PROTOCOLS: Protocol[] = [
  {
    id: 'bone_net',
    name: 'BONE NET',
    description: 'Mesh networking protocol',
    type: 'network',
    status: 'active',
    lastUpdate: '2157-08-12',
    specifications: {
      frequency: '2.4GHz ISM band',
      range: '10-50km (terrain dependent)',
      dataRate: '250kbps mesh relay',
      security: 'AES-256 end-to-end',
      power: 'Ultra-low power consumption'
    },
    implementation: [
      'Self-healing mesh topology',
      'Dynamic route discovery',
      'Peer-to-peer data relay',
      'Emergency beacon integration',
      'Terrain-adaptive signal strength'
    ],
    notes: 'Primary backbone for wasteland communications. Nodes automatically form mesh networks without infrastructure.'
  },
  {
    id: 'radio_burst',
    name: 'RADIO BURST',
    description: 'Emergency broadcast system',
    type: 'emergency',
    status: 'active',
    lastUpdate: '2157-07-28',
    specifications: {
      frequency: 'VHF/UHF emergency bands',
      range: '5-100km (atmospheric conditions)',
      dataRate: '9600 baud burst transmission',
      security: 'Rolling code encryption',
      power: 'High-power emergency mode'
    },
    implementation: [
      'Burst transmission protocol',
      'Atmospheric skip propagation',
      'Emergency priority queuing',
      'Solar flare resilience',
      'Battery backup systems'
    ],
    notes: 'Critical emergency communications when mesh networks fail. Uses atmospheric bounce for extended range.'
  },
  {
    id: 'satellite_link',
    name: 'SATELLITE LINK',
    description: 'High-orbit relay network',
    type: 'communication',
    status: 'active',
    lastUpdate: '2157-08-01',
    specifications: {
      frequency: 'L/S-band uplink',
      range: 'Global coverage',
      dataRate: '2Mbps satellite relay',
      security: 'Military-grade encryption',
      power: 'Solar array powered'
    },
    implementation: [
      'Hardened orbital relays',
      'Anti-jamming protocols',
      'Store-and-forward messaging',
      'Debris-avoidance systems',
      'Ground station redundancy'
    ],
    notes: 'Legacy orbital infrastructure maintained for long-range communications. Limited by solar activity.'
  },
  {
    id: 'usb_sneakernet',
    name: 'USB SNEAKERNET',
    description: 'Physical data transport',
    type: 'transport',
    status: 'active',
    lastUpdate: '2157-06-15',
    specifications: {
      dataRate: 'Variable (transport dependent)',
      range: 'Physical courier range',
      security: 'Hardware encryption modules',
      backup: 'Redundant storage devices'
    },
    implementation: [
      'Tamper-evident storage devices',
      'Biometric access controls',
      'Data redundancy protocols',
      'Dead-drop verification',
      'Chain-of-custody tracking'
    ],
    notes: 'Most secure method for sensitive data transfer. Physical courier networks remain operational.'
  },
  {
    id: 'ham_radio',
    name: 'HAM RADIO',
    description: 'Low-frequency voice comms',
    type: 'communication',
    status: 'active',
    lastUpdate: '2157-08-08',
    specifications: {
      frequency: 'HF/VHF amateur bands',
      range: '10-1000km (propagation)',
      dataRate: 'Voice/slow scan digital',
      security: 'Open protocol (exercise caution)',
      power: 'Variable 1-100W'
    },
    implementation: [
      'Ionospheric propagation',
      'Voice and digital modes',
      'Emergency coordination nets',
      'Backup power systems',
      'Portable operation capability'
    ],
    notes: 'Reliable backup communications using ionospheric propagation. Monitor for intelligence gathering.'
  },
  {
    id: 'sms_gateway',
    name: 'SMS GATEWAY',
    description: 'Cellular backup (OFFLINE)',
    type: 'emergency',
    status: 'offline',
    lastUpdate: '2156-11-03',
    specifications: {
      frequency: 'Cellular GSM bands',
      range: 'Cell tower coverage',
      dataRate: '160 character messages',
      security: 'Legacy cellular encryption',
      backup: 'Generator-powered towers'
    },
    implementation: [
      'Cellular tower networks',
      'SMS routing protocols',
      'Emergency alert system',
      'Battery backup stations',
      'Satellite backhaul links'
    ],
    notes: 'Cellular infrastructure largely compromised. Some towers remain operational with backup power.'
  }
];

interface DigitalArchivesProps {
  className?: string;
}

export const DigitalArchives = ({ className = "" }: DigitalArchivesProps) => {
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [terminalMode, setTerminalMode] = useState(false);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-emerald-400';
      case 'offline': return 'text-red-400';
      case 'deprecated': return 'text-yellow-600';
      default: return 'text-neutral-400';
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'network': return 'text-blue-400';
      case 'communication': return 'text-emerald-400';
      case 'transport': return 'text-amber-400';
      case 'emergency': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  if (selectedProtocol) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <RealisticButton
            variant="ghost"
            onClick={() => setSelectedProtocol(null)}
            className="text-neutral-400 hover:text-neutral-100"
          >
            ← Back to Archives
          </RealisticButton>
          <div className={`text-sm font-bold ${getStatusColor(selectedProtocol.status)}`}>
            {selectedProtocol.status.toUpperCase()}
          </div>
        </div>

        <RealisticWastelandCard variant="default" className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-neutral-800 border border-neutral-600 flex items-center justify-center">
                <span className="text-lg">📡</span>
              </div>
              <div>
                <RealisticText variant="subtitle" className="text-neutral-100">
                  {selectedProtocol.name}
                </RealisticText>
                <RealisticText variant="caption" className="text-neutral-400">
                  Protocol Classification: {selectedProtocol.description}
                </RealisticText>
              </div>
            </div>
          </div>

          {/* Protocol Diagram */}
          <div className="mb-6 p-4 bg-neutral-900 border border-neutral-700">
            <RealisticText variant="subtitle" className="mb-4">Network Topology</RealisticText>
            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div className="p-3 bg-neutral-800 border border-neutral-600">
                <div className="text-emerald-400 mb-1">NODE A</div>
                <div className="text-neutral-400">Primary Relay</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-amber-400">←→</div>
              </div>
              <div className="p-3 bg-neutral-800 border border-neutral-600">
                <div className="text-emerald-400 mb-1">NODE B</div>
                <div className="text-neutral-400">Mesh Point</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-amber-400 text-xs">
                ↕ {selectedProtocol.specifications.range || 'Variable Range'}
              </div>
              <div className="p-2 bg-neutral-800 border border-neutral-600 mt-2">
                <div className="text-blue-400 text-xs">GROUND STATION</div>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <RealisticText variant="subtitle" className="mb-3">Technical Specifications</RealisticText>
              <div className="space-y-2 text-sm">
                {Object.entries(selectedProtocol.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-neutral-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-neutral-100">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <RealisticText variant="subtitle" className="mb-3">Implementation Details</RealisticText>
              <div className="space-y-1 text-sm">
                {selectedProtocol.implementation.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-1">•</span>
                    <span className="text-neutral-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Protocol Notes */}
          <div className="p-4 bg-neutral-800 border border-neutral-600">
            <RealisticText variant="body" className="text-amber-400 font-semibold mb-2">
              Operational Notes
            </RealisticText>
            <RealisticText variant="caption" className="text-neutral-300 leading-relaxed">
              {selectedProtocol.notes}
            </RealisticText>
          </div>

          <div className="mt-4 text-xs text-neutral-500">
            Last Protocol Update: {selectedProtocol.lastUpdate} • Classification: OCSH-RESTRICTED
          </div>
        </RealisticWastelandCard>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <RealisticWastelandCard variant="default" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-neutral-800 border border-neutral-600 flex items-center justify-center">
            <span className="text-lg">📡</span>
          </div>
          <div>
            <RealisticText variant="subtitle" className="text-neutral-100">
              OCSH Protocol Archives
            </RealisticText>
            <RealisticText variant="caption" className="text-neutral-400">
              Classified: Offline Blockchain Protocols
            </RealisticText>
          </div>
        </div>

        {/* Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {OCSH_PROTOCOLS.map((protocol) => (
            <button
              key={protocol.id}
              onClick={() => setSelectedProtocol(protocol)}
              className="p-4 bg-neutral-800 border border-neutral-600 hover:border-amber-600 transition-colors text-left group"
            >
              <div className="flex justify-between items-start mb-2">
                <RealisticText variant="body" className="text-neutral-100 group-hover:text-amber-400">
                  {protocol.name}
                </RealisticText>
                <div className={`text-xs font-bold ${getStatusColor(protocol.status)}`}>
                  {protocol.status.toUpperCase()}
                </div>
              </div>
              <RealisticText variant="caption" className="text-neutral-400 mb-2">
                {protocol.description}
              </RealisticText>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${getTypeColor(protocol.type)} uppercase`}>
                  {protocol.type}
                </span>
                <span className="text-xs text-neutral-500">
                  Updated: {protocol.lastUpdate}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Terminal Interface */}
        <div className="border border-emerald-700 bg-neutral-900">
          <div className="bg-emerald-900/20 p-2 border-b border-emerald-700">
            <RealisticText variant="caption" className="text-emerald-400 font-mono">
              TERMINAL READY
            </RealisticText>
          </div>
          <div className="p-4 font-mono text-sm">
            <div className="text-emerald-400 mb-1">
              {">"} Type 'continuum' to display complete protocol transmission
            </div>
            <div className="text-neutral-400">
              {">"} Command: _
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <RealisticButton
            variant="primary"
            onClick={() => setTerminalMode(!terminalMode)}
            className="w-full"
          >
            Execute: continuum
          </RealisticButton>
          <RealisticButton
            variant="secondary"
            className="w-full"
          >
            Network Status
          </RealisticButton>
        </div>

        <div className="mt-6 p-4 bg-neutral-800 border border-neutral-600">
          <RealisticText variant="caption" className="text-neutral-400 leading-relaxed">
            The true essence of blockchain is independent of the internet. If one route fails, a resilient network seeks another path. As long as data can be transferred, value can be transferred.
          </RealisticText>
        </div>
      </RealisticWastelandCard>
    </div>
  );
};