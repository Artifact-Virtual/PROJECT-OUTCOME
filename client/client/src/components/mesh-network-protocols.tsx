import { useState, useEffect } from 'react';
import { 
  RealisticWastelandCard,
  RealisticText,
  RealisticButton
} from "@/components/realistic-wasteland";

interface MeshNode {
  id: string;
  name: string;
  type: 'relay' | 'gateway' | 'terminal' | 'repeater';
  status: 'online' | 'offline' | 'degraded';
  location: string;
  connections: string[];
  bandwidth: number;
  latency: number;
  lastSeen: number;
  encryption: 'AES-256' | 'RSA-2048' | 'QUANTUM' | 'LEGACY';
  powerLevel: number;
  range: number;
}

interface NetworkProtocol {
  id: string;
  name: string;
  frequency: string;
  status: 'active' | 'standby' | 'offline';
  throughput: string;
  description: string;
  security: 'HIGH' | 'MEDIUM' | 'LOW';
}

const MESH_NODES: MeshNode[] = [
  {
    id: 'node_alpha',
    name: 'ALPHA RELAY',
    type: 'gateway',
    status: 'online',
    location: 'Sector A-1',
    connections: ['node_beta', 'node_gamma', 'node_delta'],
    bandwidth: 850,
    latency: 45,
    lastSeen: Date.now(),
    encryption: 'AES-256',
    powerLevel: 95,
    range: 5200
  },
  {
    id: 'node_beta',
    name: 'BETA TERMINAL',
    type: 'terminal',
    status: 'online',
    location: 'Sector B-3',
    connections: ['node_alpha', 'node_echo'],
    bandwidth: 420,
    latency: 78,
    lastSeen: Date.now() - 30000,
    encryption: 'RSA-2048',
    powerLevel: 72,
    range: 3800
  },
  {
    id: 'node_gamma',
    name: 'GAMMA REPEATER',
    type: 'repeater',
    status: 'degraded',
    location: 'Sector C-2',
    connections: ['node_alpha', 'node_delta'],
    bandwidth: 180,
    latency: 120,
    lastSeen: Date.now() - 120000,
    encryption: 'LEGACY',
    powerLevel: 34,
    range: 2100
  },
  {
    id: 'node_delta',
    name: 'DELTA GATEWAY',
    type: 'gateway',
    status: 'online',
    location: 'Sector D-4',
    connections: ['node_alpha', 'node_gamma', 'node_foxtrot'],
    bandwidth: 720,
    latency: 52,
    lastSeen: Date.now() - 15000,
    encryption: 'QUANTUM',
    powerLevel: 88,
    range: 4900
  },
  {
    id: 'node_echo',
    name: 'ECHO RELAY',
    type: 'relay',
    status: 'offline',
    location: 'Sector E-1',
    connections: ['node_beta'],
    bandwidth: 0,
    latency: 999,
    lastSeen: Date.now() - 600000,
    encryption: 'AES-256',
    powerLevel: 0,
    range: 0
  },
  {
    id: 'node_foxtrot',
    name: 'FOXTROT TERMINAL',
    type: 'terminal',
    status: 'online',
    location: 'Sector F-5',
    connections: ['node_delta'],
    bandwidth: 320,
    latency: 95,
    lastSeen: Date.now() - 45000,
    encryption: 'RSA-2048',
    powerLevel: 61,
    range: 2800
  }
];

const NETWORK_PROTOCOLS: NetworkProtocol[] = [
  {
    id: 'bone_net',
    name: 'BONE NET',
    frequency: '2.4-5.8 GHz',
    status: 'active',
    throughput: '850 kbps',
    description: 'Primary mesh networking protocol with automatic routing',
    security: 'HIGH'
  },
  {
    id: 'radio_burst',
    name: 'RADIO BURST',
    frequency: '430-440 MHz',
    status: 'active',
    throughput: '1.2 kbps',
    description: 'Emergency broadcast system for critical messages',
    security: 'MEDIUM'
  },
  {
    id: 'lora_mesh',
    name: 'LORA MESH',
    frequency: '902-928 MHz',
    status: 'standby',
    throughput: '250 kbps',
    description: 'Long-range mesh network for remote operations',
    security: 'HIGH'
  },
  {
    id: 'satellite_uplink',
    name: 'SATELLITE UPLINK',
    frequency: '14.0-14.5 GHz',
    status: 'offline',
    throughput: '2.5 Mbps',
    description: 'High-orbit relay network (currently degraded)',
    security: 'HIGH'
  }
];

interface MeshNetworkManagerProps {
  className?: string;
}

export const MeshNetworkManager = ({ className = "" }: MeshNetworkManagerProps) => {
  const [nodes, setNodes] = useState<MeshNode[]>(MESH_NODES);
  const [protocols, setProtocols] = useState<NetworkProtocol[]>(NETWORK_PROTOCOLS);
  const [selectedNode, setSelectedNode] = useState<MeshNode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [networkMap, setNetworkMap] = useState<boolean>(false);

  // Simulate network activity
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        const updated = { ...node };
        
        // Simulate network fluctuations
        if (node.status === 'online') {
          updated.bandwidth += (Math.random() - 0.5) * 50;
          updated.latency += (Math.random() - 0.5) * 10;
          updated.powerLevel += (Math.random() - 0.5) * 5;
          
          // Keep within realistic bounds
          updated.bandwidth = Math.max(0, Math.min(1000, updated.bandwidth));
          updated.latency = Math.max(20, Math.min(500, updated.latency));
          updated.powerLevel = Math.max(0, Math.min(100, updated.powerLevel));
          
          // Random status changes
          if (Math.random() < 0.02) {
            updated.status = updated.powerLevel < 30 ? 'degraded' : 'online';
          }
        }
        
        return updated;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getNodeStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return 'text-emerald-400';
      case 'degraded': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const getProtocolStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'text-emerald-400';
      case 'standby': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const getSecurityColor = (security: string): string => {
    switch (security) {
      case 'HIGH': return 'text-emerald-400';
      case 'MEDIUM': return 'text-yellow-400';
      case 'LOW': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  const scanNetwork = () => {
    setIsScanning(true);
    setTimeout(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        lastSeen: node.status !== 'offline' ? Date.now() : node.lastSeen
      })));
      setIsScanning(false);
    }, 3000);
  };

  const toggleProtocol = (protocolId: string) => {
    setProtocols(prev => prev.map(protocol => {
      if (protocol.id === protocolId) {
        const newStatus = protocol.status === 'active' ? 'standby' : 'active';
        return { ...protocol, status: newStatus };
      }
      return protocol;
    }));
  };

  const repairNode = (nodeId: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          status: 'online',
          powerLevel: Math.min(100, node.powerLevel + 50),
          bandwidth: Math.min(1000, node.bandwidth + 200),
          latency: Math.max(20, node.latency - 30),
          lastSeen: Date.now()
        };
      }
      return node;
    }));
  };

  const getTimeSince = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const onlineNodes = nodes.filter(n => n.status === 'online').length;
  const totalBandwidth = nodes.filter(n => n.status === 'online').reduce((sum, n) => sum + n.bandwidth, 0);
  const averageLatency = nodes.filter(n => n.status === 'online').reduce((sum, n) => sum + n.latency, 0) / onlineNodes || 0;

  return (
    <div className={`space-y-6 ${className}`}>
      <RealisticWastelandCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <RealisticText variant="title" className="text-neutral-100">
              Mesh Network Protocols
            </RealisticText>
            <RealisticText variant="caption" className="text-neutral-500">
              Decentralized Communication Infrastructure
            </RealisticText>
          </div>
          <div className="flex gap-3">
            <RealisticButton
              variant="secondary"
              size="sm"
              onClick={() => setNetworkMap(!networkMap)}
            >
              {networkMap ? 'Node List' : 'Network Map'}
            </RealisticButton>
            <RealisticButton
              variant="primary"
              size="sm"
              onClick={scanNetwork}
              disabled={isScanning}
            >
              {isScanning ? 'Scanning...' : 'Network Scan'}
            </RealisticButton>
          </div>
        </div>

        {/* Network Status */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-neutral-900 border border-neutral-700 p-4 text-center">
            <div className="text-xl font-bold text-emerald-400">{onlineNodes}/{nodes.length}</div>
            <div className="text-xs text-neutral-500">Nodes Online</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-700 p-4 text-center">
            <div className="text-xl font-bold text-amber-400">{Math.floor(totalBandwidth)}</div>
            <div className="text-xs text-neutral-500">Total Bandwidth (kbps)</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-700 p-4 text-center">
            <div className="text-xl font-bold text-blue-400">{Math.floor(averageLatency)}</div>
            <div className="text-xs text-neutral-500">Avg Latency (ms)</div>
          </div>
        </div>

        {/* Network Protocols */}
        <div className="mb-6">
          <RealisticText variant="subtitle" className="mb-3">Active Protocols</RealisticText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {protocols.map((protocol) => (
              <div
                key={protocol.id}
                className="bg-neutral-900 border border-neutral-700 p-3"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-sm text-neutral-100">{protocol.name}</div>
                    <div className="text-xs text-neutral-400">{protocol.frequency}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${getProtocolStatusColor(protocol.status)}`}>
                      {protocol.status.toUpperCase()}
                    </div>
                    <div className={`text-xs ${getSecurityColor(protocol.security)}`}>
                      {protocol.security}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-neutral-500 mb-2">{protocol.description}</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400">{protocol.throughput}</span>
                  <RealisticButton
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleProtocol(protocol.id)}
                    className="text-xs px-2 py-1"
                  >
                    {protocol.status === 'active' ? 'Disable' : 'Enable'}
                  </RealisticButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Nodes */}
        <div>
          <RealisticText variant="subtitle" className="mb-3">Mesh Nodes</RealisticText>
          <div className="space-y-3">
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`bg-neutral-900 border p-4 cursor-pointer transition-colors ${
                  selectedNode?.id === node.id 
                    ? 'border-amber-600 bg-amber-900/10' 
                    : 'border-neutral-700 hover:border-neutral-600'
                }`}
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-sm text-neutral-100">{node.name}</div>
                    <div className="text-xs text-neutral-400 uppercase">{node.type} • {node.location}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${getNodeStatusColor(node.status)}`}>
                      {node.status.toUpperCase()}
                    </div>
                    <div className="text-xs text-neutral-500">{node.encryption}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-neutral-400">Bandwidth</div>
                    <div className="text-neutral-100 font-mono">{Math.floor(node.bandwidth)} kbps</div>
                  </div>
                  <div>
                    <div className="text-neutral-400">Latency</div>
                    <div className="text-neutral-100 font-mono">{Math.floor(node.latency)} ms</div>
                  </div>
                  <div>
                    <div className="text-neutral-400">Power</div>
                    <div className="text-neutral-100 font-mono">{Math.floor(node.powerLevel)}%</div>
                  </div>
                  <div>
                    <div className="text-neutral-400">Range</div>
                    <div className="text-neutral-100 font-mono">{node.range}m</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-700">
                  <div className="text-xs text-neutral-500">
                    Connections: {node.connections.length} • Last seen: {getTimeSince(node.lastSeen)}
                  </div>
                  {node.status !== 'online' && (
                    <RealisticButton
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        repairNode(node.id);
                      }}
                      className="text-xs px-3 py-1"
                    >
                      Repair
                    </RealisticButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedNode && (
          <div className="mt-6 p-4 bg-black border border-neutral-700">
            <div className="flex justify-between items-center mb-4">
              <RealisticText variant="subtitle" className="text-neutral-100">
                {selectedNode.name} - Node Details
              </RealisticText>
              <RealisticButton 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedNode(null)}
              >
                Close
              </RealisticButton>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-neutral-400 mb-1">Connected Nodes:</div>
                <div className="text-neutral-100 space-y-1">
                  {selectedNode.connections.map(conn => (
                    <div key={conn} className="font-mono">{conn}</div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-neutral-400 mb-1">Technical Specs:</div>
                <div className="text-neutral-100 space-y-1">
                  <div>Type: {selectedNode.type.toUpperCase()}</div>
                  <div>Encryption: {selectedNode.encryption}</div>
                  <div>Range: {selectedNode.range}m</div>
                  <div>Location: {selectedNode.location}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-neutral-900 border border-neutral-700">
          <RealisticText variant="caption" className="text-neutral-400 leading-relaxed">
            Mesh network protocols enable decentralized communication independent of traditional infrastructure. 
            Each node acts as both client and relay, creating redundant pathways for critical data transmission 
            including blockchain transactions, strategic communications, and real-time coordination.
          </RealisticText>
        </div>
      </RealisticWastelandCard>
    </div>
  );
};