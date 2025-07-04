import { Router, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/sidebar";
import { Dashboard } from "@/pages/dashboard";
import { Roster } from "@/pages/roster";
import { PlayerDatabase } from "@/pages/player-database";
import { Draft } from "@/pages/draft";
import { Trades } from "@/pages/trades";
import { Training } from "@/pages/training";
import { FreeAgency } from "@/pages/free-agency";
import { Statistics } from "@/pages/statistics";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark">
        <Router>
          <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              <Route path="/" component={Dashboard} />
              <Route path="/roster" component={Roster} />
              <Route path="/players" component={PlayerDatabase} />
              <Route path="/draft" component={Draft} />
              <Route path="/trades" component={Trades} />
              <Route path="/training" component={Training} />
              <Route path="/free-agency" component={FreeAgency} />
              <Route path="/statistics" component={Statistics} />
              <Route component={NotFound} />
            </main>
          </div>
          <Toaster />
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
