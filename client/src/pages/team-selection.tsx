import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Trophy, TrendingUp, DollarSign } from "lucide-react";
import type { Team } from "@shared/schema";

export function TeamSelection() {
  const [, setLocation] = useLocation();
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const { data: teams, isLoading } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Auto-select Lakers when teams load
  useEffect(() => {
    if (teams && !selectedTeamId) {
      const lakersTeam = teams.find((team: Team) => team.name === "Lakers");
      if (lakersTeam) {
        setSelectedTeamId(lakersTeam.id);
      }
    }
  }, [teams, selectedTeamId]);

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
          <h1 className="text-4xl font-bold">Start Managing the Lakers</h1>
        </div>

        {/* Team Selection */}
        <div className="max-w-2xl mx-auto mb-8">
          {teams?.filter((team: Team) => team.name === "Lakers").map((team: Team) => (
            <Card 
              key={team.id}
              className={`bg-slate-800/80 border-2 cursor-pointer transition-all hover:bg-slate-700/80 ${
                selectedTeamId === team.id 
                  ? 'border-green-500 bg-slate-700/80' 
                  : 'border-slate-700'
              }`}
              onClick={() => setSelectedTeamId(team.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl">{team.city} {team.name}</span>
                  <Badge variant="secondary">{team.conference}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>{team.wins}-{team.losses}</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                    <span>{team.overallRating} Overall</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-500" />
                    <span>{team.teamMorale} Morale</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                    <span>${(team.currentSalary / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-400">
                  <p>Offense: {team.offenseRating} | Defense: {team.defenseRating}</p>
                  <p>Avg Points: {team.avgPointsPerGame} | Allowed: {team.avgPointsAllowed}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Team Info & Action */}
        {selectedTeam && (
          <Card className="bg-slate-800/80 border-slate-700 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Ready to manage the {selectedTeam.city} {selectedTeam.name}?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-slate-300 mb-6">
                Take control of this {selectedTeam.overallRating}-rated team with a {selectedTeam.wins}-{selectedTeam.losses} record. 
                Lead them to championship glory!
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold px-8 py-3 text-lg"
                onClick={handleStartWithTeam}
              >
                Start Managing This Team
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-slate-800/80 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">How to Choose:</h3>
            <ul className="text-slate-300 space-y-2">
              <li>• Click on a team card to select it</li>
              <li>• Review team stats including wins/losses, ratings, and salary</li>
              <li>• Higher overall rating means better players but greater expectations</li>
              <li>• Lower rated teams offer more room for improvement and development</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}