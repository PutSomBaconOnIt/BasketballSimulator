import { Router, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { MainMenu } from "@/pages/main-menu";
import { TeamSelection } from "@/pages/team-selection";
import { Sidebar } from "@/components/layout/sidebar";
import { Dashboard } from "@/pages/dashboard";
import { Roster } from "@/pages/roster";
import { PlayerDatabase } from "@/pages/player-database";
import { Draft } from "@/pages/draft";
import { Trades } from "@/pages/trades";
import { Coaching } from "@/pages/coaching";
import { Scouting } from "@/pages/scouting";
import { FreeAgency } from "@/pages/free-agency";
import { Statistics } from "@/pages/statistics";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="dark">
        <Router>
          {/* Main Menu - Full Screen */}
          <Route path="/" component={MainMenu} />
          
          {/* Team Selection - Full Screen */}
          <Route path="/team-selection" component={TeamSelection} />
          
          {/* Game Pages - With Sidebar Layout */}
          <Route path="/dashboard">
            {() => (
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <Dashboard />
                </main>
              </div>
            )}
          </Route>
          
          <Route path="/roster">
            {() => (
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <Roster />
                </main>
              </div>
            )}
          </Route>
          
          <Route path="/coaching">
            {() => (
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <Coaching />
                </main>
              </div>
            )}
          </Route>
          
          <Route path="/scouting">
            {() => (
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <Scouting />
                </main>
              </div>
            )}
          </Route>
          
          <Route path="/players">
            {() => (
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <PlayerDatabase />
                </main>
              </div>
            )}
          </Route>
          
          <Route path="/draft">
            {() => (
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <Draft />
                </main>
              </div>
            )}
          </Route>
          
          <Route path="/trades">
            {() => (
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <Trades />
                </main>
              </div>
            )}
          </Route>
          

          
          <Route path="/free-agency">
            {() => (
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <FreeAgency />
                </main>
              </div>
            )}
          </Route>
          
          <Route path="/statistics">
            {() => (
              <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <Statistics />
                </main>
              </div>
            )}
          </Route>
          
          <Route component={NotFound} />
          
          <Toaster />
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
