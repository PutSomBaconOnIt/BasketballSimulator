import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PlayerCard } from "@/components/player-card";
import { Search, Handshake, DollarSign, Users, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import type { Player, Team, ContractOffer } from "@shared/schema";

export function FreeAgency() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("overall");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [contractYears, setContractYears] = useState("1");
  const [contractType, setContractType] = useState("veteran");
  const [signingBonus, setSigningBonus] = useState("");
  const [teamOption, setTeamOption] = useState(false);
  const [playerOption, setPlayerOption] = useState(false);
  const [noTradeClause, setNoTradeClause] = useState(false);

  // Manual data states for fast loading
  const [manualTeams, setManualTeams] = useState<Team[]>([]);
  const [manualPlayers, setManualPlayers] = useState<Player[]>([]);

  // Use pre-loaded data from main menu with longer cache times
  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
    staleTime: 1000 * 60 * 10, // 10 minutes - should be pre-loaded
    refetchOnWindowFocus: false,
  });

  // Get all players and filter for free agents (more efficient than separate endpoint)
  const { data: allPlayers, isLoading: playersLoading } = useQuery({
    queryKey: ["/api/players"],
    staleTime: 1000 * 60 * 10, // 10 minutes - should be pre-loaded
    refetchOnWindowFocus: false,
  });

  const { data: contractOffers } = useQuery({
    queryKey: ["/api/contract-offers/active"],
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  // Only fetch manually if React Query doesn't have data (fallback)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!teams) {
          const teamsRes = await fetch('/api/teams');
          const teamsData = await teamsRes.json();
          setManualTeams(teamsData);
        }

        if (!allPlayers) {
          const playersRes = await fetch('/api/players');
          const playersData = await playersRes.json();
          setManualPlayers(playersData);
        }
      } catch (err) {
        console.error('Manual data fetch failed:', err);
      }
    };
    
    fetchData();
  }, [teams, allPlayers]); // Only fetch if data is missing

  // Combined data with free agent filtering
  const teamsData = teams || manualTeams;
  const allPlayersData = allPlayers || manualPlayers;
  const playersData = allPlayersData?.filter(p => p.teamId === null); // Filter for free agents
  const isLoading = playersLoading && !allPlayersData;
  
  const userTeam = teamsData?.[0] as Team;

  const createOfferMutation = useMutation({
    mutationFn: async (offerData: any) => {
      return apiRequest("POST", "/api/contract-offers", offerData);
    },
    onSuccess: () => {
      toast({
        title: "Contract Offer Sent",
        description: `Contract offer sent to ${selectedPlayer?.name}!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contract-offers"] });
      setSelectedPlayer(null);
      resetOfferForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send contract offer.",
        variant: "destructive",
      });
    },
  });

  const resetOfferForm = () => {
    setOfferAmount("");
    setContractYears("1");
    setContractType("veteran");
    setSigningBonus("");
    setTeamOption(false);
    setPlayerOption(false);
    setNoTradeClause(false);
  };

  const calculateSalaryCap = () => {
    if (!userTeam) return { remaining: 0, percentage: 0 };
    const remaining = userTeam.salaryCap - userTeam.currentSalary;
    const percentage = (userTeam.currentSalary / userTeam.salaryCap) * 100;
    return { remaining, percentage };
  };

  const validateOffer = () => {
    if (!selectedPlayer || !offerAmount || !userTeam) return false;
    
    const annualSalary = parseFloat(offerAmount) * 1000000;
    const { remaining } = calculateSalaryCap();
    
    return annualSalary <= remaining;
  };

  const handleSendOffer = () => {
    if (!selectedPlayer || !offerAmount || !userTeam) return;

    const annualSalary = parseFloat(offerAmount) * 1000000;
    const years = parseInt(contractYears);
    const bonus = parseFloat(signingBonus) * 1000000 || 0;
    const totalValue = (annualSalary * years) + bonus;

    if (!validateOffer()) {
      toast({
        title: "Salary Cap Exceeded",
        description: "This offer would exceed your salary cap space.",
        variant: "destructive",
      });
      return;
    }

    const offerData = {
      playerId: selectedPlayer.id,
      teamId: userTeam.id,
      contractType,
      yearsOffered: years,
      totalValue,
      annualSalary,
      signingBonus: bonus,
      teamOption,
      playerOption,
      noTradeClause,
      offerExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    createOfferMutation.mutate(offerData);
  };

  const filteredPlayers = playersData?.filter((player: Player) => {
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
              {playersData?.length || 0} available players • {formatSalary(getSalaryCapSpace())} cap space
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
                                Negotiate
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Contract Negotiation - {player.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Player Info */}
                                <div className="p-4 bg-muted rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold">{player.jerseyNumber}</span>
                                      </div>
                                      <div>
                                        <div className="font-semibold">{player.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {player.position} • {player.age}yrs • OVR {player.overall}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-muted-foreground">Market Value</div>
                                      <div className="font-semibold">${getEstimatedValue(player)}M/yr</div>
                                    </div>
                                  </div>
                                </div>

                                {/* Salary Cap Info */}
                                <div className="p-4 bg-muted rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <DollarSign className="w-4 h-4 text-green-500" />
                                      <span className="font-medium">Salary Cap Status</span>
                                    </div>
                                    <span className={`text-sm font-medium ${validateOffer() ? 'text-green-500' : 'text-red-500'}`}>
                                      {validateOffer() ? 
                                        <div className="flex items-center space-x-1">
                                          <CheckCircle className="w-4 h-4" />
                                          <span>Valid Offer</span>
                                        </div> : 
                                        <div className="flex items-center space-x-1">
                                          <AlertTriangle className="w-4 h-4" />
                                          <span>Exceeds Cap</span>
                                        </div>
                                      }
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>Available Cap Space:</span>
                                      <span className="font-semibold">{formatSalary(getSalaryCapSpace())}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span>Cap Space After Signing:</span>
                                      <span className={`font-semibold ${
                                        getSalaryCapSpace() - ((parseFloat(offerAmount) || 0) * 1000000) >= 0 
                                          ? 'text-green-500' 
                                          : 'text-red-500'
                                      }`}>
                                        {formatSalary(getSalaryCapSpace() - ((parseFloat(offerAmount) || 0) * 1000000))}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Contract Terms */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Annual Salary (millions)</Label>
                                    <Input
                                      type="number"
                                      placeholder="e.g., 5.5"
                                      value={offerAmount}
                                      onChange={(e) => setOfferAmount(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Contract Years</Label>
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

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Contract Type</Label>
                                    <Select value={contractType} onValueChange={setContractType}>
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="rookie">Rookie</SelectItem>
                                        <SelectItem value="veteran">Veteran</SelectItem>
                                        <SelectItem value="max">Max Contract</SelectItem>
                                        <SelectItem value="minimum">Minimum</SelectItem>
                                        <SelectItem value="extension">Extension</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Signing Bonus (millions)</Label>
                                    <Input
                                      type="number"
                                      placeholder="e.g., 2.0"
                                      value={signingBonus}
                                      onChange={(e) => setSigningBonus(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>

                                {/* Contract Options */}
                                <div className="space-y-3">
                                  <Label className="text-sm font-medium">Contract Options</Label>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        id="team-option"
                                        checked={teamOption}
                                        onCheckedChange={(checked) => setTeamOption(checked === true)}
                                      />
                                      <Label htmlFor="team-option" className="text-sm">
                                        Team Option (Final Year)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        id="player-option"
                                        checked={playerOption}
                                        onCheckedChange={(checked) => setPlayerOption(checked === true)}
                                      />
                                      <Label htmlFor="player-option" className="text-sm">
                                        Player Option (Final Year)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox 
                                        id="no-trade"
                                        checked={noTradeClause}
                                        onCheckedChange={(checked) => setNoTradeClause(checked === true)}
                                      />
                                      <Label htmlFor="no-trade" className="text-sm">
                                        No-Trade Clause
                                      </Label>
                                    </div>
                                  </div>
                                </div>

                                {/* Contract Summary */}
                                <div className="p-4 bg-muted rounded-lg">
                                  <div className="text-sm text-muted-foreground mb-2">Contract Summary</div>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Annual Salary:</span>
                                      <span className="font-semibold">${offerAmount || "0"}M</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Signing Bonus:</span>
                                      <span className="font-semibold">${signingBonus || "0"}M</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total Contract Value:</span>
                                      <span className="font-semibold">
                                        ${(((parseFloat(offerAmount) || 0) * parseInt(contractYears)) + (parseFloat(signingBonus) || 0)).toFixed(1)}M
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Average Annual Value:</span>
                                      <span className="font-semibold">
                                        ${(((parseFloat(offerAmount) || 0) * parseInt(contractYears)) / parseInt(contractYears)).toFixed(1)}M
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex space-x-2">
                                  <Button 
                                    onClick={handleSendOffer}
                                    disabled={createOfferMutation.isPending || !offerAmount || !validateOffer()}
                                    className="flex-1"
                                  >
                                    {createOfferMutation.isPending ? "Sending..." : "Send Offer"}
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => setSelectedPlayer(null)}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                </div>
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

        {/* Active Contract Offers */}
        {contractOffers && contractOffers.length > 0 && (
          <Card className="bg-card border-border mt-8">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Active Contract Offers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contractOffers.map((offer: ContractOffer) => (
                  <div key={offer.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                          <Handshake className="w-6 h-6 text-foreground" />
                        </div>
                        <div>
                          <div className="text-foreground font-semibold">
                            {playersData?.find((p: Player) => p.id === offer.playerId)?.name || 'Unknown Player'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${(offer.annualSalary / 1000000).toFixed(1)}M/yr • {offer.yearsOffered} years
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Status</div>
                          <div className="text-foreground font-semibold">
                            <Badge variant={offer.status === 'pending' ? 'secondary' : 'default'}>
                              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Total Value</div>
                          <div className="text-foreground font-semibold">
                            ${(offer.totalValue / 1000000).toFixed(1)}M
                          </div>
                        </div>
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
