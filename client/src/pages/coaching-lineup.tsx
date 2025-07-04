import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Clock, ArrowLeft, X } from "lucide-react";
import { Link } from "wouter";
import type { Player } from "@shared/schema";

export function CoachingLineup() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [startersList, setStartersList] = useState<Player[]>([]);
  const [benchList, setBenchList] = useState<Player[]>([]);
  const [manualPlayers, setManualPlayers] = useState<Player[]>([]);
  
  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  // Immediate data fetching on mount like other pages
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersRes = await fetch('/api/players');
        const playersData = await playersRes.json();
        setManualPlayers(playersData);
        console.log("Lineup - Manual fetch players:", playersData);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  // Use manual players as fallback
  const playersData = players || manualPlayers;
  const lakersPlayers = playersData?.filter((p: Player) => p.teamId) || [];
  
  // Initialize lineups when players data is available
  useEffect(() => {
    if (lakersPlayers.length > 0 && startersList.length === 0) {
      const starters = lakersPlayers.slice(0, 5);
      const bench = lakersPlayers.slice(5);
      setStartersList(starters);
      setBenchList(bench);
      console.log("Lineup - Total Lakers players:", lakersPlayers.length);
      console.log("Lineup - Starters count:", starters.length);
      console.log("Lineup - Bench count:", bench.length);
      console.log("Lineup - Bench players:", bench.map(p => p.name));
    }
  }, [lakersPlayers.length]);
  
  // Define starting lineup with realistic minutes (32-38 minutes)
  const starterMinutes = [36, 34, 32, 35, 33]; // Realistic starter minutes
  
  // Define bench players with realistic minutes (8-20 minutes)
  const benchMinutes = [18, 15, 12, 8, 10, 6, 8, 5, 4, 2]; // Realistic bench minutes

  const handlePlayerSwap = (player: Player) => {
    if (!selectedPlayer) {
      setSelectedPlayer(player);
      return;
    }

    // Find which list each player is in
    const selectedIsStarter = startersList.some(p => p.id === selectedPlayer.id);
    const targetIsStarter = startersList.some(p => p.id === player.id);

    if (selectedIsStarter && !targetIsStarter) {
      // Swap starter with bench player
      const newStarters = startersList.map(p => p.id === selectedPlayer.id ? player : p);
      const newBench = benchList.map(p => p.id === player.id ? selectedPlayer : p);
      setStartersList(newStarters);
      setBenchList(newBench);
    } else if (!selectedIsStarter && targetIsStarter) {
      // Swap bench player with starter
      const newStarters = startersList.map(p => p.id === player.id ? selectedPlayer : p);
      const newBench = benchList.map(p => p.id === selectedPlayer.id ? player : p);
      setStartersList(newStarters);
      setBenchList(newBench);
    } else if (selectedIsStarter && targetIsStarter) {
      // Swap two starters
      const selectedIndex = startersList.findIndex(p => p.id === selectedPlayer.id);
      const targetIndex = startersList.findIndex(p => p.id === player.id);
      const newStarters = [...startersList];
      [newStarters[selectedIndex], newStarters[targetIndex]] = [newStarters[targetIndex], newStarters[selectedIndex]];
      setStartersList(newStarters);
    } else if (!selectedIsStarter && !targetIsStarter) {
      // Swap two bench players
      const selectedIndex = benchList.findIndex(p => p.id === selectedPlayer.id);
      const targetIndex = benchList.findIndex(p => p.id === player.id);
      const newBench = [...benchList];
      [newBench[selectedIndex], newBench[targetIndex]] = [newBench[targetIndex], newBench[selectedIndex]];
      setBenchList(newBench);
    }

    setSelectedPlayer(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/coaching">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Coaching
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Lineup & Minutes</h1>
              <p className="text-muted-foreground">
                Assign playing time to your starters and bench players
              </p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            Save Lineup Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Instructions */}
        {selectedPlayer && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-medium">{selectedPlayer.name}</span> is selected. 
              Click the <X className="inline w-3 h-3 mx-1 transform rotate-45" /> button next to another player to swap positions.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Starting Lineup */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Starting Lineup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {startersList.map((player: Player, index: number) => (
                  <div key={player.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedPlayer?.id === player.id ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/70'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">{player.jerseyNumber}</span>
                      </div>
                      <div>
                        <div className="text-foreground font-medium">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        defaultValue={starterMinutes[index] || 32}
                        min="0" 
                        max="48" 
                        className="w-16 px-2 py-1 text-sm bg-background border border-border rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bench Players */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Bench Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benchList.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Loading Bench Players</h3>
                    <p className="text-muted-foreground">
                      Bench players will appear here once data is loaded.
                    </p>
                  </div>
                ) : (
                  benchList.map((player: Player, index: number) => (
                  <div key={player.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    selectedPlayer?.id === player.id ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/70'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                        <span className="text-secondary font-semibold text-sm">{player.jerseyNumber}</span>
                      </div>
                      <div>
                        <div className="text-foreground font-medium">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        defaultValue={benchMinutes[index] || 10}
                        min="0" 
                        max="48" 
                        className="w-16 px-2 py-1 text-sm bg-background border border-border rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlayerSwap(player)}
                        className="w-8 h-8 p-0 ml-2 hover:bg-primary/20 rounded-full"
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-primary transform rotate-45" />
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lineup Summary */}
        <div className="mt-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Lineup Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {starterMinutes.reduce((a, b) => a + b, 0) + 
                     benchMinutes.slice(0, benchList.length).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Minutes</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{startersList.length}</div>
                  <div className="text-sm text-muted-foreground">Starters</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{benchList.length}</div>
                  <div className="text-sm text-muted-foreground">Bench Players</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {Math.round(((starterMinutes.reduce((a, b) => a + b, 0) + 
                                 benchMinutes.slice(0, benchList.length).reduce((a, b) => a + b, 0)) / 240) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Rotation Usage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}