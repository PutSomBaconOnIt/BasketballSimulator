import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { PlayerCard } from "@/components/player-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Bus, Dumbbell, Activity, Calendar } from "lucide-react";
import type { Team, Player, Coach, Training } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

export function Roster() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches"],
  });

  const { data: trainings } = useQuery({
    queryKey: ["/api/training"],
  });

  // Get user's team based on selection, default to first team
  const userTeam = teams?.find((team: Team) => team.id === selectedTeamId) || teams?.[0] as Team;

  const { data: players } = useQuery({
    queryKey: ["/api/players/team", userTeam?.id],
    enabled: !!userTeam,
  });

  const { data: games } = useQuery({
    queryKey: ["/api/games/team", userTeam?.id],
    enabled: !!userTeam,
  });

  const simulateGameMutation = useMutation({
    mutationFn: async (gameId: string) => {
      return apiRequest(`/api/games/${gameId}/simulate`, {
        method: "POST",
      });
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
  const headCoach = coaches?.find((coach: Coach) => coach.id === userTeam?.headCoachId);

  // Separate starters and bench
  const starters = players?.filter((p: Player) => p.status === "active")
    .sort((a: Player, b: Player) => b.overall - a.overall)
    .slice(0, 5) || [];

  const bench = players?.filter((p: Player) => p.status === "active")
    .sort((a: Player, b: Player) => b.overall - a.overall)
    .slice(5) || [];

  // Get active training sessions
  const activeTrainings = trainings?.filter((t: Training) => 
    !t.completed && players?.some((p: Player) => p.id === t.playerId)
  ) || [];

  const getTrainingTypeIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Dumbbell className="w-4 h-4 text-primary" />;
      case "shooting":
        return <Activity className="w-4 h-4 text-blue-500" />;
      default:
        return <Dumbbell className="w-4 h-4 text-primary" />;
    }
  };

  const getTrainingImprovement = (type: string) => {
    switch (type) {
      case "strength":
        return "+2 STR";
      case "shooting":
        return "+1 3PT";
      default:
        return "+1 STAT";
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header team={userTeam} onSimulateGame={handleSimulateGame} />
      
      {/* Team Selection */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-foreground">Select Team:</label>
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Choose a team..." />
            </SelectTrigger>
            <SelectContent>
              {teams?.map((team: Team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.city} {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
                      <PlayerCard key={player.id} player={player} />
                    ))}
                  </div>
                </div>

                {/* Bench */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Bench</h3>
                  <div className="space-y-3">
                    {bench.map((player: Player) => (
                      <PlayerCard key={player.id} player={player} />
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

            {/* Training Schedule */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Training Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeTrainings.map((training: Training) => {
                    const player = players?.find((p: Player) => p.id === training.playerId);
                    const daysRemaining = getDaysRemaining(training.endDate);
                    
                    return (
                      <div key={training.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            {getTrainingTypeIcon(training.type)}
                          </div>
                          <div>
                            <div className="text-foreground text-sm font-medium">
                              {training.type.charAt(0).toUpperCase() + training.type.slice(1)} Training
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-400">
                          {getTrainingImprovement(training.type)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Training
                </Button>
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
    </div>
  );
}
