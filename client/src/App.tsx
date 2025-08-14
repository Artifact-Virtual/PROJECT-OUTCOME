import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScreenGlow } from "@/components/screen-glow";
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen relative">
          <ScreenGlow />
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;