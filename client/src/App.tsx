import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AtmosphericEffects, ParallaxBackground, ScanLines } from "@/components/atmospheric-effects";
import { WastelandText, WastelandButton } from "@/components/wasteland-ui";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard-realistic";
import Handheld from "@/pages/handheld-realistic";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/handheld" component={Handheld} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen relative overflow-hidden">
          {/* Layered atmospheric effects */}
          <ParallaxBackground />
          <AtmosphericEffects />
          <ScanLines />
          
          {/* Navigation Terminal */}
          <nav className="relative z-50 border-b-2 border-wasteland-orange bg-rusted-metal/95 backdrop-blur-lg shadow-wasteland">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" data-testid="link-home">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-wasteland-orange border-2 border-rust-red flex items-center justify-center animate-radiation-pulse">
                      <span className="text-dark-wasteland font-title font-bold text-lg">⚡</span>
                    </div>
                    <WastelandText variant="title" glow className="text-2xl">
                      OCSH
                    </WastelandText>
                  </div>
                </Link>
                
                <div className="flex gap-1">
                  <Link href="/" data-testid="link-dashboard">
                    <WastelandButton
                      variant={location === "/" ? "primary" : "secondary"}
                      size="sm"
                      className="transition-all duration-300"
                    >
                      WASTELAND
                    </WastelandButton>
                  </Link>
                  <Link href="/handheld" data-testid="link-handheld">
                    <WastelandButton
                      variant={location === "/handheld" ? "radiation" : "secondary"}
                      size="sm"
                      className="transition-all duration-300"
                    >
                      TERMINAL
                    </WastelandButton>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main wasteland content */}
          <main className="relative z-20 min-h-screen">
            <Router />
          </main>

          {/* Terminal status bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-charred-earth/90 border-t-2 border-wasteland-orange backdrop-blur-sm">
            <div className="container mx-auto px-6 py-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <div className="flex gap-6">
                  <span className="text-radiation-green">
                    ⚡ POWER: <span className="text-burnt-amber">85%</span>
                  </span>
                  <span className="text-steel-blue">
                    📡 SIGNAL: <span className="text-toxic-yellow animate-pulse">SEARCHING...</span>
                  </span>
                  <span className="text-rust-red">
                    ☢ RAD: <span className="text-wasteland-orange">LOW</span>
                  </span>
                </div>
                <div className="text-ash-gray">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour12: false,
                    timeZone: 'UTC'
                  })} UTC
                </div>
              </div>
            </div>
          </div>

          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
