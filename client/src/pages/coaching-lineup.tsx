import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Clock, ArrowLeft, Info, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import type { Player } from "@shared/schema";
import { PlayerDetailModal } from "@/components/player-detail-modal";

export function CoachingLineup() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [swapMode, setSwapMode] = useState(false);
  const [startersList, setStartersList] = useState<Player[]>([]);
  const [benchList, setBenchList] = useState<Player[]>([]);
  const [modalPlayer, setModalPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [starterMinutes, setStarterMinutes] = useState<number[]>([32, 35, 30, 36, 34]);
  const [benchMinutes, setBenchMinutes] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  // Fetch players data
  const { data: playersData, isLoading: playersLoading } = useQuery({
    queryKey: ["/api/players"],
    queryFn: async () => {
      const response = await fetch("/api/players");
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      return response.json();
    },
  });

  // Process players data once loaded
  useEffect(() => {
    if (playersData && Array.isArray(playersData)) {
      // Filter Lakers players (players with teamId)
      const lakersPlayers = playersData.filter((p: Player) => p.teamId && p.teamId !== null);
      
      console.log("Lineup - Lakers players:", lakersPlayers);
      
      if (lakersPlayers.length > 0) {
        // Create starting lineup by finding best player for each position
        const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
        const starters: Player[] = [];
        const remainingPlayers = [...lakersPlayers];

        // For each position, find the best available player
        positions.forEach(position => {
          const positionPlayers = remainingPlayers.filter(p => p.position === position);
          if (positionPlayers.length > 0) {
            // Get the highest rated player for this position
            const bestPlayer = positionPlayers.sort((a, b) => b.overall - a.overall)[0];
            starters.push(bestPlayer);
            // Remove from remaining players
            const index = remainingPlayers.findIndex(p => p.id === bestPlayer.id);
            if (index > -1) remainingPlayers.splice(index, 1);
          }
        });

        // If we don't have 5 starters, fill with best remaining players
        while (starters.length < 5 && remainingPlayers.length > 0) {
          const bestRemaining = remainingPlayers.sort((a, b) => b.overall - a.overall)[0];
          starters.push(bestRemaining);
          const index = remainingPlayers.findIndex(p => p.id === bestRemaining.id);
          if (index > -1) remainingPlayers.splice(index, 1);
        }

        // Sort bench players by overall rating (best first) and organize by role priority
        const sortedBenchPlayers = remainingPlayers.sort((a, b) => b.overall - a.overall);
        
        // Create a 10-slot bench array, with better players in active slots (0-6) and lower overall in inactive (7-9)
        const bench = Array(10).fill(null);
        sortedBenchPlayers.forEach((player, index) => {
          if (index < 10) {
            bench[index] = player;
          }
        });

        console.log("Lineup - Starters:", starters);
        console.log("Lineup - Bench:", bench);

        setStartersList(starters);
        setBenchList(bench);
      }
    }
  }, [playersData]);

  const handlePlayerSwap = (player: Player) => {
    if (!swapMode) {
      setSelectedPlayer(player);
      setSwapMode(true);
    } else {
      if (selectedPlayer && selectedPlayer.id !== player.id) {
        // Perform swap logic here
        console.log("Swapping players:", selectedPlayer.name, "with", player.name);
      }
      setSelectedPlayer(null);
      setSwapMode(false);
    }
  };

  const handleViewPlayerCard = (player: Player) => {
    setModalPlayer(player);
    setIsModalOpen(true);
  };

  const adjustMinutes = (playerIndex: number, isStarter: boolean, adjustment: number) => {
    if (isStarter) {
      setStarterMinutes(prev => {
        const newMinutes = [...prev];
        newMinutes[playerIndex] = Math.max(0, Math.min(48, newMinutes[playerIndex] + adjustment));
        return newMinutes;
      });
    } else {
      setBenchMinutes(prev => {
        const newMinutes = [...prev];
        newMinutes[playerIndex] = Math.max(0, Math.min(48, newMinutes[playerIndex] + adjustment));
        return newMinutes;
      });
    }
  };

  const totalStarterMinutes = starterMinutes.reduce((sum, minutes) => sum + minutes, 0);
  const totalBenchMinutes = benchMinutes.reduce((sum, minutes) => sum + minutes, 0);
  const totalMinutes = totalStarterMinutes + totalBenchMinutes;
  const remainingMinutes = 240 - totalMinutes;

  const autoAdjustMinutes = () => {
    // Auto-adjust: starters get 32 minutes each, 6th man gets 20-30 minutes based on position need
    const newStarterMinutes = [32, 32, 32, 32, 32];
    const totalStarterMinutes = 160;
    
    // 6th man gets 25 minutes (middle of 20-30 range)
    const sixthManMinutes = 25;
    
    // Remaining minutes after starters and 6th man
    const remainingAfterSixthMan = 240 - totalStarterMinutes - sixthManMinutes; // 55 minutes left
    
    // Distribute remaining minutes among role players and bench players (slots 1-4)
    const activeRoleAndBenchSlots = 4; // Slots 1-4 (role players + bench players)
    const minutesPerRoleAndBench = activeRoleAndBenchSlots > 0 ? Math.floor(remainingAfterSixthMan / activeRoleAndBenchSlots) : 0;
    
    const newBenchMinutes = Array(10).fill(0).map((_, index) => {
      if (index === 0) return sixthManMinutes; // 6th man gets 25 minutes
      if (index >= 1 && index <= 4) return minutesPerRoleAndBench; // Role players and bench get equal shares
      return 0; // Out of Rotation (slots 5-7) and Inactive (slots 8-9) get 0 minutes
    });
    
    setStarterMinutes(newStarterMinutes);
    setBenchMinutes(newBenchMinutes);
  };

  if (playersLoading) {
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
        
        <h1 className="text-3xl font-bold text-foreground mb-4">Coaching Lineup</h1>
        <p className="text-muted-foreground">Loading player data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link to="/coaching">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Coaching
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={autoAdjustMinutes}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Target className="w-4 h-4 mr-2" />
            Auto-Adjust
          </Button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-8">Manage Playing Time</h1>

      {/* Minutes Summary */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Minutes Remaining</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{remainingMinutes}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Starters</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{startersList.length} ({totalStarterMinutes}m)</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Bench</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{benchList.length} ({totalBenchMinutes}m)</p>
              </div>
              <Info className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Usage</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{Math.round((totalMinutes / 240) * 100)}%</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Starting Lineup */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Starting Lineup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {startersList.map((player, index) => {
              const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
              const expectedPosition = positions[index] || player.position;
              
              return (
                <div key={player.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary">{expectedPosition}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{player.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {player.position} • Overall: {player.overall}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustMinutes(index, true, -1)}
                      className="w-7 h-7 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{starterMinutes[index]}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustMinutes(index, true, 1)}
                      className="w-7 h-7 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePlayerSwap(player)}
                      className={selectedPlayer?.id === player.id ? "bg-blue-100 border-blue-300" : ""}
                    >
                      Move
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewPlayerCard(player)}
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bench Players */}
      <Card>
        <CardHeader>
          <CardTitle>Bench Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(() => {
              const benchRoles = [
                { slot: 0, role: "6th", label: "6th Man" },
                { slot: 1, role: "Role", label: "Role Player" },
                { slot: 2, role: "Role", label: "Role Player" },
                { slot: 3, role: "Bench", label: "Bench Player" },
                { slot: 4, role: "Bench", label: "Bench Player" },
                { slot: 5, role: "DNP", label: "Out of Rotation" },
                { slot: 6, role: "DNP", label: "Out of Rotation" },
                { slot: 7, role: "DNP", label: "Out of Rotation" },
                { slot: 8, role: "Inactive", label: "Inactive" },
                { slot: 9, role: "Inactive", label: "Inactive" }
              ];

              return benchRoles.map((roleInfo) => {
                const player = benchList[roleInfo.slot];
                const roleColors = {
                  "6th": "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
                  "Role": "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", 
                  "Bench": "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
                  "DNP": "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800",
                  "Inactive": "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                };

                return (
                  <div key={roleInfo.slot} className={`flex items-center gap-4 p-4 border rounded-lg ${roleColors[roleInfo.role as keyof typeof roleColors]}`}>
                    <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center">
                      <span className="font-bold text-secondary-foreground text-xs">{roleInfo.role}</span>
                    </div>
                    <div className="flex-1">
                      {player ? (
                        <>
                          <h3 className="font-semibold">{player.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {player.position} • Overall: {player.overall} • {roleInfo.label}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-muted-foreground">Empty Slot</h3>
                          <p className="text-sm text-muted-foreground">{roleInfo.label}</p>
                        </>
                      )}
                    </div>
                    {player && (
                      <>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => adjustMinutes(roleInfo.slot, false, -1)}
                            className="w-7 h-7 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{benchMinutes[roleInfo.slot]}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => adjustMinutes(roleInfo.slot, false, 1)}
                            className="w-7 h-7 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlayerSwap(player)}
                            className={selectedPlayer?.id === player.id ? "bg-blue-100 border-blue-300" : ""}
                          >
                            Move
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewPlayerCard(player)}
                          >
                            <Info className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Player Detail Modal */}
      <PlayerDetailModal
        player={modalPlayer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}