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
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bootSequence = [
      'AV BLOKBOY 1000 INITIALIZING...',
      'HARDWARE CHECK: OK',
      'RADIO MODULE: ACTIVE',
      'MESH PROTOCOL: READY',
      'BLOCKCHAIN INTERFACE: CONNECTED',
      '',
      'Type "help" for available commands.',
      'Type "continuum" for offline protocols.',
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
            'continuum     - Access Darknet Continuum protocols',
            'clear         - Clear terminal screen',
            'exit          - Return to main interface',
            ''
          ];
          break;
        case 'status':
          response = [
            'SYSTEM STATUS:',
            '=============',
            'Device: AV Blokboy 1000',
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

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      {/* Terminal Header */}
      <header className="border-b border-neutral-800 bg-neutral-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 p-2">
                <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-lg">
                  📱
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-100 font-mono tracking-tight">
                  AV BLOKBOY 1000
                </h1>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">
                  Handheld Transaction Terminal
                </p>
              </div>
            </div>
            <Link href="/">
              <RealisticButton variant="secondary" size="sm">
                ← Return to Dashboard
              </RealisticButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Terminal Interface */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="terminal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-900 border border-neutral-800 h-10">
            <TabsTrigger value="terminal" className="text-xs font-mono uppercase data-[state=active]:bg-neutral-700">
              Terminal
            </TabsTrigger>
            <TabsTrigger value="encoder" className="text-xs font-mono uppercase data-[state=active]:bg-neutral-700">
              Encoder
            </TabsTrigger>
            <TabsTrigger value="decoder" className="text-xs font-mono uppercase data-[state=active]:bg-neutral-700">
              Decoder
            </TabsTrigger>
            <TabsTrigger value="status" className="text-xs font-mono uppercase data-[state=active]:bg-neutral-700">
              Status
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terminal" className="mt-6">
            <RealisticWastelandCard variant="dark" className="p-0 overflow-hidden">
              <div className="p-4 border-b border-neutral-800">
                <RealisticText variant="terminal" className="text-neutral-500">
                  Terminal Session Active
                </RealisticText>
              </div>
              
              <div 
                ref={terminalRef}
                className="h-96 overflow-y-auto p-4 bg-black font-mono text-sm text-neutral-300 leading-relaxed"
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
                <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800">
                  <div className="flex gap-2">
                    <span className="text-neutral-500 font-mono">{'>'}</span>
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      className="flex-1 bg-transparent border-none text-neutral-100 font-mono focus:ring-0 p-0"
                      placeholder="Enter command..."
                      disabled={isProcessing}
                      autoFocus
                    />
                  </div>
                </form>
              )}
            </RealisticWastelandCard>
          </TabsContent>

          <TabsContent value="encoder" className="mt-6">
            <TransactionEncoder />
          </TabsContent>

          <TabsContent value="decoder" className="mt-6">
            <TransactionDecoder />
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <SystemStatus />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Transaction Encoder Component
const TransactionEncoder = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RealisticWastelandCard variant="default" className="p-6">
        <RealisticText variant="subtitle" className="mb-4">Transaction Input</RealisticText>
        <div className="space-y-4">
          <Textarea
            value={transactionData}
            onChange={(e) => setTransactionData(e.target.value)}
            placeholder="Paste raw transaction data here..."
            className="h-48 bg-neutral-900 border-neutral-700 text-neutral-100 font-mono text-sm resize-none"
          />
          <RealisticButton
            onClick={handleEncode}
            disabled={!transactionData.trim() || isEncoding}
            variant="primary"
            className="w-full"
          >
            {isEncoding ? 'Encoding...' : 'Encode for Transmission'}
          </RealisticButton>
        </div>
      </RealisticWastelandCard>

      <RealisticWastelandCard variant="dark" className="p-6">
        <RealisticText variant="subtitle" className="mb-4">Encoded Frame</RealisticText>
        <div className="space-y-4">
          <div className="h-48 bg-black border border-neutral-700 p-4 font-mono text-sm text-neutral-300 overflow-auto">
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
            <RealisticButton variant="danger" className="w-full">
              Broadcast via Radio
            </RealisticButton>
          )}
        </div>
      </RealisticWastelandCard>
    </div>
  );
};

// Transaction Decoder Component  
const TransactionDecoder = () => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RealisticWastelandCard variant="default" className="p-6">
        <RealisticText variant="subtitle" className="mb-4">Received Frame</RealisticText>
        <div className="space-y-4">
          <Textarea
            value={receivedFrame}
            onChange={(e) => setReceivedFrame(e.target.value)}
            placeholder="Paste received frame data here..."
            className="h-48 bg-neutral-900 border-neutral-700 text-neutral-100 font-mono text-sm resize-none"
          />
          <RealisticButton
            onClick={handleDecode}
            disabled={!receivedFrame.trim() || isDecoding}
            variant="primary"
            className="w-full"
          >
            {isDecoding ? 'Decoding...' : 'Decode Transaction'}
          </RealisticButton>
        </div>
      </RealisticWastelandCard>

      <RealisticWastelandCard variant="dark" className="p-6">
        <RealisticText variant="subtitle" className="mb-4">Decoded Transaction</RealisticText>
        <div className="space-y-4">
          <div className="h-48 bg-black border border-neutral-700 p-4 font-mono text-sm text-neutral-300 overflow-auto">
            {decodedTransaction ? (
              <pre className="text-neutral-100">{decodedTransaction}</pre>
            ) : (
              <div className="text-neutral-600">Decoded transaction will appear here...</div>
            )}
          </div>
          {decodedTransaction && (
            <RealisticButton variant="primary" className="w-full">
              Broadcast to Network
            </RealisticButton>
          )}
        </div>
      </RealisticWastelandCard>
    </div>
  );
};

// System Status Component
const SystemStatus = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RealisticWastelandCard variant="default" className="p-6">
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

      <RealisticWastelandCard variant="default" className="p-6">
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