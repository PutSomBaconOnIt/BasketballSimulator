import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Award, TrendingUp, MessageSquare } from "lucide-react";

export function Coaching() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Coaching Staff</h1>
            <p className="text-muted-foreground">
              Manage your coaching team and strategies
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Users className="w-4 h-4 mr-2" />
            Hire Coach
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Coaching Staff */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Current Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Coaching Staff</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't hired any coaches yet.
                </p>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Browse Available Coaches
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Strategies */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Team Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Active Strategies</h3>
                <p className="text-muted-foreground">
                  Set up team strategies and game plans.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}