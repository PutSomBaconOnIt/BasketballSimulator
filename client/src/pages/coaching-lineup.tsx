import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Player } from "@shared/schema";

export function CoachingLineup() {
  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  // Get Lakers players (assuming first team is Lakers)
  const lakersPlayers = players?.filter((p: Player) => p.teamId) || [];
  
  // Define starting lineup with realistic minutes (32-38 minutes)
  const starters = lakersPlayers.slice(0, 5);
  const starterMinutes = [36, 34, 32, 35, 33]; // Realistic starter minutes
  
  // Define bench players with realistic minutes (8-20 minutes)
  const bench = lakersPlayers.slice(5);
  const benchMinutes = [18, 15, 12, 8, 10, 6, 8, 5, 4, 2]; // Realistic bench minutes

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/coaching">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Coaching
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Lineup & Minutes</h1>
              <p className="text-muted-foreground">
                Assign playing time to your starters and bench players
              </p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            Save Lineup Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Starting Lineup */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-500" />
                Starting Lineup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {starters.map((player: Player, index: number) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">{player.jerseyNumber}</span>
                      </div>
                      <div>
                        <div className="text-foreground font-medium">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        defaultValue={starterMinutes[index] || 32}
                        min="0" 
                        max="48" 
                        className="w-16 px-2 py-1 text-sm bg-background border border-border rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bench Players */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Bench Players
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bench.map((player: Player, index: number) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                        <span className="text-secondary font-semibold text-sm">{player.jerseyNumber}</span>
                      </div>
                      <div>
                        <div className="text-foreground font-medium">{player.name}</div>
                        <div className="text-xs text-muted-foreground">{player.position}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        defaultValue={benchMinutes[index] || 10}
                        min="0" 
                        max="48" 
                        className="w-16 px-2 py-1 text-sm bg-background border border-border rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-xs text-muted-foreground">min</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lineup Summary */}
        <div className="mt-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Lineup Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {starterMinutes.reduce((a, b) => a + b, 0) + 
                     benchMinutes.slice(0, bench.length).reduce((a, b) => a + b, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Minutes</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{starters.length}</div>
                  <div className="text-sm text-muted-foreground">Starters</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{bench.length}</div>
                  <div className="text-sm text-muted-foreground">Bench Players</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {Math.round(((starterMinutes.reduce((a, b) => a + b, 0) + 
                                 benchMinutes.slice(0, bench.length).reduce((a, b) => a + b, 0)) / 240) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Rotation Usage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}