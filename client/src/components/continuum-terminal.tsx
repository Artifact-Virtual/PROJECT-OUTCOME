import { useState, useEffect, useRef } from 'react';
import { 
  RealisticWastelandCard,
  RealisticText,
  RealisticButton
} from "@/components/realistic-wasteland";

const OCSH_PROTOCOLS_GUIDE = `
================================================================================
                        OCSH PROTOCOL TRANSMISSION
                    ON-CHAIN SURVIVAL HANDBOOK v3.7.2
                         CLASSIFIED: EYES ONLY
================================================================================

> INITIALIZING OFFLINE BLOCKCHAIN PROTOCOLS...
> LOADING TRANSMISSION MODULES... [████████████████████] 100%
> DECRYPTING PROTOCOL ARCHIVE... COMPLETE
> ESTABLISHING SECURE CHANNEL... READY

================================================================================
                           PROTOCOL INDEX
================================================================================

[01] BONE NET - Mesh Networking Protocol
[02] RADIO BURST - Emergency Broadcast System  
[03] SATELLITE LINK - High-Orbit Relay Network
[04] USB SNEAKERNET - Physical Data Transport
[05] HAM RADIO - Low-Frequency Voice Communications
[06] SMS GATEWAY - Cellular Backup Channel
[07] DEAD DROP - Physical Data Caches
[08] COURIER PROTOCOL - Human-Based Transaction Relay
[09] MESH RELAY - Decentralized Node Network
[10] BURST TRANSMISSION - High-Speed Data Packets

================================================================================
                        [01] BONE NET PROTOCOL
================================================================================

CLASSIFICATION: OPERATIONAL
FREQUENCY: 2.4GHz - 5.8GHz
RANGE: 50m - 5km (dependent on terrain)
POWER CONSUMPTION: LOW

DESCRIPTION:
Bone Net establishes a peer-to-peer mesh network using modified WiFi hardware.
Each node acts as both client and relay, creating redundant pathways for data
transmission. Protocol automatically routes around failed nodes and adapts to
changing network topology in real-time.

IMPLEMENTATION:
- Modified router firmware with mesh capabilities
- Encrypted packet routing using onion-style layering
- Automatic neighbor discovery and path optimization
- Fallback to lower-power modes during battery operation

BLOCKCHAIN INTEGRATION:
- Transaction broadcasting across mesh nodes
- Distributed consensus without internet dependency
- Local validation and block propagation
- Emergency hard fork coordination

TACTICAL DEPLOYMENT:
Urban environments: Building-to-building relay chains
Rural areas: Hilltop repeater stations with solar power
Mobile operations: Vehicle-mounted nodes with directional antennas

================================================================================
                    [02] RADIO BURST PROTOCOL
================================================================================

CLASSIFICATION: OPERATIONAL
FREQUENCY: 430-440 MHz (Amateur Radio)
TRANSMISSION POWER: 5-50 Watts
RANGE: 20-200km (dependent on propagation)

DESCRIPTION:
Radio Burst enables emergency blockchain transaction broadcasting using amateur
radio frequencies. Transactions are encoded into digital bursts and transmitted
at predetermined intervals to maintain network synchronization.

ENCODING SPECIFICATIONS:
- Base64 transaction encoding with error correction
- 1200 baud AFSK (Audio Frequency Shift Keying)
- Automatic repeat request (ARQ) for reliability
- Time-synchronized transmission windows

NETWORK TOPOLOGY:
Primary repeaters on mountain peaks and tall structures
Secondary nodes in population centers
Mobile units for field operations
Emergency beacons for disaster scenarios

LEGAL COMPLIANCE:
Operates within amateur radio license requirements
Emergency traffic prioritization protocols
International frequency coordination
FCC Part 97 compliant operation

================================================================================
                    [03] SATELLITE LINK PROTOCOL
================================================================================

CLASSIFICATION: DEGRADED
ORBIT: Low Earth Orbit (LEO) 400-1200km
LATENCY: 50-300ms
BANDWIDTH: Variable (weather dependent)

DESCRIPTION:
Satellite Link Protocol utilizes Low Earth Orbit satellites for global
blockchain transaction relay. Current operational status is degraded due to
atmospheric interference and orbital debris.

SATELLITE CONSTELLATION:
Primary: 12 operational satellites in polar orbit
Secondary: 8 satellites in equatorial orbit
Ground stations: 47 worldwide tracking facilities
Mobile terminals: Portable dish systems

TRANSMISSION PROTOCOL:
Uplink: 14.0-14.5 GHz (Ku-band)
Downlink: 11.7-12.2 GHz (Ku-band)
Error correction: Reed-Solomon with interleaving
Encryption: AES-256 with rotating keys

CURRENT ISSUES:
Solar interference affecting equatorial satellites
Debris impact damage to 3 primary satellites
Ground station power grid instabilities
Weather-related signal degradation

================================================================================
                    [04] USB SNEAKERNET PROTOCOL
================================================================================

CLASSIFICATION: OPERATIONAL
CAPACITY: 32GB - 2TB per transport
SECURITY: Hardware encryption mandatory
TRANSPORT TIME: Variable (human courier dependent)

DESCRIPTION:
USB Sneakernet provides secure physical transport of blockchain data using
encrypted storage devices. Human couriers carry validated transaction blocks
between network segments that lack digital connectivity.

DEVICE SPECIFICATIONS:
Military-grade encrypted USB drives
Tamper-evident hardware security modules
GPS tracking for high-value transfers
Self-destruct capability for compromised units

COURIER PROTOCOLS:
Dual-custody verification at pickup/delivery
Cryptographic chain of custody records
Emergency dead-drop procedures
Counter-surveillance training mandatory

DATA STRUCTURE:
Compressed blockchain segments with full validation
Recent transaction pools for immediate broadcast
Emergency governance proposals
Network topology updates

================================================================================
                    [05] HAM RADIO PROTOCOL
================================================================================

CLASSIFICATION: OPERATIONAL
FREQUENCY: 3.5-29.7 MHz (HF bands)
POWER: 100 Watts maximum
RANGE: Global (via ionospheric propagation)

DESCRIPTION:
Ham Radio Protocol enables voice coordination and emergency messaging between
blockchain network operators. Provides human-readable status updates and
coordination for technical operations.

FREQUENCY ALLOCATION:
Emergency coordination: 14.300 MHz
Daily check-ins: 7.235 MHz (LSB)
Technical discussions: 21.350 MHz (USB)
Digital modes: 14.070 MHz (PSK31)

OPERATING PROCEDURES:
Daily nets at 1200Z and 0000Z
Emergency activation protocols
Silent key procedures for compromised operators
Backup frequency coordination

INTEGRATION WITH DIGITAL:
Voice instructions for manual blockchain operations
Coordination of courier and mesh network deployments
Weather and propagation reports
Security status updates

================================================================================
                    [06] SMS GATEWAY PROTOCOL
================================================================================

CLASSIFICATION: OFFLINE
NETWORK: Cellular (when available)
MESSAGE LENGTH: 160 characters maximum
ENCRYPTION: Basic XOR with key rotation

DESCRIPTION:
SMS Gateway Protocol uses cellular text messaging as a backup communication
channel for critical blockchain operations. Currently offline due to cellular
network infrastructure degradation.

MESSAGE FORMATS:
Transaction alerts: TX:hash:amount:timestamp
Status updates: STATUS:node:online:blockheight
Emergency codes: EMERGENCY:type:location:severity

LIMITATIONS:
Dependent on cellular tower functionality
Limited message length restricts data throughput
Vulnerable to network monitoring
No guarantee of delivery timing

RESTORATION REQUIREMENTS:
Cellular network infrastructure repair
Power grid stabilization for tower operations
Replacement of damaged switching equipment
Security audit of compromised systems

================================================================================
                    [07] DEAD DROP PROTOCOL
================================================================================

CLASSIFICATION: OPERATIONAL
LOCATIONS: 47 established caches worldwide
CAPACITY: 10-500GB per location
ACCESS: Biometric and cryptographic locks

DESCRIPTION:
Dead Drop Protocol establishes physical caches containing blockchain data,
software, and hardware for emergency network reconstruction. Locations are
secured with multiple authentication layers and environmental protection.

CACHE CONTENTS:
Complete blockchain historical data
Node software and configuration files
Cryptographic key backups
Emergency communication equipment
Solar charging systems and spare batteries

SECURITY MEASURES:
Multi-factor authentication required
Motion sensors and intrusion detection
Geographic distribution for redundancy
Regular maintenance and verification cycles

ACCESS PROCEDURES:
Biometric scan (fingerprint + retinal)
Cryptographic challenge-response
Emergency override codes (limited use)
Tamper detection and response protocols

================================================================================
                    [08] COURIER PROTOCOL
================================================================================

CLASSIFICATION: OPERATIONAL
PERSONNEL: 127 active couriers worldwide
TRAINING: Advanced operational security
EQUIPMENT: Encrypted communication devices

DESCRIPTION:
Courier Protocol employs trained human operatives to transport critical
blockchain data and coordinate network operations across disconnected regions.
Couriers maintain operational security while ensuring data integrity.

COURIER QUALIFICATIONS:
Advanced cryptography training
Counter-surveillance operations
Physical fitness requirements
Psychological evaluation clearance

MISSION TYPES:
Transaction block transport between network segments
Hardware deployment to remote locations
Emergency response and network repair
Intelligence gathering on network threats

COMMUNICATION:
Encrypted satellite messaging
Ham radio check-ins at scheduled intervals
Emergency beacon activation
Dead drop coordination and maintenance

================================================================================
                    [09] MESH RELAY PROTOCOL
================================================================================

CLASSIFICATION: OPERATIONAL
NODES: 2,847 active worldwide
REDUNDANCY: Triple-path minimum
LATENCY: 50-500ms depending on hops

DESCRIPTION:
Mesh Relay Protocol creates a self-healing network of interconnected nodes
that automatically route blockchain data around damaged or compromised
segments. Each node validates and forwards transactions while maintaining
network topology awareness.

NODE SPECIFICATIONS:
Raspberry Pi 4 or equivalent hardware
LoRa radio modules for long-range communication
Solar power with battery backup
Weatherproof enclosures for outdoor deployment

ROUTING ALGORITHM:
Distance-vector routing with loop prevention
Quality-of-service metrics for path selection
Automatic load balancing across available paths
Congestion detection and alternative routing

NETWORK RESILIENCE:
Minimum 3 independent paths to any destination
Automatic node discovery and topology updates
Failed node detection and route recalculation
Emergency partition tolerance and reconnection

================================================================================
                   [10] BURST TRANSMISSION PROTOCOL
================================================================================

CLASSIFICATION: OPERATIONAL
FREQUENCY: 902-928 MHz (ISM band)
DATA RATE: 250 kbps maximum
RANGE: 1-10km (line of sight)

DESCRIPTION:
Burst Transmission Protocol enables high-speed transfer of blockchain data
during brief communication windows. Optimized for mobile platforms and
environments with intermittent connectivity.

TECHNICAL SPECIFICATIONS:
LoRa modulation with adaptive data rates
Forward error correction for reliability
Time-synchronized transmission windows
Automatic frequency hopping for interference avoidance

BURST SCHEDULING:
Predetermined time slots for network synchronization
Priority queuing for critical transactions
Collision avoidance using CSMA/CA
Emergency override for urgent communications

MOBILE INTEGRATION:
Vehicle-mounted systems for mobile operations
Portable units for field deployment
Aircraft and drone relay capabilities
Maritime vessel integration for ocean coverage

================================================================================
                            EMERGENCY PROCEDURES
================================================================================

NETWORK FAILURE RESPONSE:
1. Activate all backup communication protocols
2. Deploy courier teams to critical network segments
3. Establish ham radio coordination nets
4. Begin dead drop activation sequence

SECURITY BREACH PROTOCOL:
1. Isolate compromised network segments
2. Rotate all cryptographic keys
3. Activate counter-surveillance procedures
4. Implement emergency authentication protocols

INFRASTRUCTURE RESTORATION:
1. Assess damage to communication infrastructure
2. Deploy mobile relay stations to restore connectivity
3. Coordinate with courier teams for equipment transport
4. Re-establish primary communication channels

================================================================================
                              CONCLUSION
================================================================================

The OCSH Protocol Suite provides comprehensive offline blockchain operation
capabilities designed to maintain network functionality in degraded
communication environments. Regular training and equipment maintenance are
essential for operational readiness.

All personnel must maintain current certifications in relevant protocols and
participate in quarterly network exercises. Remember: The blockchain survives
not through dependency on centralized infrastructure, but through the
resilience and dedication of its human operators.

As long as data can be transferred, value can be transferred.
As long as humans persist, the network persists.

> TRANSMISSION COMPLETE
> SECURE CHANNEL CLOSED
> PROTOCOL ARCHIVE LOCKED

END OF TRANSMISSION
================================================================================
`;

interface ContinuumTerminalProps {
  className?: string;
}

export const ContinuumTerminal = ({ className = "" }: ContinuumTerminalProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isCommandMode, setIsCommandMode] = useState(true);

  const typeText = () => {
    if (currentIndex < OCSH_PROTOCOLS_GUIDE.length) {
      setDisplayedText(OCSH_PROTOCOLS_GUIDE.substring(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(typeText, 10); // Fast typing speed
      return () => clearTimeout(timer);
    }
  }, [isTyping, currentIndex]);

  useEffect(() => {
    if (terminalRef.current && isTyping) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedText]);

  const startTransmission = () => {
    setIsCommandMode(false);
    setIsTyping(true);
    setCurrentIndex(0);
    setDisplayedText("");
  };

  const resetTerminal = () => {
    setIsCommandMode(true);
    setIsTyping(false);
    setCurrentIndex(0);
    setDisplayedText("");
  };

  const skipToEnd = () => {
    setDisplayedText(OCSH_PROTOCOLS_GUIDE);
    setIsTyping(false);
    setCurrentIndex(OCSH_PROTOCOLS_GUIDE.length);
  };

  if (isCommandMode) {
    return (
      <div className={`space-y-6 ${className}`}>
        <RealisticWastelandCard variant="dark" className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-neutral-800 border border-neutral-600 flex items-center justify-center">
              <span className="text-lg text-neutral-400">📡</span>
            </div>
            <div>
              <RealisticText variant="title" className="text-neutral-100">
                OCSH Protocol Archives
              </RealisticText>
              <RealisticText variant="caption" className="text-neutral-500">
                Classified: Offline Blockchain Protocols
              </RealisticText>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-neutral-800 p-4 border border-neutral-700">
              <RealisticText variant="caption" className="text-amber-400">BONE NET</RealisticText>
              <p className="text-xs text-neutral-400 mt-1">Mesh networking protocol</p>
            </div>
            <div className="bg-neutral-800 p-4 border border-neutral-700">
              <RealisticText variant="caption" className="text-amber-400">RADIO BURST</RealisticText>
              <p className="text-xs text-neutral-400 mt-1">Emergency broadcast system</p>
            </div>
            <div className="bg-neutral-800 p-4 border border-neutral-700">
              <RealisticText variant="caption" className="text-amber-400">SATELLITE LINK</RealisticText>
              <p className="text-xs text-neutral-400 mt-1">High-orbit relay network</p>
            </div>
            <div className="bg-neutral-800 p-4 border border-neutral-700">
              <RealisticText variant="caption" className="text-amber-400">USB SNEAKERNET</RealisticText>
              <p className="text-xs text-neutral-400 mt-1">Physical data transport</p>
            </div>
            <div className="bg-neutral-800 p-4 border border-neutral-700">
              <RealisticText variant="caption" className="text-amber-400">HAM RADIO</RealisticText>
              <p className="text-xs text-neutral-400 mt-1">Low-frequency voice comms</p>
            </div>
            <div className="bg-neutral-800 p-4 border border-neutral-700">
              <RealisticText variant="caption" className="text-red-400">SMS GATEWAY</RealisticText>
              <p className="text-xs text-neutral-400 mt-1">Cellular backup (OFFLINE)</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-black border border-neutral-700 font-mono text-xs">
              <div className="text-emerald-400 mb-2">TERMINAL READY</div>
              <div className="text-neutral-400">
                {'>'} Type 'continuum' to display complete protocol transmission
              </div>
              <div className="text-neutral-600 mt-1">
                {'>'} Command: <span className="text-amber-400 animate-pulse">_</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <RealisticButton 
                variant="primary" 
                onClick={startTransmission}
                className="flex-1"
              >
                Execute: continuum
              </RealisticButton>
              <RealisticButton 
                variant="ghost" 
                onClick={() => {}}
                className="flex-1"
              >
                Network Status
              </RealisticButton>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-neutral-900 border border-neutral-700">
            <RealisticText variant="caption" className="text-neutral-400 leading-relaxed">
              The true essence of blockchain is independent of the internet. If one route fails, 
              a resilient network seeks another path. As long as data can be transferred, value can be transferred.
            </RealisticText>
          </div>
        </RealisticWastelandCard>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <RealisticWastelandCard variant="dark" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-800 border border-neutral-600 flex items-center justify-center">
              <span className="text-sm text-neutral-400">📡</span>
            </div>
            <div>
              <RealisticText variant="subtitle" className="text-neutral-100">
                OCSH Protocol Transmission
              </RealisticText>
              <RealisticText variant="caption" className="text-neutral-500">
                {isTyping ? 'Broadcasting...' : 'Transmission Complete'}
              </RealisticText>
            </div>
          </div>
          <div className="flex gap-2">
            {isTyping && (
              <RealisticButton variant="ghost" size="sm" onClick={skipToEnd}>
                Skip to End
              </RealisticButton>
            )}
            <RealisticButton variant="ghost" size="sm" onClick={resetTerminal}>
              Reset Terminal
            </RealisticButton>
          </div>
        </div>
        
        <div 
          ref={terminalRef}
          className="h-96 bg-black border border-neutral-700 p-4 overflow-y-auto font-mono text-xs text-neutral-300 leading-relaxed"
        >
          <pre className="whitespace-pre-wrap">
            {displayedText}
            {isTyping && <span className="text-amber-400 animate-pulse">█</span>}
          </pre>
        </div>
        
        {!isTyping && displayedText && (
          <div className="mt-4 flex justify-center">
            <RealisticButton variant="primary" onClick={resetTerminal}>
              Return to Command Interface
            </RealisticButton>
          </div>
        )}
      </RealisticWastelandCard>
    </div>
  );
};