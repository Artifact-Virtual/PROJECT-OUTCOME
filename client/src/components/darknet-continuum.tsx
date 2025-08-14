import { useState } from "react";
import { WastelandText, WastelandCard, WastelandButton } from "./wasteland-ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const CONTINUUM_DATA = {
  title: "ON-CHAIN RESILIENCE FIELD MANUAL",
  subtitle: "DARKNET CONTINUUM PROTOCOLS",
  protocols: [
    {
      id: "PRTCL1",
      name: "BONE NET (BONET)",
      category: "Mesh Networking",
      description: "Create a decentralized, peer-to-peer network where devices connect directly to each other. Transactions are passed from device to device like whispers through a crowd. This method is slower but highly effective for moving signed transactions without a central internet connection."
    },
    {
      id: "PRTCL2", 
      name: "SIGNAL SCRIPT",
      category: "SMS Transactions",
      description: "Utilize existing cellular towers for basic communication. Transactions can be sent via plain-text SMS, containing a simple command, wallet address, and signature. This method requires no apps or browsers, relying only on a cell signal and a keypad."
    },
    {
      id: "PRTCL3",
      name: "PHYSICAL HANDSHAKE (LEDGER)",
      category: "Offline Hardware Transfer", 
      description: "Employ a physical-delivery method for transactions. One person signs a transaction, and another person physically carries the data to a location with an internet connection to broadcast it. This method turns transaction delivery into a form of spycraft."
    },
    {
      id: "PRTCL4",
      name: "DATA RELIC",
      category: "USB Sneakernet",
      description: "Use a portable storage device as the data carrier. A signed transaction file is saved to a USB stick, physically moved to a device that has network access, and then broadcast to the blockchain."
    },
    {
      id: "PRTCL5",
      name: "STATIC HAUL (LONG & SHORT)",
      category: "Ham Radio Blockchain",
      description: "Harness the power of amateur radio. If ham radio can transmit emails over long distances, it can transmit blockchain data, offering a resilient, cross-border method of communication that is immune to physical infrastructure cuts."
    },
    {
      id: "PRTCL6",
      name: "GHOST MODE", 
      category: "Radio Broadcast",
      description: "Leverage radio broadcasts to transmit transactions. A signed, compressed data packet is converted into radio waves and broadcast over the air. Anyone with the right receiver can capture, decode, and inject the transaction into the network, bypassing routers and DNS entirely."
    },
    {
      id: "PRTCL7",
      name: "SKYCHAIN RELAY",
      category: "Satellite Link",
      description: "Broadcast transactions directly into space using a satellite dish. The satellite then relays the data back down to a receiving station connected to the blockchain network, completely bypassing all terrestrial infrastructure."
    }
  ],
  coreDoctrine: "The true essence of blockchain is independent of the internet; instead, the internet serves as a useful transport layer. If one route fails, a resilient network seeks another path. As long as data can be transferred, value can be transferred."
};

export const DarknetContinuumRelic = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Relic Header */}
      <WastelandCard variant="terminal" className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ash-gray/10 to-charred-earth/15" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-ash-gray/30 border-2 border-ash-gray rounded flex items-center justify-center">
              <span className="text-2xl opacity-70">📡</span>
            </div>
            <div>
              <WastelandText variant="title" className="text-2xl text-ash-gray">
                DIGITAL RELIC RECOVERED
              </WastelandText>
              <WastelandText variant="terminal" className="text-ash-gray/70">
                CLEARANCE LEVEL: OMEGA
              </WastelandText>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-charred-earth border border-ash-gray p-3">
              <div className="text-burnt-amber font-bold">ORIGIN</div>
              <div className="text-ash-gray">PRE-COLLAPSE ARCHIVES</div>
            </div>
            <div className="bg-charred-earth border border-ash-gray p-3">
              <div className="text-burnt-amber font-bold">STATUS</div>
              <div className="text-ash-gray">DECLASSIFIED</div>
            </div>
            <div className="bg-charred-earth border border-ash-gray p-3">
              <div className="text-burnt-amber font-bold">PROTOCOLS</div>
              <div className="text-ash-gray">7 ACTIVE</div>
            </div>
          </div>
        </div>
      </WastelandCard>

      {/* Manual Content */}
      <WastelandCard variant="default" className="p-6">
        <WastelandText variant="title" className="text-3xl mb-2 text-center border-b-2 border-ash-gray pb-4">
          {CONTINUUM_DATA.title}
        </WastelandText>
        <WastelandText variant="subtitle" className="text-lg text-center text-ash-gray/70 mb-6">
          {CONTINUUM_DATA.subtitle}
        </WastelandText>

        <WastelandText variant="body" className="mb-8 text-ash-gray leading-relaxed">
          In the evolving digital economy, reliance on the traditional internet infrastructure poses risks. 
          In cases of power outages, cable damage, or grid failures, blockchain networks can endure by finding 
          alternative data transmission routes. This guide provides protocols to maintain transaction flow, 
          even when conventional networks fail.
        </WastelandText>

        {/* Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {CONTINUUM_DATA.protocols.map((protocol, index) => (
            <div
              key={protocol.id}
              className={`p-4 border-2 cursor-pointer transition-all duration-300 ${
                selectedProtocol === index
                  ? 'border-burnt-amber bg-charred-earth border-opacity-80'
                  : 'border-ash-gray bg-charred-earth hover:border-ash-gray hover:border-opacity-80'
              }`}
              onClick={() => setSelectedProtocol(selectedProtocol === index ? null : index)}
            >
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-wasteland-orange text-dark-wasteland font-mono text-xs">
                  {protocol.id}
                </Badge>
                <WastelandText variant="subtitle" className="text-sm">
                  {protocol.name}
                </WastelandText>
              </div>
              
              <WastelandText variant="terminal" className="text-xs text-steel-blue mb-2">
                {protocol.category}
              </WastelandText>
              
              {selectedProtocol === index && (
                <WastelandText variant="body" className="text-sm text-ash-gray leading-relaxed">
                  {protocol.description}
                </WastelandText>
              )}
            </div>
          ))}
        </div>

        {/* Core Doctrine */}
        <WastelandCard variant="default" className="p-6 border-2 border-ash-gray bg-charred-earth">
          <WastelandText variant="subtitle" className="mb-4 text-burnt-amber border-b border-ash-gray pb-2">
            CORE DOCTRINE
          </WastelandText>
          <WastelandText variant="body" className="text-ash-gray leading-relaxed">
            {CONTINUUM_DATA.coreDoctrine}
          </WastelandText>
        </WastelandCard>
      </WastelandCard>
    </div>
  );
};

// Terminal typewriter effect for PWA
export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = () => {
    setIsTyping(true);
    setDisplayedText('');
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  };

  return { displayedText, isTyping, startTyping };
};

export const getContinuumText = () => {
  return `
╔══════════════════════════════════════════════════════════════════╗
║                  ON-CHAIN RESILIENCE FIELD MANUAL               ║
║                     DARKNET CONTINUUM PROTOCOLS                 ║
╚══════════════════════════════════════════════════════════════════╝

CLASSIFICATION: OMEGA CLEARANCE
STATUS: DECLASSIFIED FOR FIELD OPERATIONS

In the evolving digital economy, reliance on traditional internet 
infrastructure poses critical risks. When power grids fail, cables 
are severed, or networks are compromised, blockchain networks must 
endure by finding alternative data transmission routes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROTOCOL 1: BONE NET (BONET)
└─ Mesh Networking
   Create decentralized, peer-to-peer networks where devices connect
   directly. Transactions pass device-to-device like whispers through
   a crowd. Slower but highly effective for moving signed transactions
   without central internet infrastructure.

PROTOCOL 2: SIGNAL SCRIPT  
└─ SMS Transactions
   Utilize cellular towers for basic communication. Transactions sent
   via plain-text SMS containing simple commands, wallet addresses,
   and signatures. Requires only cell signal and keypad - no apps.

PROTOCOL 3: PHYSICAL HANDSHAKE (LEDGER)
└─ Offline Hardware Transfer
   Physical-delivery method for transactions. One person signs, another
   physically carries data to internet-connected location for broadcast.
   Transforms transaction delivery into digital spycraft.

PROTOCOL 4: DATA RELIC
└─ USB Sneakernet  
   Portable storage as data carrier. Signed transaction files saved to
   USB stick, physically moved to networked device, then broadcast to
   blockchain. Ancient but effective.

PROTOCOL 5: STATIC HAUL (LONG & SHORT)
└─ Ham Radio Blockchain
   Harness amateur radio power. If ham radio transmits emails across
   vast distances, it can transmit blockchain data - resilient, 
   cross-border, immune to physical infrastructure cuts.

PROTOCOL 6: GHOST MODE
└─ Radio Broadcast
   Leverage radio broadcasts to transmit transactions. Signed, compressed
   data packets converted to radio waves and broadcast over air. Any
   receiver can capture, decode, and inject into network.

PROTOCOL 7: SKYCHAIN RELAY  
└─ Satellite Link
   Broadcast transactions directly into space using satellite dish.
   Satellite relays data back to receiving station connected to blockchain
   network, completely bypassing terrestrial infrastructure.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORE DOCTRINE:
The true essence of blockchain is independent of the internet.
The internet serves merely as a useful transport layer.
If one route fails, a resilient network seeks another path.
As long as data can be transferred, value can be transferred.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REMEMBER: In the wasteland, adaptation is survival.
The blockchain endures. The network finds a way.

END TRANSMISSION
`;
};