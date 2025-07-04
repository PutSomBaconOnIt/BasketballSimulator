import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, TrendingUp, Target, Award, Clock, Users, ArrowLeft, Plus } from "lucide-react";
import { Link } from "wouter";

export function CoachingTraining() {
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
              <h1 className="text-2xl font-bold text-foreground">Training Programs</h1>
              <p className="text-muted-foreground">
                Develop your players' skills through specialized training
              </p>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create New Program
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Training Programs */}
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
                  <Plus className="w-4 h-4 mr-2" />
                  Create Training Program
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Training Statistics */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Training Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Training Sessions This Week</span>
                  <span className="text-foreground font-medium">0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Players in Training</span>
                  <span className="text-foreground font-medium">0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed Programs</span>
                  <span className="text-foreground font-medium">0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Skill Improvement</span>
                  <span className="text-foreground font-medium">0%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Training Options */}
        <div className="mt-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Available Training Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <div>
                      <h3 className="font-medium text-foreground">Strength Training</h3>
                      <p className="text-sm text-muted-foreground">Improve player strength and endurance</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground">4 weeks</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="text-foreground">$50K</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">+3 Strength</Badge>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Target className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-foreground">Shooting Practice</h3>
                      <p className="text-sm text-muted-foreground">Enhance shooting accuracy and range</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground">3 weeks</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="text-foreground">$30K</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">+4 Shooting</Badge>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="w-6 h-6 text-purple-500" />
                    <div>
                      <h3 className="font-medium text-foreground">Defense Training</h3>
                      <p className="text-sm text-muted-foreground">Improve defensive skills and positioning</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground">5 weeks</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="text-foreground">$40K</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">+3 Defense</Badge>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="w-6 h-6 text-yellow-500" />
                    <div>
                      <h3 className="font-medium text-foreground">Speed Training</h3>
                      <p className="text-sm text-muted-foreground">Increase player speed and agility</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground">3 weeks</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="text-foreground">$35K</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">+2 Speed</Badge>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="w-6 h-6 text-red-500" />
                    <div>
                      <h3 className="font-medium text-foreground">Team Chemistry</h3>
                      <p className="text-sm text-muted-foreground">Build team cohesion and communication</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground">2 weeks</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="text-foreground">$25K</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">+5 Chemistry</Badge>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <Dumbbell className="w-6 h-6 text-orange-500" />
                    <div>
                      <h3 className="font-medium text-foreground">Endurance Training</h3>
                      <p className="text-sm text-muted-foreground">Boost player stamina and conditioning</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground">4 weeks</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="text-foreground">$45K</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">+3 Endurance</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}