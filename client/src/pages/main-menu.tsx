import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy, 
  Users, 
  BarChart3, 
  Play, 
  Settings,
  Star,
  TrendingUp,
  Calendar,
  Award
} from "lucide-react";
import type { Team } from "@shared/schema";

export function MainMenu() {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [manualTeams, setManualTeams] = useState<Team[]>([]);

  const { data: teams, isLoading, error } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Fallback manual data fetch
  useEffect(() => {
    if (!teams && !isLoading) {
      fetch('/api/teams')
        .then(res => res.json())
        .then(data => setManualTeams(data))
        .catch(err => console.error('Manual fetch failed:', err));
    }
  }, [teams, isLoading]);

  const teamsData = teams || manualTeams;
  const selectedTeam = teamsData?.find((team: Team) => team.id === selectedTeamId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Game Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500 mr-4" />
            <h1 className="text-6xl font-bold text-white">
              Basketball
              <span className="text-yellow-500"> Sim</span>
            </h1>
            <Trophy className="w-12 h-12 text-yellow-500 ml-4" />
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Experience the ultimate basketball management simulation. Build your dynasty, 
            manage your roster, and lead your team to championship glory.
          </p>
        </div>

        {/* Main Menu Card */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white flex items-center justify-center">
              <Play className="w-8 h-8 mr-3 text-green-500" />
              Choose Your Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Team Selection */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="max-w-md mx-auto">
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select your team to manage..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {isLoading ? (
                        <SelectItem value="loading" disabled className="text-slate-400">
                          Loading teams...
                        </SelectItem>
                      ) : teamsData && teamsData.length > 0 ? (
                        teamsData.map((team: Team) => (
                          <SelectItem 
                            key={team.id} 
                            value={team.id} 
                            className="text-white hover:bg-slate-600 focus:bg-slate-600 focus:text-white"
                          >
                            {team.city} {team.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-teams" disabled className="text-slate-400">
                          No teams available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selected Team Info */}
              {selectedTeam && (
                <Card className="bg-slate-700/50 border-slate-600 max-w-md mx-auto">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-center">
                      {selectedTeam.city} {selectedTeam.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-slate-400">Record</div>
                        <div className="text-white font-semibold">
                          {selectedTeam.wins}-{selectedTeam.losses}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400">Rating</div>
                        <div className="text-white font-semibold flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {selectedTeam.overallRating}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-slate-400">PPG</div>
                        <div className="text-green-400 font-semibold">
                          {selectedTeam.avgPointsPerGame}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-slate-400">Opp PPG</div>
                        <div className="text-red-400 font-semibold">
                          {selectedTeam.avgPointsAllowed}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Game Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Card className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-6 h-6 text-blue-500" />
                    <h3 className="text-white font-semibold">Team Management</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Manage your roster, set lineups, and develop players through training programs.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-green-500" />
                    <h3 className="text-white font-semibold">Game Simulation</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Simulate games with realistic outcomes based on player ratings and team chemistry.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                    <h3 className="text-white font-semibold">Player Development</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Train players to improve their skills and unlock their full potential.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-white font-semibold">Championships</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Compete for playoff spots and championships in a full season simulation.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <Link href="/dashboard" className="flex-1">
                <Button 
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3"
                  disabled={!selectedTeamId}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Managing
                </Button>
              </Link>
              
              <Link href="/roster" className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full border-slate-600 text-white hover:bg-slate-700 py-3"
                  disabled={!selectedTeamId}
                >
                  <Users className="w-5 h-5 mr-2" />
                  View Roster
                </Button>
              </Link>
            </div>

            {!selectedTeamId && (
              <p className="text-center text-slate-400 text-sm mt-4">
                Select a team above to begin your management career
              </p>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400">
          <p>Build your legacy. Manage your dynasty. Win championships.</p>
        </div>
      </div>
    </div>
  );
}