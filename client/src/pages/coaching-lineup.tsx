import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Clock, ArrowLeft, ArrowUp, Info, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import type { Player } from "@shared/schema";
import { PlayerDetailModal } from "@/components/player-detail-modal";

export function CoachingLineup() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [swapMode, setSwapMode] = useState(false);
  const [startersList, setStartersList] = useState<Player[]>([]);
  const [benchList, setBenchList] = useState<Player[]>([]);
  const [manualPlayers, setManualPlayers] = useState<Player[]>([]);
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [starterMinutes, setStarterMinutes] = useState<number[]>([32, 35, 30, 36, 34]);
  const [benchMinutes, setBenchMinutes] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Simplified early return to test if component loads
  if (startersList.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mb-6">
          <Link to="/coaching">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Coaching
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">Coaching Lineup (Loading...)</h1>
        <p className="text-muted-foreground">Loading player data...</p>
      </div>
    );
  }

  // Smart minute allocation based on position matching and overall rating
  const allocateBenchMinutes = () => {
    const newBenchMinutes = Array(benchList.length).fill(0);
    
    // Calculate remaining minutes after starters
    const starterTotal = starterMinutes.reduce((a, b) => a + b, 0);
    const remainingMinutes = 240 - starterTotal;
    
    // Get starter overall ratings by position for comparison
    const startersByPosition: { [key: string]: number[] } = {};
    startersList.forEach((player, index) => {
      if (!startersByPosition[player.position]) {
        startersByPosition[player.position] = [];
      }
      startersByPosition[player.position].push(player.overall);
    });
    
    // Calculate each bench player's rating relative to their position starters
    const benchWithMetrics = benchList.map((player, index) => {
      const positionStarters = startersByPosition[player.position] || [];
      const avgStarterRating = positionStarters.length > 0 
        ? positionStarters.reduce((a, b) => a + b, 0) / positionStarters.length 
        : 85; // Default if no position match
      
      // Calculate rating difference (positive = better than starter average)
      const ratingDifference = player.overall - avgStarterRating;
      
      // Base minutes calculation: higher overall = more minutes
      // Range: 0-25 minutes based on overall (70-95 range)
      const baseMinutes = Math.max(0, (player.overall - 70) * 1.0);
      
      // Position bonus: +50% minutes if matches starter position
      const positionBonus = positionStarters.length > 0 ? 1.5 : 1.0;
      
      // Rating difference modifier: if close to starter rating, get more minutes
      const ratingModifier = Math.max(0.3, 1 + (ratingDifference / 20));
      
      return {
        index,
        player,
        baseMinutes,
        positionBonus,
        ratingModifier,
        finalScore: baseMinutes * positionBonus * ratingModifier,
        overall: player.overall
      };
    }).sort((a, b) => b.finalScore - a.finalScore);
    
    // Distribute available minutes proportionally based on scores
    const totalScore = benchWithMetrics.reduce((sum, p) => sum + p.finalScore, 0);
    let minutesToDistribute = Math.min(remainingMinutes, 80); // Max 80 bench minutes
    
    if (totalScore > 0) {
      benchWithMetrics.forEach(({ index, finalScore }) => {
        // Proportional allocation with minimum 0, maximum 25 per player
        const proportionalMinutes = (finalScore / totalScore) * minutesToDistribute;
        const allocatedMinutes = Math.min(25, Math.max(0, Math.round(proportionalMinutes)));
        newBenchMinutes[index] = allocatedMinutes;
      });
      
      // Fine-tune to exactly hit the target if possible
      const currentTotal = newBenchMinutes.reduce((a, b) => a + b, 0);
      const difference = Math.min(minutesToDistribute, 80) - currentTotal;
      
      if (difference !== 0) {
        // Distribute remaining/excess minutes to highest-rated players
        const sortedIndices = benchWithMetrics
          .map(({ index }) => index)
          .slice(0, Math.abs(difference));
        
        sortedIndices.forEach(index => {
          if (difference > 0 && newBenchMinutes[index] < 25) {
            newBenchMinutes[index] += 1;
          } else if (difference < 0 && newBenchMinutes[index] > 0) {
            newBenchMinutes[index] -= 1;
          }
        });
      }
    }
    
    setBenchMinutes(newBenchMinutes);
  };
  
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
      // Sort players by position order: PG, SG, SF, PF, C
      const positionOrder = ['PG', 'SG', 'SF', 'PF', 'C'];
      const playersByPosition: { [key: string]: Player[] } = {};
      
      // Group players by position
      lakersPlayers.forEach(player => {
        if (!playersByPosition[player.position]) {
          playersByPosition[player.position] = [];
        }
        playersByPosition[player.position].push(player);
      });
      
      // Sort each position group by overall rating (highest first)
      Object.keys(playersByPosition).forEach(position => {
        playersByPosition[position].sort((a, b) => b.overall - a.overall);
      });
      
      // Create starting lineup with one player from each position in order
      const starters: Player[] = [];
      const remainingPlayers: Player[] = [];
      
      positionOrder.forEach(position => {
        const positionPlayers = playersByPosition[position] || [];
        if (positionPlayers.length > 0) {
          starters.push(positionPlayers[0]); // Best player for this position
          remainingPlayers.push(...positionPlayers.slice(1)); // Rest go to bench
        }
      });
      
      // If we don't have all 5 positions, fill with best remaining players
      const allRemaining = lakersPlayers.filter(p => !starters.includes(p))
        .sort((a, b) => b.overall - a.overall);
      
      while (starters.length < 5 && allRemaining.length > 0) {
        starters.push(allRemaining.shift()!);
      }
      
      // Bench is everyone else, sorted by overall rating
      const bench = allRemaining.sort((a, b) => b.overall - a.overall);
      
      setStartersList(starters);
      setBenchList(bench);
      
      console.log("Lineup - Total Lakers players:", lakersPlayers.length);
      console.log("Lineup - Starters count:", starters.length);
      console.log("Lineup - Bench count:", bench.length);
      console.log("Lineup - Starters by position:", starters.map(p => `${p.position}: ${p.name}`));
      console.log("Lineup - Bench players:", bench.map(p => p.name));
    }
  }, [lakersPlayers.length]);
  


  const handlePlayerSwap = (player: Player) => {
    // Only allow swapping when swap mode is enabled
    if (!swapMode) {
      return;
    }

    if (!selectedPlayer) {
      setSelectedPlayer(player);
      return;
    }

    // Prevent selecting the same player twice
    if (selectedPlayer.id === player.id) {
      setSelectedPlayer(null);
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

  const handleViewPlayerCard = (player: Player) => {
    setModalPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalPlayer(null);
  };

  const adjustStarterMinutes = (index: number, change: number) => {
    const newMinutes = [...starterMinutes];
    const currentTotal = starterMinutes.reduce((a, b) => a + b, 0) + benchMinutes.reduce((a, b) => a + b, 0);
    const remainingMinutes = 240 - currentTotal;
    
    // If trying to increase and no minutes remaining, don't allow
    if (change > 0 && remainingMinutes <= 0) {
      return;
    }
    
    const newValue = Math.max(0, Math.min(48, newMinutes[index] + change));
    
    // If increasing, check if we have enough remaining minutes
    if (change > 0) {
      const minutesNeeded = newValue - newMinutes[index];
      if (minutesNeeded > remainingMinutes) {
        newMinutes[index] = newMinutes[index] + remainingMinutes;
      } else {
        newMinutes[index] = newValue;
      }
    } else {
      newMinutes[index] = newValue;
    }
    
    setStarterMinutes(newMinutes);
  };

  const adjustBenchMinutes = (index: number, change: number) => {
    const newMinutes = [...benchMinutes];
    const currentTotal = starterMinutes.reduce((a, b) => a + b, 0) + benchMinutes.reduce((a, b) => a + b, 0);
    const remainingMinutes = 240 - currentTotal;
    
    // If trying to increase and no minutes remaining, don't allow
    if (change > 0 && remainingMinutes <= 0) {
      return;
    }
    
    const newValue = Math.max(0, Math.min(48, newMinutes[index] + change));
    
    // If increasing, check if we have enough remaining minutes
    if (change > 0) {
      const minutesNeeded = newValue - newMinutes[index];
      if (minutesNeeded > remainingMinutes) {
        newMinutes[index] = newMinutes[index] + remainingMinutes;
      } else {
        newMinutes[index] = newValue;
      }
    } else {
      newMinutes[index] = newValue;
    }
    
    setBenchMinutes(newMinutes);
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="p-6">
        {/* Instructions */}
        {swapMode && !selectedPlayer && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-medium">Move Mode Active:</span> Click any player to select them for moving.
            </p>
          </div>
        )}
        {swapMode && selectedPlayer && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-medium">{selectedPlayer.name}</span> is selected. 
              Click another player to swap their positions.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-8">
          {/* Starting Lineup */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-500" />
                  Starting Lineup
                </div>
                <Button
                  variant={swapMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSwapMode(!swapMode);
                    setSelectedPlayer(null);
                  }}
                  className={`text-xs ${swapMode 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'hover:bg-primary/10 border-primary/20'
                  }`}
                  title="Click to enable/disable move mode"
                >
                  <ArrowUp className="w-3 h-3 mr-1" />
                  {swapMode ? 'Exit Move Mode' : 'Move Players'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!swapMode && (
                <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-muted">
                  <p className="text-xs text-muted-foreground">
                    💡 To change your starting lineup: Click "Move Players" to enable move mode, then select players to swap positions.
                  </p>
                </div>
              )}
              <div className="space-y-4">
                {startersList.map((player: Player, index: number) => (
                  <div 
                    key={player.id} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selectedPlayer?.id === player.id ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/70'
                    } ${swapMode ? 'cursor-pointer' : ''}`}
                    onClick={swapMode ? () => handlePlayerSwap(player) : undefined}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewPlayerCard(player)}
                        className="w-6 h-6 p-0 hover:bg-primary/20 rounded-full flex-shrink-0"
                      >
                        <Info className="w-3 h-3 text-muted-foreground hover:text-primary" />
                      </Button>
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-xs">{['PG', 'SG', 'SF', 'PF', 'C'][index]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground font-medium text-sm truncate">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.position} • OVR {player.overall}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-0.5 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => adjustStarterMinutes(index, -1)}
                        className="w-7 h-7 p-0 hover:bg-red-500/20 rounded"
                      >
                        <Minus className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                      <input 
                        type="number" 
                        value={starterMinutes[index] || 32}
                        onChange={(e) => {
                          const newMinutes = [...starterMinutes];
                          const inputValue = Math.max(0, Math.min(48, parseInt(e.target.value) || 0));
                          const currentTotal = starterMinutes.reduce((a, b) => a + b, 0) + benchMinutes.reduce((a, b) => a + b, 0);
                          const remainingMinutes = 240 - currentTotal;
                          const currentPlayerMinutes = starterMinutes[index] || 0;
                          const maxAllowedMinutes = currentPlayerMinutes + remainingMinutes;
                          
                          newMinutes[index] = Math.min(inputValue, maxAllowedMinutes);
                          setStarterMinutes(newMinutes);
                        }}
                        min="0" 
                        max="48" 
                        className="w-10 px-1 py-0.5 text-xs text-center bg-background border border-border rounded focus:ring-1 focus:ring-primary"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => adjustStarterMinutes(index, 1)}
                        className="w-7 h-7 p-0 hover:bg-green-500/20 rounded"
                      >
                        <Plus className="w-3.5 h-3.5 text-green-500" />
                      </Button>
                      <span className="text-xs text-muted-foreground ml-1">min</span>
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
              <p className="text-sm text-muted-foreground">
                Click on any bench player to promote them to the starting lineup
              </p>
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
                  <div 
                    key={player.id} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                      selectedPlayer?.id === player.id ? 'bg-primary/20 border-2 border-primary' : 'bg-muted hover:bg-muted/70'
                    }`}
                    onClick={() => handlePlayerSwap(player)}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPlayerCard(player);
                        }}
                        className="w-6 h-6 p-0 hover:bg-primary/20 rounded-full flex-shrink-0"
                      >
                        <Info className="w-3 h-3 text-muted-foreground hover:text-primary" />
                      </Button>
                      <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-secondary font-semibold text-xs">{player.jerseyNumber}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-foreground font-medium text-sm truncate">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.position} • OVR {player.overall}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-0.5 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustBenchMinutes(index, -1);
                        }}
                        className="w-7 h-7 p-0 hover:bg-red-500/20 rounded"
                      >
                        <Minus className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                      <input 
                        type="number" 
                        value={benchMinutes[index] || 0}
                        onChange={(e) => {
                          const newMinutes = [...benchMinutes];
                          const inputValue = Math.max(0, Math.min(48, parseInt(e.target.value) || 0));
                          const currentTotal = starterMinutes.reduce((a, b) => a + b, 0) + benchMinutes.reduce((a, b) => a + b, 0);
                          const remainingMinutes = 240 - currentTotal;
                          const currentPlayerMinutes = benchMinutes[index] || 0;
                          const maxAllowedMinutes = currentPlayerMinutes + remainingMinutes;
                          
                          newMinutes[index] = Math.min(inputValue, maxAllowedMinutes);
                          setBenchMinutes(newMinutes);
                        }}
                        min="0" 
                        max="48" 
                        className="w-10 px-1 py-0.5 text-xs text-center bg-background border border-border rounded focus:ring-1 focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustBenchMinutes(index, 1);
                        }}
                        className="w-7 h-7 p-0 hover:bg-green-500/20 rounded"
                      >
                        <Plus className="w-3.5 h-3.5 text-green-500" />
                      </Button>
                      <span className="text-xs text-muted-foreground ml-1">min</span>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Minutes Summary & Controls */}
        <div className="mt-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center justify-between">
                <span>Minutes Summary</span>
                <Button 
                  onClick={allocateBenchMinutes}
                  className="bg-primary hover:bg-primary/90 text-sm"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Auto-Adjust Minutes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className={`text-3xl font-bold mb-1 ${
                    240 - (starterMinutes.reduce((a, b) => a + b, 0) + 
                           benchMinutes.slice(0, benchList.length).reduce((a, b) => a + b, 0)) >= 0 
                    ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {240 - (starterMinutes.reduce((a, b) => a + b, 0) + 
                            benchMinutes.slice(0, benchList.length).reduce((a, b) => a + b, 0))}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Minutes Remaining</div>
                  <div className="text-xs text-muted-foreground mt-1">of 240 total</div>
                </div>
                
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-green-500 mb-1">{startersList.length}</div>
                  <div className="text-sm font-medium text-muted-foreground">Starters</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {starterMinutes.reduce((a, b) => a + b, 0)} min total
                  </div>
                </div>
                
                <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-blue-500 mb-1">{benchList.length}</div>
                  <div className="text-sm font-medium text-muted-foreground">Bench Players</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {benchMinutes.slice(0, benchList.length).reduce((a, b) => a + b, 0)} min total
                  </div>
                </div>
                
                <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                  <div className="text-3xl font-bold text-orange-500 mb-1">
                    {Math.round(((starterMinutes.reduce((a, b) => a + b, 0) + 
                                 benchMinutes.slice(0, benchList.length).reduce((a, b) => a + b, 0)) / 240) * 100)}%
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">Usage</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {starterMinutes.reduce((a, b) => a + b, 0) + benchMinutes.slice(0, benchList.length).reduce((a, b) => a + b, 0)}/240 min
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Player Detail Modal */}
      <PlayerDetailModal 
        player={modalPlayer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}