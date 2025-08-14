import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RealisticWastelandCard, RealisticText, RealisticButton } from "@/components/realistic-wasteland";
import { getContinuumText } from "@/components/darknet-continuum";
import { useDeviceSensors } from "@/hooks/use-device-sensors";
import { useWeather } from "@/hooks/use-weather";

export default function RealisticHandheld() {
  const [isBooted, setIsBooted] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [refreshRate, setRefreshRate] = useState(60.0);
  const [hasGlitch, setHasGlitch] = useState(false);
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

  // Subtle refresh rate monitoring with erratic glitches
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let animationId: number;

    const updateRefreshRate = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (frameCount % 60 === 0) { // Update every ~1 second
        const deltaTime = currentTime - lastTime;
        const fps = (frameCount * 1000) / deltaTime;
        setRefreshRate(Number(fps.toFixed(1)));
        lastTime = currentTime;
        frameCount = 0;
      }
      
      animationId = requestAnimationFrame(updateRefreshRate);
    };

    // Erratic glitch system - very infrequent and random
    const glitchInterval = setInterval(() => {
      // Only glitch occasionally (every 45-120 seconds)
      if (Math.random() < 0.008) { // ~0.8% chance every interval
        setHasGlitch(true);
        // Quick recovery
        setTimeout(() => setHasGlitch(false), 150 + Math.random() * 200);
      }
    }, 1000);

    animationId = requestAnimationFrame(updateRefreshRate);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(glitchInterval);
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
                <div className="flex items-center justify-between">
                  <RealisticText variant="terminal" className="text-neutral-500">
                    Terminal Session Active
                  </RealisticText>
                  <div className={`text-xs font-mono transition-all duration-200 ${
                    hasGlitch 
                      ? 'text-red-400 animate-pulse' 
                      : refreshRate < 30 
                        ? 'text-yellow-400' 
                        : 'text-neutral-600'
                  }`}>
                    {hasGlitch ? `${(refreshRate + Math.random() * 10 - 5).toFixed(1)}` : refreshRate.toFixed(1)}Hz
                  </div>
                </div>
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

        {/* Professional AV Logo Footer - Appears on All Tabs */}
        <footer className="mt-8 py-6 flex justify-center border-t border-neutral-800/50">
          <div className="text-center">
            <svg width="64" height="40" viewBox="0 0 64 40" className="text-cyan-400 drop-shadow-md">
              <defs>
                {/* Advanced grid pattern */}
                <pattern id="militaryGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                  <rect width="4" height="4" fill="none"/>
                  <rect width="1" height="1" fill="currentColor" opacity="0.08"/>
                  <rect x="2" y="2" width="1" height="1" fill="currentColor" opacity="0.05"/>
                </pattern>
                
                {/* Holographic glow effect */}
                <filter id="holoGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                
                {/* Circuit pattern */}
                <pattern id="circuitPattern" width="8" height="8" patternUnits="userSpaceOnUse">
                  <rect width="8" height="8" fill="none"/>
                  <path d="M0,4 L2,4 L2,2 L6,2 L6,6 L8,6" stroke="currentColor" strokeWidth="0.3" opacity="0.15" fill="none"/>
                  <circle cx="2" cy="4" r="0.5" fill="currentColor" opacity="0.1"/>
                  <circle cx="6" cy="2" r="0.5" fill="currentColor" opacity="0.1"/>
                </pattern>
              </defs>
              
              {/* Main container with military border */}
              <rect width="64" height="40" fill="rgba(0,0,0,0.4)" stroke="currentColor" strokeWidth="0.8" opacity="0.7"/>
              <rect x="2" y="2" width="60" height="36" fill="url(#militaryGrid)" stroke="currentColor" strokeWidth="0.4" opacity="0.5"/>
              
              {/* Background circuit pattern */}
              <rect x="4" y="4" width="56" height="32" fill="url(#circuitPattern)" opacity="0.3"/>
              
              {/* Enhanced A letter - Military stencil style */}
              <g filter="url(#holoGlow)" fill="currentColor" stroke="currentColor" strokeWidth="0.3">
                <polygon points="12,32 18,8 22,8 28,32 24.5,32 23,27 17,27 15.5,32" opacity="0.9"/>
                <rect x="18" y="23" width="4" height="2" opacity="1"/>
                {/* A letter reinforcement bars */}
                <rect x="17.5" y="8" width="5" height="1" opacity="0.6"/>
                <rect x="16" y="30" width="2" height="2" opacity="0.4"/>
                <rect x="26" y="30" width="2" height="2" opacity="0.4"/>
              </g>
              
              {/* Enhanced V letter - Military stencil style */}
              <g filter="url(#holoGlow)" fill="currentColor" stroke="currentColor" strokeWidth="0.3">
                <polygon points="34,8 38,8 44,32 40,32 38,24 36,32 32,32 30,24 28,32 24,32 30,8" opacity="0.9"/>
                {/* V letter reinforcement elements */}
                <rect x="33.5" y="8" width="5" height="1" opacity="0.6"/>
                <circle cx="34" cy="20" r="0.8" opacity="0.3"/>
                <circle cx="38" cy="20" r="0.8" opacity="0.3"/>
              </g>
              
              {/* Professional corner brackets - Technical drawing style */}
              <g stroke="currentColor" strokeWidth="1" fill="none" opacity="0.8">
                <path d="M4,4 L4,10 M4,4 L10,4"/>
                <path d="M60,4 L60,10 M60,4 L54,4"/>
                <path d="M4,36 L4,30 M4,36 L10,36"/>
                <path d="M60,36 L60,30 M60,36 L54,36"/>
              </g>
              
              {/* Digital scan lines - Enhanced */}
              <g stroke="currentColor" strokeWidth="0.4" opacity="0.25">
                <line x1="0" y1="10" x2="64" y2="10"/>
                <line x1="0" y1="20" x2="64" y2="20"/>
                <line x1="0" y1="30" x2="64" y2="30"/>
                <line x1="16" y1="0" x2="16" y2="40"/>
                <line x1="32" y1="0" x2="32" y2="40"/>
                <line x1="48" y1="0" x2="48" y2="40"/>
              </g>
              
              {/* Status indicators */}
              <g>
                <circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.6"/>
                <circle cx="56" cy="8" r="1" fill="currentColor" opacity="0.6"/>
                <circle cx="8" cy="32" r="1" fill="currentColor" opacity="0.6"/>
                <circle cx="56" cy="32" r="1" fill="currentColor" opacity="0.6"/>
              </g>
              
              {/* Central data flow indicator */}
              <rect x="28" y="18" width="8" height="4" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
              <circle cx="32" cy="20" r="0.8" fill="currentColor" opacity="0.5"/>
              
              {/* Manufacturing spec text */}
              <text x="32" y="37" textAnchor="middle" fill="currentColor" fontSize="2.5" fontFamily="monospace" opacity="0.4">MIL-STD-810</text>
            </svg>
            
            {/* Manufacturer info */}
            <div className="mt-2 text-xs font-mono text-neutral-600 opacity-60">
              AUTONOMOUS VENTURES
            </div>
          </div>
        </footer>
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
  const { 
    deviceInfo, 
    systemMetrics, 
    isScanning, 
    errors, 
    startDeviceScan,
    requestPermission,
    updateLocationInfo 
  } = useDeviceSensors();
  
  const { weatherData, isLoading: weatherLoading, error: weatherError, refreshWeather } = useWeather();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-emerald-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPermissionColor = (state: PermissionState | null) => {
    switch (state) {
      case 'granted': return 'text-emerald-400';
      case 'prompt': return 'text-yellow-400';
      case 'denied': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Scan Controls */}
      <div className="flex gap-2 mb-4">
        <RealisticButton 
          onClick={startDeviceScan} 
          disabled={isScanning}
          size={isMobile ? "sm" : "md"}
          variant="primary"
        >
          {isScanning ? 'Scanning...' : 'Refresh Sensors'}
        </RealisticButton>
        <RealisticButton 
          onClick={refreshWeather}
          disabled={weatherLoading}
          size={isMobile ? "sm" : "md"}
          variant="secondary"
        >
          {weatherLoading ? 'Loading...' : 'Update Weather'}
        </RealisticButton>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <RealisticWastelandCard variant="dark" className={`${isMobile ? 'p-3' : 'p-4'} border-red-500/30`}>
          <RealisticText variant="caption" className="text-red-400 mb-2">SYSTEM ALERTS</RealisticText>
          {errors.map((error, index) => (
            <div key={index} className="text-xs text-red-300 font-mono">{error}</div>
          ))}
        </RealisticWastelandCard>
      )}

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
        {/* Hardware Status */}
        <RealisticWastelandCard variant="default" className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <RealisticText variant="subtitle" className="mb-4">Hardware Status</RealisticText>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-400">Battery</span>
              <span className={deviceInfo.battery ? getStatusColor(deviceInfo.battery.level, { good: 50, warning: 20 }) : 'text-neutral-500'}>
                {deviceInfo.battery ? `${deviceInfo.battery.level}% ${deviceInfo.battery.charging ? '⚡' : ''}` : 'N/A'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-400">Memory</span>
              <span className="text-emerald-400">
                {systemMetrics.memoryUsage 
                  ? `${formatBytes(systemMetrics.memoryUsage.usedJSHeapSize)} / ${formatBytes(systemMetrics.memoryUsage.jsHeapSizeLimit)}`
                  : `${deviceInfo.deviceMemory || 'Unknown'} GB`
                }
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-400">CPU Cores</span>
              <span className="text-emerald-400">{deviceInfo.hardwareConcurrency}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-400">Screen</span>
              <span className="text-emerald-400">{systemMetrics.screenResolution} @{systemMetrics.devicePixelRatio}x</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-400">Timezone</span>
              <span className="text-emerald-400">{systemMetrics.timezone}</span>
            </div>
          </div>
        </RealisticWastelandCard>

        {/* Network & Location */}
        <RealisticWastelandCard variant="default" className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <RealisticText variant="subtitle" className="mb-4">Network & Location</RealisticText>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-400">Connection</span>
              <span className={deviceInfo.connection.online ? 'text-emerald-400' : 'text-red-400'}>
                {deviceInfo.connection.online ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            
            {deviceInfo.network && (
              <>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Network Type</span>
                  <span className="text-emerald-400">{deviceInfo.network.effectiveType.toUpperCase()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-400">Downlink</span>
                  <span className="text-emerald-400">{deviceInfo.network.downlink} Mbps</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-400">Latency</span>
                  <span className="text-emerald-400">{deviceInfo.network.rtt}ms</span>
                </div>
              </>
            )}
            
            {deviceInfo.location ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-400">GPS</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
                <div className="text-xs font-mono text-neutral-300">
                  {deviceInfo.location.latitude.toFixed(6)}, {deviceInfo.location.longitude.toFixed(6)}
                </div>
                <div className="text-xs text-neutral-400">
                  Accuracy: ±{Math.round(deviceInfo.location.accuracy)}m
                </div>
              </div>
            ) : (
              <div className="flex justify-between">
                <span className="text-neutral-400">GPS</span>
                <RealisticButton 
                  onClick={() => requestPermission('geolocation')}
                  size="sm"
                  variant="ghost"
                  className="text-yellow-400 h-auto p-1"
                >
                  REQUEST ACCESS
                </RealisticButton>
              </div>
            )}
          </div>
        </RealisticWastelandCard>

        {/* Weather Data */}
        {weatherData && (
          <RealisticWastelandCard variant="default" className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <RealisticText variant="subtitle" className="mb-4">Environmental</RealisticText>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-400">Location</span>
                <span className="text-emerald-400">{weatherData.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Temperature</span>
                <span className="text-emerald-400">{weatherData.temperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Humidity</span>
                <span className="text-emerald-400">{weatherData.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Pressure</span>
                <span className="text-emerald-400">{weatherData.pressure} hPa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Wind</span>
                <span className="text-emerald-400">{weatherData.windSpeed} m/s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Conditions</span>
                <span className="text-emerald-400">{weatherData.description}</span>
              </div>
            </div>
          </RealisticWastelandCard>
        )}

        {/* Permissions */}
        <RealisticWastelandCard variant="default" className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <RealisticText variant="subtitle" className="mb-4">Hardware Access</RealisticText>
          <div className="space-y-3">
            {Object.entries(deviceInfo.permissions).map(([permission, state]) => (
              <div key={permission} className="flex justify-between items-center">
                <span className="text-neutral-400 capitalize">{permission}</span>
                {state === 'granted' ? (
                  <span className={getPermissionColor(state)}>GRANTED</span>
                ) : (
                  <RealisticButton 
                    onClick={() => requestPermission(permission as any)}
                    size="sm"
                    variant="ghost"
                    className={`${getPermissionColor(state)} h-auto p-1`}
                  >
                    {state === 'denied' ? 'DENIED' : 'REQUEST'}
                  </RealisticButton>
                )}
              </div>
            ))}
          </div>
        </RealisticWastelandCard>
      </div>
    </div>
  );
};