import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/stats-card";
import { 
  BarChart3, 
  Users, 
  Target, 
  Shield, 
  Trophy,
  TrendingUp,
  Calendar,
  Award
} from "lucide-react";
import type { Player, Team, Game } from "@shared/schema";

export function Statistics() {
  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  const { data: games } = useQuery({
    queryKey: ["/api/games"],
  });

  const userTeam = teams?.[0] as Team;

  const { data: userPlayers } = useQuery({
    queryKey: ["/api/players/team", userTeam?.id],
    enabled: !!userTeam,
  });

  const { data: userGames } = useQuery({
    queryKey: ["/api/games/team", userTeam?.id],
    enabled: !!userTeam,
  });

  const completedGames = userGames?.filter((game: Game) => game.status === "completed") || [];

  const getTeamStats = () => {
    if (!userTeam || !completedGames.length) return null;

    const totalGames = completedGames.length;
    const wins = completedGames.filter((game: Game) => {
      const isHome = game.homeTeamId === userTeam.id;
      const userScore = isHome ? game.homeScore : game.awayScore;
      const opponentScore = isHome ? game.awayScore : game.homeScore;
      return userScore > opponentScore;
    }).length;

    const losses = totalGames - wins;
    const winPercentage = ((wins / totalGames) * 100).toFixed(1);

    const totalPoints = completedGames.reduce((sum: number, game: Game) => {
      const isHome = game.homeTeamId === userTeam.id;
      return sum + (isHome ? game.homeScore : game.awayScore);
    }, 0);

    const totalPointsAllowed = completedGames.reduce((sum: number, game: Game) => {
      const isHome = game.homeTeamId === userTeam.id;
      return sum + (isHome ? game.awayScore : game.homeScore);
    }, 0);

    const avgPointsPerGame = (totalPoints / totalGames).toFixed(1);
    const avgPointsAllowed = (totalPointsAllowed / totalGames).toFixed(1);

    return {
      wins,
      losses,
      winPercentage,
      avgPointsPerGame,
      avgPointsAllowed,
      totalGames,
    };
  };

  const getPlayerLeaders = () => {
    if (!userPlayers) return { scoringLeader: null, reboundingLeader: null, assistLeader: null };

    const activePlayers = userPlayers.filter((p: Player) => p.gamesPlayed > 0);

    const scoringLeader = activePlayers.reduce((leader: Player | null, player: Player) => {
      return !leader || player.pointsPerGame > leader.pointsPerGame ? player : leader;
    }, null);

    const reboundingLeader = activePlayers.reduce((leader: Player | null, player: Player) => {
      return !leader || player.reboundsPerGame > leader.reboundsPerGame ? player : leader;
    }, null);

    const assistLeader = activePlayers.reduce((leader: Player | null, player: Player) => {
      return !leader || player.assistsPerGame > leader.assistsPerGame ? player : leader;
    }, null);

    return { scoringLeader, reboundingLeader, assistLeader };
  };

  const getRecentGames = () => {
    return completedGames.slice(-10).reverse();
  };

  const getOpponentTeam = (game: Game) => {
    const opponentId = game.homeTeamId === userTeam?.id ? game.awayTeamId : game.homeTeamId;
    return teams?.find((t: Team) => t.id === opponentId);
  };

  const getGameResult = (game: Game) => {
    const isHome = game.homeTeamId === userTeam?.id;
    const userScore = isHome ? game.homeScore : game.awayScore;
    const opponentScore = isHome ? game.awayScore : game.homeScore;
    return userScore > opponentScore ? "W" : "L";
  };

  const teamStats = getTeamStats();
  const playerLeaders = getPlayerLeaders();
  const recentGames = getRecentGames();

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Statistics</h1>
            <p className="text-muted-foreground">
              Team and player performance analytics
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              Season {userTeam?.wins || 0}-{userTeam?.losses || 0}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="team">Team Stats</TabsTrigger>
            <TabsTrigger value="players">Player Stats</TabsTrigger>
            <TabsTrigger value="games">Game History</TabsTrigger>
          </TabsList>

          <TabsContent value="team" className="space-y-6">
            {/* Team Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard
                title="Win Percentage"
                value={`${teamStats?.winPercentage || 0}%`}
                icon={Trophy}
                color="success"
                subtitle={`${teamStats?.wins || 0}-${teamStats?.losses || 0}`}
              />
              <StatsCard
                title="Points Per Game"
                value={teamStats?.avgPointsPerGame || "0.0"}
                icon={Target}
                color="primary"
              />
              <StatsCard
                title="Points Allowed"
                value={teamStats?.avgPointsAllowed || "0.0"}
                icon={Shield}
                color="info"
              />
              <StatsCard
                title="Games Played"
                value={teamStats?.totalGames || 0}
                icon={Calendar}
                color="warning"
              />
            </div>

            {/* Team Leaders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Scoring Leader</CardTitle>
                </CardHeader>
                <CardContent>
                  {playerLeaders.scoringLeader ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {playerLeaders.scoringLeader.jerseyNumber}
                        </span>
                      </div>
                      <div>
                        <div className="text-foreground font-semibold">
                          {playerLeaders.scoringLeader.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {playerLeaders.scoringLeader.pointsPerGame} PPG
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No games played</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Rebounding Leader</CardTitle>
                </CardHeader>
                <CardContent>
                  {playerLeaders.reboundingLeader ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-green-400 font-semibold">
                          {playerLeaders.reboundingLeader.jerseyNumber}
                        </span>
                      </div>
                      <div>
                        <div className="text-foreground font-semibold">
                          {playerLeaders.reboundingLeader.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {playerLeaders.reboundingLeader.reboundsPerGame} RPG
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No games played</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Assist Leader</CardTitle>
                </CardHeader>
                <CardContent>
                  {playerLeaders.assistLeader ? (
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <span className="text-blue-400 font-semibold">
                          {playerLeaders.assistLeader.jerseyNumber}
                        </span>
                      </div>
                      <div>
                        <div className="text-foreground font-semibold">
                          {playerLeaders.assistLeader.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {playerLeaders.assistLeader.assistsPerGame} APG
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No games played</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Player Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {userPlayers?.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Players</h3>
                    <p className="text-muted-foreground">
                      No players found on your team.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userPlayers?.map((player: Player) => (
                      <div key={player.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                              <span className="text-foreground font-semibold">{player.jerseyNumber}</span>
                            </div>
                            <div>
                              <div className="text-foreground font-semibold">{player.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {player.position} • {player.age}yrs • OVR {player.overall}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-6 text-center">
                            <div>
                              <div className="text-foreground font-semibold">{player.gamesPlayed}</div>
                              <div className="text-xs text-muted-foreground">GP</div>
                            </div>
                            <div>
                              <div className="text-foreground font-semibold">{player.pointsPerGame}</div>
                              <div className="text-xs text-muted-foreground">PPG</div>
                            </div>
                            <div>
                              <div className="text-foreground font-semibold">{player.reboundsPerGame}</div>
                              <div className="text-xs text-muted-foreground">RPG</div>
                            </div>
                            <div>
                              <div className="text-foreground font-semibold">{player.assistsPerGame}</div>
                              <div className="text-xs text-muted-foreground">APG</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Games</CardTitle>
              </CardHeader>
              <CardContent>
                {recentGames.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Games Played</h3>
                    <p className="text-muted-foreground">
                      Game results will appear here once games are simulated.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentGames.map((game: Game) => {
                      const opponent = getOpponentTeam(game);
                      const result = getGameResult(game);
                      const isHome = game.homeTeamId === userTeam?.id;
                      const userScore = isHome ? game.homeScore : game.awayScore;
                      const opponentScore = isHome ? game.awayScore : game.homeScore;
                      
                      return (
                        <div key={game.id} className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Badge variant={result === "W" ? "default" : "destructive"}>
                                {result}
                              </Badge>
                              <div>
                                <div className="text-foreground font-semibold">
                                  {isHome ? "vs" : "@"} {opponent?.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(game.scheduledDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-foreground font-semibold text-lg">
                                {userScore} - {opponentScore}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Final
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
