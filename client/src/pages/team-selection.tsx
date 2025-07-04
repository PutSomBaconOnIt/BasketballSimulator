import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, Trophy, TrendingUp, DollarSign } from "lucide-react";
import type { Team } from "@shared/schema";

export function TeamSelection() {
  const [, setLocation] = useLocation();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const { data: teams, isLoading } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Remove auto-selection - user must choose

  const selectedTeam = teams?.find((team: Team) => team.id === selectedTeamId);

  const handleStartWithTeam = () => {
    if (selectedTeamId) {
      console.log("Team Selection - Navigating to dashboard with Lakers team:", selectedTeamId);
      setLocation(`/dashboard?team=${selectedTeamId}`);
    }
  };

  console.log("Team Selection - Teams:", teams);
  console.log("Team Selection - Selected Team ID:", selectedTeamId);
  console.log("Team Selection - Selected Team:", selectedTeam);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mr-4 text-white hover:bg-slate-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Main Menu
          </Button>
          <h1 className="text-4xl font-bold">Choose Your Team</h1>
        </div>

        {/* Team Selection */}
        <div className="max-w-md mx-auto mb-8">
          <Card className="bg-slate-800/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-center">Select Your Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a team to manage" />
                </SelectTrigger>
                <SelectContent>
                  {teams?.map((team: Team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.city} {team.name} ({team.wins}-{team.losses})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 text-lg"
                disabled={!selectedTeamId}
                onClick={handleStartWithTeam}
              >
                Start Managing This Team
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Selected Team Info */}
        {selectedTeam && (
          <Card className="bg-slate-800/80 border-slate-700 max-w-md mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">
                {selectedTeam.city} {selectedTeam.name}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                  <span>{selectedTeam.wins}-{selectedTeam.losses}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{selectedTeam.overallRating} Overall</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  <span>{selectedTeam.teamMorale} Morale</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-orange-500" />
                  <span>${(selectedTeam.currentSalary / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}