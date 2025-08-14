import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RealisticWastelandCard, RealisticText, RealisticButton } from "@/components/realistic-wasteland";
import { getContinuumText } from "@/components/darknet-continuum";

export default function RealisticHandheld() {
  const [isBooted, setIsBooted] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const terminalRef = useRef<HTMLDivElement>(null);

  // Responsive screen tracking
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    window.addEventListener('orientationchange', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
      window.removeEventListener('orientationchange', updateScreenSize);
    };
  }, []);

  useEffect(() => {
    const bootSequence = [
      'BLOKBOY 1000 INITIALIZING...',
      'HARDWARE CHECK: OK',
      'RADIO MODULE: ACTIVE',
      'MESH PROTOCOL: READY',
      'BLOCKCHAIN INTERFACE: CONNECTED',
      'OCSH PROTOCOLS: LOADED',
      '',
      'Type "help" for available commands.',
      'Type "continuum" for OCSH protocols.',
      ''
    ];
    
    setTimeout(() => {
      setTerminalLines(bootSequence);
      setIsBooted(true);
    }, 1500);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const typewriter = (text: string, callback?: () => void) => {
    const lines = text.split('\n');
    let lineIndex = 0;
    
    const typeLine = () => {
      if (lineIndex < lines.length) {
        setTerminalLines(prev => [...prev, lines[lineIndex]]);
        lineIndex++;
        setTimeout(typeLine, 30);
      } else if (callback) {
        callback();
      }
    };
    
    typeLine();
  };

  const handleCommand = (command: string) => {
    setIsProcessing(true);
    setTerminalLines(prev => [...prev, `> ${command}`, '']);
    
    setTimeout(() => {
      let response: string[] = [];
      
      switch (command.toLowerCase().trim()) {
        case 'continuum':
          const continuumText = getContinuumText();
          typewriter(continuumText, () => {
            setIsProcessing(false);
          });
          return;
        case 'help':
          response = [
            'AVAILABLE COMMANDS:',
            '==================',
            'help          - Show this help menu',
            'status        - Display system status', 
            'scan          - Scan for nearby signals',
            'encode        - Encode blockchain transaction',
            'decode        - Decode received transmission',
            'broadcast     - Send transaction via radio',
            'wallet        - View wallet information',
            'continuum     - Access OCSH protocols',
            'clear         - Clear terminal screen',
            'exit          - Return to main interface',
            ''
          ];
          break;
        case 'status':
          response = [
            'SYSTEM STATUS:',
            '=============',
            'Device: BLOKBOY 1000',
            'Radio: OPERATIONAL',
            'Mesh: 3 nodes connected',
            'Battery: 87%',
            'Network: Base (8453)',
            'Signal: STRONG',
            ''
          ];
          break;
        case 'scan':
          response = [
            'Scanning radio frequencies...',
            '',
            'Found 3 active nodes:',
            '- Node Alpha: 127.0.0.1:8545 (STRONG)',
            '- Node Bravo: 192.168.1.100 (WEAK)',  
            '- Node Charlie: MESH_ID_7394 (MEDIUM)',
            '',
            'Ready to relay transactions.',
            ''
          ];
          break;
        case 'wallet':
          response = [
            'WALLET STATUS:',
            '=============',
            'Address: 0x742d...35Bc',
            'Balance: 0.025 ETH',
            'Network: Base (Chain ID: 8453)',
            'Nonce: 42',
            'Gas Price: 12 gwei',
            ''
          ];
          break;
        case 'clear':
          setTerminalLines(['Terminal cleared.', '']);
          setIsProcessing(false);
          return;
        case 'exit':
          response = ['Exiting terminal mode...'];
          break;
        default:
          response = [`Unknown command: ${command}`, 'Type "help" for available commands.', ''];
      }
      
      setTerminalLines(prev => [...prev, ...response]);
      setIsProcessing(false);
    }, 800 + Math.random() * 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isProcessing) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  // Calculate responsive dimensions
  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const terminalHeight = isMobile ? 'h-64' : isTablet ? 'h-80' : 'h-96';
  const headerPadding = isMobile ? 'px-4 py-3' : 'px-6 py-4';
  const containerPadding = isMobile ? 'px-4 py-4' : 'px-6 py-8';

  return (
    <div className="min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      {/* Terminal Header - Fully Responsive */}
      <header className="border-b border-neutral-800 bg-neutral-900 sticky top-0 z-40">
        <div className={`container mx-auto ${headerPadding}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-neutral-800 border border-neutral-700 p-1.5 md:p-2`}>
                <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-base md:text-lg">
                  📱
                </div>
              </div>
              <div>
                <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-neutral-100 font-mono tracking-tight`}>
                  BLOKBOY 1000
                </h1>
                <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-neutral-500 uppercase tracking-wider`}>
                  Handheld Transaction Terminal
                </p>
              </div>
            </div>
            <Link href="/">
              <RealisticButton variant="secondary" size={isMobile ? "sm" : "sm"}>
                {isMobile ? '←' : '← Return to Dashboard'}
              </RealisticButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Terminal Interface - Fully Responsive */}
      <main className={`container mx-auto ${containerPadding}`}>
        <Tabs defaultValue="terminal" className="w-full">
          <TabsList className={`grid w-full grid-cols-4 bg-neutral-900 border border-neutral-800 ${isMobile ? 'h-9' : 'h-10'}`}>
            <TabsTrigger value="terminal" className={`${isMobile ? 'text-xs' : 'text-xs'} font-mono uppercase data-[state=active]:bg-neutral-700`}>
              {isMobile ? 'Term' : 'Terminal'}
            </TabsTrigger>
            <TabsTrigger value="encoder" className={`${isMobile ? 'text-xs' : 'text-xs'} font-mono uppercase data-[state=active]:bg-neutral-700`}>
              {isMobile ? 'Enc' : 'Encoder'}
            </TabsTrigger>
            <TabsTrigger value="decoder" className={`${isMobile ? 'text-xs' : 'text-xs'} font-mono uppercase data-[state=active]:bg-neutral-700`}>
              {isMobile ? 'Dec' : 'Decoder'}
            </TabsTrigger>
            <TabsTrigger value="status" className={`${isMobile ? 'text-xs' : 'text-xs'} font-mono uppercase data-[state=active]:bg-neutral-700`}>
              Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terminal" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
            <RealisticWastelandCard variant="dark" className="p-0 overflow-hidden">
              <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-neutral-800`}>
                <RealisticText variant="terminal" className="text-neutral-500">
                  Terminal Session Active
                </RealisticText>
              </div>
              
              <div 
                ref={terminalRef}
                className={`${terminalHeight} overflow-y-auto ${isMobile ? 'p-3' : 'p-4'} bg-black font-mono ${isMobile ? 'text-xs' : 'text-sm'} text-neutral-300 leading-relaxed`}
                style={{
                  maxHeight: isMobile ? `${screenSize.height * 0.4}px` : undefined
                }}
              >
                {!isBooted ? (
                  <div className="text-neutral-500">Booting system...</div>
                ) : (
                  terminalLines.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {line}
                    </div>
                  ))
                )}
                {isProcessing && (
                  <div className="text-neutral-500">Processing...</div>
                )}
              </div>
              
              {isBooted && (
                <form onSubmit={handleSubmit} className={`${isMobile ? 'p-3' : 'p-4'} border-t border-neutral-800`}>
                  <div className="flex gap-2">
                    <span className={`text-neutral-500 font-mono ${isMobile ? 'text-xs' : 'text-sm'}`}>{'>'}</span>
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      className={`flex-1 bg-transparent border-none text-neutral-100 font-mono focus:ring-0 p-0 ${isMobile ? 'text-xs' : 'text-sm'}`}
                      placeholder="Enter command..."
                      disabled={isProcessing}
                      autoFocus
                    />
                  </div>
                </form>
              )}
            </RealisticWastelandCard>
          </TabsContent>

          <TabsContent value="encoder" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
            <TransactionEncoder isMobile={isMobile} />
          </TabsContent>

          <TabsContent value="decoder" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
            <TransactionDecoder isMobile={isMobile} />
          </TabsContent>

          <TabsContent value="status" className={`${isMobile ? 'mt-4' : 'mt-6'}`}>
            <SystemStatus isMobile={isMobile} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Transaction Encoder Component
const TransactionEncoder = ({ isMobile }: { isMobile: boolean }) => {
  const [transactionData, setTransactionData] = useState('');
  const [encodedFrame, setEncodedFrame] = useState('');
  const [isEncoding, setIsEncoding] = useState(false);

  const handleEncode = () => {
    setIsEncoding(true);
    setTimeout(() => {
      const mockFrame = `FRAME_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setEncodedFrame(mockFrame);
      setIsEncoding(false);
    }, 2000);
  };

  return (
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
      <RealisticWastelandCard variant="default" className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <RealisticText variant="subtitle" className="mb-4">Transaction Input</RealisticText>
        <div className="space-y-4">
          <Textarea
            value={transactionData}
            onChange={(e) => setTransactionData(e.target.value)}
            placeholder="Paste raw transaction data here..."
            className={`${isMobile ? 'h-32' : 'h-48'} bg-neutral-900 border-neutral-700 text-neutral-100 font-mono ${isMobile ? 'text-xs' : 'text-sm'} resize-none`}
          />
          <RealisticButton
            onClick={handleEncode}
            disabled={!transactionData.trim() || isEncoding}
            variant="primary"
            className="w-full"
            size={isMobile ? "sm" : "md"}
          >
            {isEncoding ? 'Encoding...' : 'Encode for Transmission'}
          </RealisticButton>
        </div>
      </RealisticWastelandCard>

      <RealisticWastelandCard variant="dark" className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <RealisticText variant="subtitle" className="mb-4">Encoded Frame</RealisticText>
        <div className="space-y-4">
          <div className={`${isMobile ? 'h-32' : 'h-48'} bg-black border border-neutral-700 ${isMobile ? 'p-3' : 'p-4'} font-mono ${isMobile ? 'text-xs' : 'text-sm'} text-neutral-300 overflow-auto`}>
            {encodedFrame ? (
              <div>
                <div className="text-amber-400 mb-2">TRANSMISSION READY:</div>
                <div className="break-all text-neutral-100">{encodedFrame}</div>
                <div className="mt-4 text-neutral-500 text-xs">
                  Frame contains error correction and mesh routing data
                </div>
              </div>
            ) : (
              <div className="text-neutral-600">Encoded frame will appear here...</div>
            )}
          </div>
          {encodedFrame && (
            <RealisticButton variant="danger" className="w-full" size={isMobile ? "sm" : "md"}>
              Broadcast via Radio
            </RealisticButton>
          )}
        </div>
      </RealisticWastelandCard>
    </div>
  );
};

// Transaction Decoder Component  
const TransactionDecoder = ({ isMobile }: { isMobile: boolean }) => {
  const [receivedFrame, setReceivedFrame] = useState('');
  const [decodedTransaction, setDecodedTransaction] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);

  const handleDecode = () => {
    setIsDecoding(true);
    setTimeout(() => {
      const mockTransaction = JSON.stringify({
        to: "0x742d35Cc6001C70532BA8A5c1eEA8B8832f71dF6",
        value: "0.025",
        gasLimit: "21000",
        gasPrice: "12000000000",
        nonce: 42
      }, null, 2);
      setDecodedTransaction(mockTransaction);
      setIsDecoding(false);
    }, 1500);
  };

  return (
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
      <RealisticWastelandCard variant="default" className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <RealisticText variant="subtitle" className="mb-4">Received Frame</RealisticText>
        <div className="space-y-4">
          <Textarea
            value={receivedFrame}
            onChange={(e) => setReceivedFrame(e.target.value)}
            placeholder="Paste received frame data here..."
            className={`${isMobile ? 'h-32' : 'h-48'} bg-neutral-900 border-neutral-700 text-neutral-100 font-mono ${isMobile ? 'text-xs' : 'text-sm'} resize-none`}
          />
          <RealisticButton
            onClick={handleDecode}
            disabled={!receivedFrame.trim() || isDecoding}
            variant="primary"
            className="w-full"
            size={isMobile ? "sm" : "md"}
          >
            {isDecoding ? 'Decoding...' : 'Decode Transaction'}
          </RealisticButton>
        </div>
      </RealisticWastelandCard>

      <RealisticWastelandCard variant="dark" className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <RealisticText variant="subtitle" className="mb-4">Decoded Transaction</RealisticText>
        <div className="space-y-4">
          <div className={`${isMobile ? 'h-32' : 'h-48'} bg-black border border-neutral-700 ${isMobile ? 'p-3' : 'p-4'} font-mono ${isMobile ? 'text-xs' : 'text-sm'} text-neutral-300 overflow-auto`}>
            {decodedTransaction ? (
              <pre className="text-neutral-100">{decodedTransaction}</pre>
            ) : (
              <div className="text-neutral-600">Decoded transaction will appear here...</div>
            )}
          </div>
          {decodedTransaction && (
            <RealisticButton variant="primary" className="w-full" size={isMobile ? "sm" : "md"}>
              Broadcast to Network
            </RealisticButton>
          )}
        </div>
      </RealisticWastelandCard>
    </div>
  );
};

// System Status Component
const SystemStatus = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
      <RealisticWastelandCard variant="default" className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <RealisticText variant="subtitle" className="mb-4">Device Status</RealisticText>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-400">Model</span>
            <span className="text-neutral-100 font-mono">AV Blokboy 1000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Battery</span>
            <span className="text-emerald-400">87%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Radio Module</span>
            <span className="text-emerald-400">OPERATIONAL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Mesh Network</span>
            <span className="text-emerald-400">CONNECTED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Signal Strength</span>
            <span className="text-emerald-400">STRONG</span>
          </div>
        </div>
      </RealisticWastelandCard>

      <RealisticWastelandCard variant="default" className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <RealisticText variant="subtitle" className="mb-4">Network Status</RealisticText>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-400">Network</span>
            <span className="text-neutral-100">Base (8453)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Connected Nodes</span>
            <span className="text-emerald-400">3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Transactions Queued</span>
            <span className="text-amber-400">2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Last Sync</span>
            <span className="text-neutral-100">12 seconds ago</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Status</span>
            <span className="text-emerald-400">SYNCHRONIZED</span>
          </div>
        </div>
      </RealisticWastelandCard>
    </div>
  );
};