import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, MessageSquare, Target, Clock, Dumbbell, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { Player, Coach } from "@shared/schema";

export function Coaching() {
  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  const { data: coaches, isLoading: coachesLoading } = useQuery({
    queryKey: ["/api/coaches"],
  });

  // Get Lakers players (assuming first team is Lakers)
  const lakersPlayers = players?.filter((p: Player) => p.teamId) || [];
  const headCoach = coaches?.[0];

  // Debug logging
  console.log("Coaching - Coaches data:", coaches);
  console.log("Coaching - Head coach:", headCoach);
  console.log("Coaching - Loading state:", coachesLoading);

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Coaching Department</h1>
            <p className="text-muted-foreground">
              Manage your coaching staff, lineups, and training programs
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Users className="w-4 h-4 mr-2" />
            Hire Assistant Coach
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Head Coach */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Head Coach
              </CardTitle>
            </CardHeader>
            <CardContent>
              {headCoach ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{headCoach.name}</h3>
                      <p className="text-sm text-muted-foreground">Head Coach</p>
                      <Badge variant="secondary" className="mt-1">
                        {headCoach.experience} years experience
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Offensive Rating</label>
                      <div className="flex items-center space-x-2">
                        <Progress value={headCoach.offenseRating} className="flex-1" />
                        <span className="text-sm font-medium">{headCoach.offenseRating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">Defensive Rating</label>
                      <div className="flex items-center space-x-2">
                        <Progress value={headCoach.defenseRating} className="flex-1" />
                        <span className="text-sm font-medium">{headCoach.defenseRating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Contract: ${(headCoach.salary / 1000000).toFixed(1)}M/year</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Head Coach</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to hire a head coach.
                  </p>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Browse Available Coaches
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Coaching Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/coaching/lineup">
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-500" />
                      Manage Lineup & Minutes
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Link to="/coaching/training">
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <Dumbbell className="w-4 h-4 mr-2 text-orange-500" />
                      Training Programs
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                  Team Strategy
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2 text-purple-500" />
                  Game Planning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Overview */}
        <div className="mt-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Team Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{lakersPlayers.length}</div>
                  <div className="text-sm text-muted-foreground">Total Players</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">5</div>
                  <div className="text-sm text-muted-foreground">Starters</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{Math.max(0, lakersPlayers.length - 5)}</div>
                  <div className="text-sm text-muted-foreground">Bench Players</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">0</div>
                  <div className="text-sm text-muted-foreground">Active Training</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}