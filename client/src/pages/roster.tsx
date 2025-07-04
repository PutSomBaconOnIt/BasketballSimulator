import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { PlayerCard } from "@/components/player-card";
import { PlayerDetailModal } from "@/components/player-detail-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Bus, Calendar } from "lucide-react";
import type { Team, Player, Coach } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function Roster() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const teamFromUrl = urlParams.get('team');

  // Manual data states
  const [manualTeams, setManualTeams] = useState<Team[]>([]);
  const [manualCoaches, setManualCoaches] = useState<Coach[]>([]);

  const [manualPlayers, setManualPlayers] = useState<Player[]>([]);

  // Player detail modal state
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

  const handlePlayerInfo = (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };

  const handleClosePlayerModal = () => {
    setSelectedPlayer(null);
    setIsPlayerModalOpen(false);
  };

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches"],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data: trainings } = useQuery({
    queryKey: ["/api/training"],
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Combined data using manual fallback
  const teamsData = teams || manualTeams;
  const coachesData = coaches || manualCoaches;

  // Get user's team based on URL parameter, default to first team
  const userTeam = teamFromUrl 
    ? teamsData?.find((team: Team) => team.id === teamFromUrl)
    : teamsData?.[0] as Team;

  // Immediate data fetching on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch teams
        const teamsRes = await fetch('/api/teams');
        const teamsData = await teamsRes.json();
        setManualTeams(teamsData);

        // Fetch coaches
        const coachesRes = await fetch('/api/coaches');
        const coachesData = await coachesRes.json();
        setManualCoaches(coachesData);



        // Fetch all players
        const playersRes = await fetch('/api/players');
        const playersData = await playersRes.json();
        setManualPlayers(playersData);

      } catch (err) {
        console.error('Manual data fetch failed:', err);
      }
    };
    
    fetchAllData();
  }, []);

  const { data: players } = useQuery({
    queryKey: ["/api/players/team", userTeam?.id],
    enabled: !!userTeam,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Combined players data
  const playersData = players || manualPlayers;
  
  // Filter players for the current team
  const teamPlayers = playersData?.filter((p: Player) => p.teamId === userTeam?.id) || [];

  // Minimal logging for debugging
  if (teamPlayers && teamPlayers.length > 0) {
    console.log(`Roster - Loaded ${teamPlayers.length} players for ${userTeam?.name}`);
  }

  const { data: games } = useQuery({
    queryKey: ["/api/games/team", userTeam?.id],
    enabled: !!userTeam,
  });

  const simulateGameMutation = useMutation({
    mutationFn: async (gameId: string) => {
      return apiRequest("POST", `/api/games/${gameId}/simulate`);
    },
    onSuccess: () => {
      toast({
        title: "Game Simulated",
        description: "The game has been simulated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to simulate the game.",
        variant: "destructive",
      });
    },
  });

  const nextGame = games?.find((game: any) => 
    game.status === "scheduled" && 
    (game.homeTeamId === userTeam?.id || game.awayTeamId === userTeam?.id)
  );

  const handleSimulateGame = () => {
    if (nextGame) {
      simulateGameMutation.mutate(nextGame.id);
    }
  };

  // Get head coach
  const headCoach = coachesData?.find((coach: Coach) => coach.id === userTeam?.headCoachId);

  // Separate starters and bench
  const starters = teamPlayers?.filter((p: Player) => p.status === "active")
    .sort((a: Player, b: Player) => b.overall - a.overall)
    .slice(0, 5) || [];

  const bench = teamPlayers?.filter((p: Player) => p.status === "active")
    .sort((a: Player, b: Player) => b.overall - a.overall)
    .slice(5) || [];



  return (
    <div className="flex-1 flex flex-col">
      <Header team={userTeam} onSimulateGame={handleSimulateGame} />
      

      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Roster */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Active Roster</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Sort
                    </Button>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Player
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Starting Lineup */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Starting Lineup</h3>
                  <div className="space-y-3">
                    {starters.map((player: Player) => (
                      <PlayerCard 
                        key={player.id} 
                        player={player} 
                        onInfo={() => handlePlayerInfo(player)}
                      />
                    ))}
                  </div>
                </div>

                {/* Bench */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Bench</h3>
                  <div className="space-y-3">
                    {bench.map((player: Player) => (
                      <PlayerCard 
                        key={player.id} 
                        player={player} 
                        onInfo={() => handlePlayerInfo(player)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Next Game */}
            {nextGame && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Next Game</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-foreground font-semibold">@ Warriors</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(nextGame.scheduledDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-foreground font-semibold">82% Win</div>
                        <div className="text-xs text-muted-foreground">Prediction</div>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={handleSimulateGame}
                      disabled={simulateGameMutation.isPending}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {simulateGameMutation.isPending ? "Simulating..." : "Simulate Game"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Coaching Staff */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Coaching Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {headCoach && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Bus className="w-5 h-5 text-foreground" />
                        </div>
                        <div>
                          <div className="text-foreground font-semibold">{headCoach.name}</div>
                          <div className="text-sm text-muted-foreground">Head Coach</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-foreground font-semibold">{headCoach.overallRating}</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  )}
                  {headCoach && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Offense</span>
                        <span className="text-foreground">{headCoach.offenseRating}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Defense</span>
                        <span className="text-foreground">{headCoach.defenseRating}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Player Development</span>
                        <span className="text-foreground">{headCoach.developmentRating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>



            {/* Recent Activity */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <div className="text-foreground text-sm">Won vs Clippers 118-112</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <div className="text-foreground text-sm">Signed Austin Reaves to extension</div>
                      <div className="text-xs text-muted-foreground">1 week ago</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <div className="text-foreground text-sm">Completed trade with Nets</div>
                      <div className="text-xs text-muted-foreground">2 weeks ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <PlayerDetailModal
        player={selectedPlayer}
        isOpen={isPlayerModalOpen}
        onClose={handleClosePlayerModal}
      />
    </div>
  );
}
