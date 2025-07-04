import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PlayerCard } from "@/components/player-card";
import { Search, Handshake, DollarSign, Users, Clock } from "lucide-react";
import type { Player, Team } from "@shared/schema";

export function FreeAgency() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("overall");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [contractYears, setContractYears] = useState("1");

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const { data: freeAgents, isLoading } = useQuery({
    queryKey: ["/api/players/free-agents"],
  });

  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches/free-agents"],
  });

  const userTeam = teams?.[0] as Team;

  const signPlayerMutation = useMutation({
    mutationFn: async ({ playerId, salary, years }: { playerId: string; salary: number; years: number }) => {
      return apiRequest(`/api/players/${playerId}`, {
        method: "PUT",
        body: JSON.stringify({
          teamId: userTeam.id,
          salary,
          contractYears: years,
        }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Player Signed",
        description: `${data.name} has been signed to your team!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setSelectedPlayer(null);
      setOfferAmount("");
      setContractYears("1");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to sign player. Check salary cap space.",
        variant: "destructive",
      });
    },
  });

  const handleSignPlayer = () => {
    if (!selectedPlayer || !offerAmount) return;

    const salary = parseFloat(offerAmount) * 1000000; // Convert to actual salary
    const years = parseInt(contractYears);

    signPlayerMutation.mutate({
      playerId: selectedPlayer.id,
      salary,
      years,
    });
  };

  const filteredPlayers = freeAgents?.filter((player: Player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === "all" || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const sortedPlayers = filteredPlayers?.sort((a: Player, b: Player) => {
    switch (sortBy) {
      case "overall":
        return b.overall - a.overall;
      case "age":
        return a.age - b.age;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const positions = ["PG", "SG", "SF", "PF", "C"];

  const formatSalary = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const getSalaryCapSpace = () => {
    if (!userTeam) return 0;
    return userTeam.salaryCap - userTeam.currentSalary;
  };

  const getEstimatedValue = (player: Player) => {
    // Simple formula based on overall rating and age
    const baseValue = player.overall * 0.5; // Base value in millions
    const ageFactor = player.age < 25 ? 1.2 : player.age > 32 ? 0.8 : 1.0;
    return Math.round(baseValue * ageFactor * 10) / 10;
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Free Agency</h1>
            <p className="text-muted-foreground">
              {freeAgents?.length || 0} available players • {formatSalary(getSalaryCapSpace())} cap space
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Available Cap Space</div>
              <div className="text-lg font-semibold text-foreground">
                {formatSalary(getSalaryCapSpace())}
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall Rating</SelectItem>
                  <SelectItem value="age">Age</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Available Players */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Available Players</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded-lg shimmer"></div>
                ))}
              </div>
            ) : sortedPlayers?.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Available Players</h3>
                <p className="text-muted-foreground">
                  No players match your current filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedPlayers?.map((player: Player) => (
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

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Est. Value</div>
                          <div className="text-foreground font-semibold">
                            ${getEstimatedValue(player)}M/yr
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">Free Agent</Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                className="bg-primary hover:bg-primary/90"
                                onClick={() => setSelectedPlayer(player)}
                              >
                                <Handshake className="w-4 h-4 mr-2" />
                                Sign
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Sign {player.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-foreground">
                                      Annual Salary (millions)
                                    </label>
                                    <Input
                                      type="number"
                                      placeholder="e.g., 5.5"
                                      value={offerAmount}
                                      onChange={(e) => setOfferAmount(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-foreground">
                                      Contract Years
                                    </label>
                                    <Select value={contractYears} onValueChange={setContractYears}>
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="1">1 year</SelectItem>
                                        <SelectItem value="2">2 years</SelectItem>
                                        <SelectItem value="3">3 years</SelectItem>
                                        <SelectItem value="4">4 years</SelectItem>
                                        <SelectItem value="5">5 years</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                  <div className="text-sm text-muted-foreground mb-2">Contract Details</div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Annual Salary:</span>
                                      <span className="font-semibold">
                                        ${offerAmount || "0"}M
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total Value:</span>
                                      <span className="font-semibold">
                                        ${((parseFloat(offerAmount) || 0) * parseInt(contractYears)).toFixed(1)}M
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Cap Space After:</span>
                                      <span className="font-semibold">
                                        {formatSalary(getSalaryCapSpace() - ((parseFloat(offerAmount) || 0) * 1000000))}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  onClick={handleSignPlayer}
                                  disabled={signPlayerMutation.isPending || !offerAmount}
                                  className="w-full"
                                >
                                  {signPlayerMutation.isPending ? "Signing..." : "Sign Player"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Free Agent Coaches */}
        {coaches && coaches.length > 0 && (
          <Card className="bg-card border-border mt-8">
            <CardHeader>
              <CardTitle className="text-foreground">Available Coaches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coaches.map((coach: any) => (
                  <div key={coach.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-foreground" />
                        </div>
                        <div>
                          <div className="text-foreground font-semibold">{coach.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {coach.age}yrs • {coach.experience} years exp • OVR {coach.overallRating}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Salary</div>
                          <div className="text-foreground font-semibold">
                            ${(coach.salary / 1000000).toFixed(1)}M/yr
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Handshake className="w-4 h-4 mr-2" />
                          Hire
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
