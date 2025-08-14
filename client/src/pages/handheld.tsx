import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { WastelandText, WastelandButton, WastelandCard } from "@/components/wasteland-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Handheld() {
  const [isBooted, setIsBooted] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Boot sequence
  useEffect(() => {
    const bootSequence = [
      'VAULT-TEC HANDHELD TERMINAL v2.1.4',
      '================================',
      '',
      'Initializing Pip-Boy OS...',
      'Loading GECK protocols...',
      'Connecting to Wasteland Network...',
      'Scanning for radio frequencies...',
      '',
      '⚡ POWER: 85% REMAINING',
      '📡 SIGNAL: SEARCHING...',
      '☢ RAD: LOW LEVELS DETECTED',
      '',
      'SYSTEM READY FOR OPERATION',
      'Type "help" for available commands',
      ''
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        setTerminalLines(prev => [...prev, bootSequence[index]]);
        index++;
      } else {
        setIsBooted(true);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const handleCommand = (command: string) => {
    setIsProcessing(true);
    setTerminalLines(prev => [...prev, `> ${command}`, '']);
    
    setTimeout(() => {
      let response: string[] = [];
      
      switch (command.toLowerCase().trim()) {
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
            'clear         - Clear terminal screen',
            'exit          - Return to main interface',
            ''
          ];
          break;
        case 'status':
          response = [
            'HANDHELD TERMINAL STATUS:',
            '========================',
            '⚡ Battery: 85% (4.2 hours remaining)',
            '📡 Radio: Scanning on 2.4GHz mesh',
            '💾 Memory: 12.7MB / 64MB used',
            '🔐 Encryption: AES-256 active',
            '☢ Radiation: 15 mSv (SAFE)',
            '🌐 Network: Offline mode active',
            ''
          ];
          break;
        case 'scan':
          response = [
            'Scanning for radio frequencies...',
            '',
            '📡 Found 3 active nodes:',
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
          setTimeout(() => {
            // Navigate back to dashboard or close terminal
          }, 1000);
          break;
        default:
          response = [`Unknown command: ${command}`, 'Type "help" for available commands.', ''];
      }
      
      setTerminalLines(prev => [...prev, ...response]);
      setIsProcessing(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isProcessing) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Terminal Header */}
      <section className="relative py-8 overflow-hidden border-b-2 border-wasteland-orange">
        <div className="absolute inset-0 bg-rusted-metal opacity-80" />
        <div className="relative container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 pip-boy-screen p-2">
                <div className="w-full h-full bg-wasteland-orange flex items-center justify-center text-2xl">
                  📱
                </div>
              </div>
              <div>
                <WastelandText variant="title" glow className="text-3xl">
                  PIP-BOY 3000 MARK IV
                </WastelandText>
                <WastelandText variant="terminal" className="text-ash-gray">
                  HANDHELD TRANSACTION TERMINAL
                </WastelandText>
              </div>
            </div>
            <Link href="/" data-testid="link-back-to-dashboard">
              <WastelandButton variant="secondary">
                ← RETURN TO WASTELAND
              </WastelandButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Terminal Interface */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="terminal" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-rusted-metal border-2 border-wasteland-orange mb-8">
            <TabsTrigger value="terminal" className="font-title text-xs data-[state=active]:bg-wasteland-orange data-[state=active]:text-dark-wasteland">
              TERMINAL
            </TabsTrigger>
            <TabsTrigger value="encoder" className="font-title text-xs data-[state=active]:bg-wasteland-orange data-[state=active]:text-dark-wasteland">
              ENCODER
            </TabsTrigger>
            <TabsTrigger value="decoder" className="font-title text-xs data-[state=active]:bg-wasteland-orange data-[state=active]:text-dark-wasteland">
              DECODER
            </TabsTrigger>
            <TabsTrigger value="status" className="font-title text-xs data-[state=active]:bg-wasteland-orange data-[state=active]:text-dark-wasteland">
              STATUS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terminal">
            <WastelandCard variant="terminal" className="p-0 overflow-hidden">
              {/* Terminal Screen */}
              <div 
                ref={terminalRef}
                className="h-96 bg-charred-earth p-4 font-mono text-sm text-radiation-green overflow-y-auto"
                style={{ 
                  textShadow: '0 0 10px currentColor',
                  background: 'linear-gradient(135deg, #0a0f0a 0%, #1a2f1a 100%)'
                }}
              >
                {terminalLines.map((line, index) => (
                  <div key={index} className="leading-relaxed">
                    {line === '' ? <br /> : line}
                  </div>
                ))}
                {isProcessing && (
                  <div className="animate-pulse">
                    Processing command...
                  </div>
                )}
                {isBooted && (
                  <div className="flex items-center">
                    <span className="text-wasteland-orange">VAULT-TEC&gt; </span>
                    <span className="animate-pulse">_</span>
                  </div>
                )}
              </div>

              {/* Command Input */}
              {isBooted && (
                <form onSubmit={handleSubmit} className="border-t-2 border-wasteland-orange p-4 bg-rusted-metal">
                  <div className="flex items-center gap-2">
                    <WastelandText variant="terminal" className="text-wasteland-orange">
                      VAULT-TEC&gt;
                    </WastelandText>
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      className="flex-1 bg-charred-earth border-radiation-green text-radiation-green font-mono"
                      placeholder="Enter command..."
                      disabled={isProcessing}
                      autoFocus
                      data-testid="input-terminal-command"
                    />
                    <WastelandButton 
                      type="submit" 
                      variant="radiation" 
                      size="sm"
                      disabled={isProcessing}
                      data-testid="button-execute-command"
                    >
                      EXECUTE
                    </WastelandButton>
                  </div>
                </form>
              )}
            </WastelandCard>
          </TabsContent>

          <TabsContent value="encoder">
            <TransactionEncoder />
          </TabsContent>

          <TabsContent value="decoder">
            <TransactionDecoder />
          </TabsContent>

          <TabsContent value="status">
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
    // Simulate encoding process
    setTimeout(() => {
      const mockFrame = `FRAME_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setEncodedFrame(mockFrame);
      setIsEncoding(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WastelandCard variant="default" className="p-6">
        <WastelandText variant="subtitle" className="mb-4 border-b border-wasteland-orange pb-2">
          TRANSACTION INPUT
        </WastelandText>
        <div className="space-y-4">
          <Textarea
            value={transactionData}
            onChange={(e) => setTransactionData(e.target.value)}
            placeholder="Paste raw transaction data here..."
            className="h-48 bg-charred-earth border-ash-gray text-foreground font-mono text-sm"
            data-testid="textarea-transaction-input"
          />
          <WastelandButton
            onClick={handleEncode}
            disabled={!transactionData.trim() || isEncoding}
            variant="primary"
            className="w-full"
            data-testid="button-encode-transaction"
          >
            {isEncoding ? 'ENCODING...' : 'ENCODE FOR TRANSMISSION'}
          </WastelandButton>
        </div>
      </WastelandCard>

      <WastelandCard variant="terminal" className="p-6">
        <WastelandText variant="subtitle" className="mb-4 border-b border-radiation-green pb-2">
          ENCODED FRAME
        </WastelandText>
        <div className="space-y-4">
          <div className="h-48 bg-charred-earth border border-radiation-green p-4 font-mono text-sm text-radiation-green overflow-auto">
            {encodedFrame ? (
              <div>
                <div className="text-wasteland-orange mb-2">TRANSMISSION READY:</div>
                <div className="break-all">{encodedFrame}</div>
                <div className="mt-4 text-ash-gray text-xs">
                  Frame contains error correction and mesh routing data
                </div>
              </div>
            ) : (
              <div className="text-ash-gray">Encoded frame will appear here...</div>
            )}
          </div>
          {encodedFrame && (
            <WastelandButton
              variant="radiation"
              className="w-full"
              data-testid="button-broadcast-frame"
            >
              BROADCAST VIA RADIO
            </WastelandButton>
          )}
        </div>
      </WastelandCard>
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
      const mockTransaction = {
        to: '0x742d35Cc6Bf4a532...95eBc',
        value: '0.025 ETH',
        gasLimit: '21000',
        gasPrice: '12 gwei',
        nonce: 42,
        data: '0x'
      };
      setDecodedTransaction(JSON.stringify(mockTransaction, null, 2));
      setIsDecoding(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <WastelandCard variant="default" className="p-6">
        <WastelandText variant="subtitle" className="mb-4 border-b border-wasteland-orange pb-2">
          RECEIVED FRAME
        </WastelandText>
        <div className="space-y-4">
          <Textarea
            value={receivedFrame}
            onChange={(e) => setReceivedFrame(e.target.value)}
            placeholder="Paste received transmission frame..."
            className="h-48 bg-charred-earth border-ash-gray text-foreground font-mono text-sm"
            data-testid="textarea-received-frame"
          />
          <WastelandButton
            onClick={handleDecode}
            disabled={!receivedFrame.trim() || isDecoding}
            variant="primary"
            className="w-full"
            data-testid="button-decode-frame"
          >
            {isDecoding ? 'DECODING...' : 'DECODE TRANSMISSION'}
          </WastelandButton>
        </div>
      </WastelandCard>

      <WastelandCard variant="terminal" className="p-6">
        <WastelandText variant="subtitle" className="mb-4 border-b border-radiation-green pb-2">
          DECODED TRANSACTION
        </WastelandText>
        <div className="space-y-4">
          <div className="h-48 bg-charred-earth border border-radiation-green p-4 font-mono text-sm text-radiation-green overflow-auto">
            {decodedTransaction ? (
              <pre>{decodedTransaction}</pre>
            ) : (
              <div className="text-ash-gray">Decoded transaction will appear here...</div>
            )}
          </div>
          {decodedTransaction && (
            <WastelandButton
              variant="radiation"
              className="w-full"
              data-testid="button-execute-transaction"
            >
              EXECUTE TRANSACTION
            </WastelandButton>
          )}
        </div>
      </WastelandCard>
    </div>
  );
};

// System Status Component
const SystemStatus = () => {
  const [systemInfo] = useState({
    battery: 85,
    signal: 'SEARCHING',
    radiation: 15,
    temperature: 42,
    uptime: '2h 34m',
    memory: 12.7,
    storage: 45.2
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WastelandCard variant="default" className="p-6">
        <WastelandText variant="subtitle" className="mb-4">
          POWER SYSTEMS
        </WastelandText>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-ash-gray">Battery:</span>
            <span className="text-wasteland-orange font-mono">{systemInfo.battery}%</span>
          </div>
          <div className="w-full bg-charred-earth h-2 border border-ash-gray">
            <div 
              className="h-full bg-wasteland-orange animate-radiation-pulse"
              style={{ width: `${systemInfo.battery}%` }}
            />
          </div>
          <div className="text-sm text-ash-gray">
            Estimated: 4.2 hours remaining
          </div>
        </div>
      </WastelandCard>

      <WastelandCard variant="terminal" className="p-6">
        <WastelandText variant="subtitle" className="mb-4">
          COMMUNICATIONS
        </WastelandText>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-ash-gray">Signal:</span>
            <Badge className="bg-toxic-yellow text-dark-wasteland text-xs animate-pulse">
              {systemInfo.signal}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-ash-gray">Nodes:</span>
            <span className="text-radiation-green font-mono">3 ACTIVE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ash-gray">Frequency:</span>
            <span className="text-steel-blue font-mono">2.4 GHz</span>
          </div>
        </div>
      </WastelandCard>

      <WastelandCard variant="radiation" className="p-6">
        <WastelandText variant="subtitle" className="mb-4">
          ENVIRONMENTAL
        </WastelandText>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-ash-gray">Radiation:</span>
            <span className="text-radiation-green font-mono">{systemInfo.radiation} mSv</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ash-gray">Temperature:</span>
            <span className="text-burnt-amber font-mono">{systemInfo.temperature}°C</span>
          </div>
          <Badge className="bg-radiation-green text-dark-wasteland text-xs">
            SAFE LEVELS
          </Badge>
        </div>
      </WastelandCard>
    </div>
  );
};