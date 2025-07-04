import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Target, Shield, Smile, Play } from "lucide-react";
import type { Team, Game } from "@shared/schema";
import { useLocation } from "wouter";

export function Dashboard() {
  const [location] = useLocation();
  const [manualTeams, setManualTeams] = useState<Team[]>([]);
  const [manualGames, setManualGames] = useState<Game[]>([]);
  
  const urlParams = new URLSearchParams(window.location.search);
  const selectedTeamId = urlParams.get('team');

  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ["/api/teams"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: games, isLoading: gamesLoading } = useQuery({
    queryKey: ["/api/games"],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Immediate manual fetch on mount for faster loading
  useEffect(() => {
    const fetchData = async () => {
      if (!teams) {
        try {
          const teamsRes = await fetch('/api/teams');
          const teamsData = await teamsRes.json();
          setManualTeams(teamsData);
        } catch (err) {
          console.error('Manual teams fetch failed:', err);
        }
      }
      
      if (!games) {
        try {
          const gamesRes = await fetch('/api/games');
          const gamesData = await gamesRes.json();
          setManualGames(gamesData);
        } catch (err) {
          console.error('Manual games fetch failed:', err);
        }
      }
    };
    
    fetchData();
  }, []); // Run immediately on mount

  const teamsData = teams || manualTeams;
  const gamesData = games || manualGames;

  // Get user's team based on URL parameter, default to first team
  const userTeam = selectedTeamId 
    ? teamsData?.find((team: Team) => team.id === selectedTeamId)
    : teamsData?.[0] as Team;

  // Minimal logging for debugging
  if (!userTeam) {
    console.log("Dashboard - No team data available yet");
  }

  // Get recent games for user's team
  const recentGames = gamesData?.filter((game: Game) => 
    game.homeTeamId === userTeam?.id || game.awayTeamId === userTeam?.id
  ).slice(-5);

  // Get next game
  const nextGame = gamesData?.find((game: Game) => 
    game.status === "scheduled" && 
    (game.homeTeamId === userTeam?.id || game.awayTeamId === userTeam?.id)
  );

  const getOpponentTeam = (game: Game) => {
    const opponentId = game.homeTeamId === userTeam?.id ? game.awayTeamId : game.homeTeamId;
    return teamsData?.find((t: Team) => t.id === opponentId);
  };

  const getGameResult = (game: Game) => {
    if (game.status !== "completed") return null;
    
    const isHome = game.homeTeamId === userTeam?.id;
    const userScore = isHome ? game.homeScore : game.awayScore;
    const opponentScore = isHome ? game.awayScore : game.homeScore;
    
    return userScore > opponentScore ? "W" : "L";
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header team={userTeam} />
      
      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Team Rating"
            value={userTeam?.overallRating || 0}
            icon={Target}
            color="success"
          />
          <StatsCard
            title="Avg PPG"
            value={userTeam?.avgPointsPerGame.toFixed(1) || "0.0"}
            icon={Target}
            color="primary"
          />
          <StatsCard
            title="Def Rating"
            value={userTeam?.defenseRating || 0}
            icon={Shield}
            color="info"
          />
          <StatsCard
            title="Morale"
            value={userTeam?.teamMorale || 0}
            icon={Smile}
            color="warning"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Games */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGames?.map((game: Game) => {
                  const opponent = getOpponentTeam(game);
                  const result = getGameResult(game);
                  
                  return (
                    <div key={game.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="text-foreground font-medium">
                            {game.homeTeamId === userTeam?.id ? "vs" : "@"} {opponent?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(game.scheduledDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {result && (
                          <Badge variant={result === "W" ? "default" : "destructive"}>
                            {result}
                          </Badge>
                        )}
                        {game.status === "completed" && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {game.homeScore}-{game.awayScore}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Next Game */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Next Game</CardTitle>
            </CardHeader>
            <CardContent>
              {nextGame && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-foreground font-semibold">
                          {nextGame.homeTeamId === userTeam?.id ? "vs" : "@"} {getOpponentTeam(nextGame)?.name}
                        </div>
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
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Play className="w-4 h-4 mr-2" />
                    Simulate Game
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
