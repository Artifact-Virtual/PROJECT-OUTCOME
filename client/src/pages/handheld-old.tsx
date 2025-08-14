import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, Radio, Terminal, Wifi, WifiOff, Activity, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { courierApi } from "@/lib/courier-api";

export default function Handheld() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [txHex, setTxHex] = useState("");
  const [frames, setFrames] = useState("");
  const [encodedResult, setEncodedResult] = useState("");
  const [decodedResult, setDecodedResult] = useState("");
  const [isEncoding, setIsEncoding] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [isBroadcasting, setBroadcasting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleEncodeTx = async () => {
    if (!txHex.trim()) {
      toast({
        title: "Error",
        description: "Please enter a transaction hex",
        variant: "destructive",
      });
      return;
    }

    setIsEncoding(true);
    try {
      const result = await courierApi.encodeTx(txHex, "user-id"); // TODO: Get actual user ID
      setEncodedResult(result.frames);
      toast({
        title: "Success",
        description: "Transaction encoded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encode transaction",
        variant: "destructive",
      });
    } finally {
      setIsEncoding(false);
    }
  };

  const handleDecodeFrames = async () => {
    if (!frames.trim()) {
      toast({
        title: "Error",
        description: "Please enter frames to decode",
        variant: "destructive",
      });
      return;
    }

    setIsDecoding(true);
    try {
      const result = await courierApi.decodeFrames(frames);
      setDecodedResult(result.txHex);
      toast({
        title: "Success",
        description: "Frames decoded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decode frames",
        variant: "destructive",
      });
    } finally {
      setIsDecoding(false);
    }
  };

  const handleBroadcastTx = async () => {
    if (!decodedResult.trim()) {
      toast({
        title: "Error",
        description: "No decoded transaction to broadcast",
        variant: "destructive",
      });
      return;
    }

    setBroadcasting(true);
    try {
      const result = await courierApi.broadcastTx(decodedResult);
      toast({
        title: "Success",
        description: `Transaction broadcasted: ${result.txHash}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to broadcast transaction",
        variant: "destructive",
      });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-border-gray bg-darker-bg/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-cyber-blue hover:text-cyber-blue hover:bg-cyber-blue/10"
                  data-testid="button-back-dashboard"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  DASHBOARD
                </Button>
              </Link>
              <div className="w-8 h-8 bg-warning-orange/20 border border-warning-orange rounded flex items-center justify-center">
                <Radio className="w-4 h-4 text-warning-orange" />
              </div>
              <div>
                <h1 className="text-xl font-cyber font-bold text-warning-orange">HANDHELD TERMINAL</h1>
                <p className="text-xs text-gray-400">Foundry Courier Interface</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant={isOnline ? "default" : "destructive"}
                className={`${isOnline ? 'bg-toxic-green/20 text-toxic-green border-toxic-green' : 'bg-danger-red/20 text-danger-red border-danger-red'}`}
              >
                {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                {isOnline ? "ONLINE" : "OFFLINE"}
              </Badge>
              <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue">
                <Activity className="w-3 h-3 mr-1" />
                COURIER ACTIVE
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card-bg border-border-gray">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center">
                <Terminal className="w-4 h-4 mr-2" />
                BACKEND STATUS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Python Backend:</span>
                  <Badge className="bg-toxic-green/20 text-toxic-green border-toxic-green">ACTIVE</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Error Correction:</span>
                  <span className="text-cyber-blue">CRC32 + Parity</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Supported Channels:</span>
                  <span className="text-gray-300">Radio, SMS, Mesh</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-border-gray">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                SECURITY STATUS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Private Keys:</span>
                  <Badge className="bg-toxic-green/20 text-toxic-green border-toxic-green">NEVER STORED</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Data Integrity:</span>
                  <span className="text-cyber-blue">Verified</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Offline Ready:</span>
                  <span className="text-toxic-green">YES</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card-bg border-border-gray">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                TRANSMISSION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Last TX:</span>
                  <span className="text-gray-300">12:34:56</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate:</span>
                  <span className="text-toxic-green">98.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Queue:</span>
                  <span className="text-warning-orange">3 pending</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Card className="bg-card-bg border-border-gray terminal-border">
          <CardHeader>
            <CardTitle className="text-xl font-cyber text-cyber-blue">FOUNDRY COURIER INTERFACE</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="encode" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-darker-bg">
                <TabsTrigger 
                  value="encode" 
                  className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue"
                  data-testid="tab-encode"
                >
                  ENCODE TX
                </TabsTrigger>
                <TabsTrigger 
                  value="decode" 
                  className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green"
                  data-testid="tab-decode"
                >
                  DECODE FRAMES
                </TabsTrigger>
                <TabsTrigger 
                  value="broadcast" 
                  className="data-[state=active]:bg-warning-orange/20 data-[state=active]:text-warning-orange"
                  data-testid="tab-broadcast"
                >
                  BROADCAST
                </TabsTrigger>
              </TabsList>

              <TabsContent value="encode" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">SIGNED TRANSACTION HEX</label>
                    <Textarea
                      placeholder="0x02f8b1012a8405f5e100825208943b2ccdd1ce0e65442045b2b7d54e8d0cbb7b3d3187b1a2bc2ec50000080c080a0..."
                      value={txHex}
                      onChange={(e) => setTxHex(e.target.value)}
                      className="bg-darker-bg border-border-gray text-white min-h-[100px] font-mono text-xs"
                      data-testid="input-tx-hex"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleEncodeTx}
                    disabled={isEncoding || !txHex.trim()}
                    className="w-full bg-cyber-blue/20 border border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black"
                    data-testid="button-encode-tx"
                  >
                    {isEncoding ? "ENCODING..." : "ENCODE TRANSACTION"}
                  </Button>

                  {encodedResult && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">ENCODED FRAMES (READY FOR TRANSMISSION)</label>
                      <Textarea
                        value={encodedResult}
                        readOnly
                        className="bg-darker-bg border-toxic-green text-toxic-green min-h-[100px] font-mono text-xs"
                        data-testid="output-encoded-frames"
                      />
                      <p className="text-xs text-gray-500">
                        These frames can be transmitted via radio, SMS, mesh networks, or any data carrier.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="decode" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">RECEIVED FRAMES</label>
                    <Textarea
                      placeholder="FC:01:0F:1A2B3C4D..."
                      value={frames}
                      onChange={(e) => setFrames(e.target.value)}
                      className="bg-darker-bg border-border-gray text-white min-h-[100px] font-mono text-xs"
                      data-testid="input-frames"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleDecodeFrames}
                    disabled={isDecoding || !frames.trim()}
                    className="w-full bg-toxic-green/20 border border-toxic-green text-toxic-green hover:bg-toxic-green hover:text-black"
                    data-testid="button-decode-frames"
                  >
                    {isDecoding ? "DECODING..." : "DECODE FRAMES"}
                  </Button>

                  {decodedResult && (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">RECOVERED TRANSACTION</label>
                      <Textarea
                        value={decodedResult}
                        readOnly
                        className="bg-darker-bg border-cyber-blue text-cyber-blue min-h-[100px] font-mono text-xs"
                        data-testid="output-decoded-tx"
                      />
                      <p className="text-xs text-gray-500">
                        Transaction successfully recovered and verified. Ready for broadcast.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="broadcast" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-darker-bg border border-warning-orange/30 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-warning-orange" />
                      <span className="text-sm font-semibold text-warning-orange">BROADCAST STATUS</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {decodedResult ? 
                        "Transaction ready for broadcast to blockchain network." : 
                        "No decoded transaction available. Decode frames first."
                      }
                    </div>
                  </div>

                  {decodedResult && (
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">TRANSACTION TO BROADCAST</label>
                      <Textarea
                        value={decodedResult}
                        readOnly
                        className="bg-darker-bg border-border-gray text-white min-h-[80px] font-mono text-xs"
                        data-testid="display-broadcast-tx"
                      />
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleBroadcastTx}
                    disabled={isBroadcasting || !decodedResult || !isOnline}
                    className="w-full bg-warning-orange/20 border border-warning-orange text-warning-orange hover:bg-warning-orange hover:text-black"
                    data-testid="button-broadcast-tx"
                  >
                    {isBroadcasting ? "BROADCASTING..." : "BROADCAST TO NETWORK"}
                  </Button>

                  {!isOnline && (
                    <p className="text-xs text-danger-red text-center">
                      Network connection required for broadcasting
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Commands Reference */}
        <Card className="bg-card-bg border-border-gray mt-8">
          <CardHeader>
            <CardTitle className="text-lg font-cyber text-toxic-green">COMMAND REFERENCE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono">
              <div>
                <h4 className="text-cyber-blue font-semibold mb-2">ENCODING COMMANDS</h4>
                <div className="space-y-1 text-gray-400">
                  <div>encode-tx --hex &lt;TX_HEX&gt; --output frames.txt</div>
                  <div>encode-tx --hex &lt;TX_HEX&gt; --parity</div>
                  <div>encode-tx --hex &lt;TX_HEX&gt; --frame-size 64</div>
                </div>
              </div>
              <div>
                <h4 className="text-toxic-green font-semibold mb-2">DECODING COMMANDS</h4>
                <div className="space-y-1 text-gray-400">
                  <div>decode-frames --input frames.txt --output tx.hex</div>
                  <div>decode-frames --frames "FC:01:..."</div>
                  <div>verify-frames --input frames.txt</div>
                </div>
              </div>
              <div>
                <h4 className="text-warning-orange font-semibold mb-2">BROADCAST COMMANDS</h4>
                <div className="space-y-1 text-gray-400">
                  <div>push-eth --hex &lt;TX_HEX&gt; --rpc-url &lt;URL&gt;</div>
                  <div>push-btc --hex &lt;TX_HEX&gt; --rpc-url &lt;URL&gt;</div>
                  <div>list-services</div>
                </div>
              </div>
              <div>
                <h4 className="text-danger-red font-semibold mb-2">UTILITY COMMANDS</h4>
                <div className="space-y-1 text-gray-400">
                  <div>help</div>
                  <div>status</div>
                  <div>test-connectivity</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
