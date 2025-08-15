import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// Removed screen-glow component import
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard-realistic";
import Handheld from "@/pages/handheld-realistic";
import PWAInterface from "@/pages/pwa-interface";
import { NftMintingInterface } from "@/components/nft-minting-interface";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/mint" component={NftMintingInterface} />
      <Route path="/handheld" component={Handheld} />
      <Route path="/pwa" component={PWAInterface} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen relative">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;