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
        // Sort by position priority for starting lineup
        const positionOrder = { PG: 1, SG: 2, SF: 3, PF: 4, C: 5 };
        const sortedPlayers = lakersPlayers.sort((a: Player, b: Player) => {
          const aPos = positionOrder[a.position as keyof typeof positionOrder] || 6;
          const bPos = positionOrder[b.position as keyof typeof positionOrder] || 6;
          if (aPos !== bPos) return aPos - bPos;
          return b.overall - a.overall; // Higher overall rating first
        });

        // Set starters (top 5 players by position)
        const starters = sortedPlayers.slice(0, 5);
        const bench = sortedPlayers.slice(5);

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
    // Simple auto-adjustment: give starters 32 minutes each, distribute rest to bench
    const newStarterMinutes = [32, 32, 32, 32, 32];
    const remainingForBench = 240 - 160; // 80 minutes for bench
    const benchCount = benchList.length;
    const minutesPerBench = benchCount > 0 ? Math.floor(remainingForBench / benchCount) : 0;
    
    const newBenchMinutes = benchList.map(() => minutesPerBench);
    
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
    <div className="min-h-screen bg-background p-6">
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
            {startersList.map((player, index) => (
              <div key={player.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="font-bold text-primary">{player.position}</span>
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
            ))}
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
            {benchList.map((player, index) => (
              <div key={player.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center">
                  <span className="font-bold text-secondary-foreground">{player.position}</span>
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
                    onClick={() => adjustMinutes(index, false, -1)}
                    className="w-7 h-7 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{benchMinutes[index]}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustMinutes(index, false, 1)}
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
            ))}
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