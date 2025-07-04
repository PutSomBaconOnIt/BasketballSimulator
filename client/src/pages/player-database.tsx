import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlayerCard } from "@/components/player-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SortAsc } from "lucide-react";
import type { Player, Team } from "@shared/schema";

export function PlayerDatabase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [sortBy, setSortBy] = useState("overall");

  const { data: players, isLoading } = useQuery({
    queryKey: ["/api/players"],
  });

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const filteredPlayers = players?.filter((player: Player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === "all" || player.position === positionFilter;
    const matchesTeam = teamFilter === "all" || player.teamId === teamFilter;
    
    return matchesSearch && matchesPosition && matchesTeam;
  });

  const sortedPlayers = filteredPlayers?.sort((a: Player, b: Player) => {
    switch (sortBy) {
      case "overall":
        return b.overall - a.overall;
      case "age":
        return a.age - b.age;
      case "salary":
        return b.salary - a.salary;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getTeamName = (teamId: string | null) => {
    if (!teamId) return "Free Agent";
    const team = teams?.find((t: Team) => t.id === teamId);
    return team ? `${team.city} ${team.name}` : "Unknown";
  };

  const positions = ["PG", "SG", "SF", "PF", "C"];

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Player Database</h1>
            <p className="text-muted-foreground">
              {players?.length || 0} players • {players?.filter((p: Player) => p.teamId === null).length || 0} free agents
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>{position}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="">Free Agents</SelectItem>
                  {teams?.map((team: Team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.city} {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall Rating</SelectItem>
                  <SelectItem value="age">Age</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Player List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Players</CardTitle>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {sortedPlayers?.length || 0} results
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded-lg shimmer"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedPlayers?.map((player: Player) => (
                  <div key={player.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <PlayerCard player={player} showActions={false} />
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {getTeamName(player.teamId)}
                        </Badge>
                        {player.teamId === null && (
                          <Badge variant="default">Free Agent</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
