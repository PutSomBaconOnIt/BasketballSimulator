import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, Award, TrendingUp, MessageSquare, Clock, Dumbbell, Target } from "lucide-react";
import type { Player, Coach } from "@shared/schema";

export function Coaching() {
  const [activeTab, setActiveTab] = useState("staff");

  const { data: players } = useQuery({
    queryKey: ["/api/players"],
  });

  const { data: coaches } = useQuery({
    queryKey: ["/api/coaches"],
  });

  // Get Lakers players (assuming first team is Lakers)
  const lakersPlayers = players?.filter((p: Player) => p.teamId) || [];
  const starters = lakersPlayers.slice(0, 5);
  const bench = lakersPlayers.slice(5);
  const headCoach = coaches?.[0];

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Coaching Staff</h1>
            <p className="text-muted-foreground">
              Manage your coaching team, lineups, and training
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Users className="w-4 h-4 mr-2" />
            Hire Assistant Coach
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="staff">Coaching Staff</TabsTrigger>
            <TabsTrigger value="lineup">Lineup & Minutes</TabsTrigger>
            <TabsTrigger value="training">Training Programs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff" className="space-y-6 mt-6">
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
                            <Progress value={headCoach.offensiveRating} className="flex-1" />
                            <span className="text-sm font-medium">{headCoach.offensiveRating}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-muted-foreground">Defensive Rating</label>
                          <div className="flex items-center space-x-2">
                            <Progress value={headCoach.defensiveRating} className="flex-1" />
                            <span className="text-sm font-medium">{headCoach.defensiveRating}</span>
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

              {/* Assistant Coaches */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Assistant Coaches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Assistant Coaches</h3>
                    <p className="text-muted-foreground mb-4">
                      Hire assistant coaches to improve team performance.
                    </p>
                    <Button variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Hire Assistant Coach
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="lineup" className="space-y-6 mt-6">
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
                            defaultValue={32}
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
                    {bench.map((player: Player) => (
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
                            defaultValue={16}
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
            
            <div className="flex justify-center">
              <Button className="bg-primary hover:bg-primary/90">
                Save Lineup Changes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Training Programs */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Dumbbell className="w-5 h-5 mr-2 text-orange-500" />
                    Active Training Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Active Training</h3>
                    <p className="text-muted-foreground mb-4">
                      Start training programs to improve player skills.
                    </p>
                    <Button variant="outline">
                      <Dumbbell className="w-4 h-4 mr-2" />
                      Create Training Program
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Available Training Types */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Training Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      Strength Training
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2 text-blue-500" />
                      Shooting Practice
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="w-4 h-4 mr-2 text-purple-500" />
                      Defense Training
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                      Speed Training
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2 text-red-500" />
                      Team Chemistry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}