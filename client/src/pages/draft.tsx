import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock } from "lucide-react";

export function Draft() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Draft Room</h1>
            <p className="text-muted-foreground">
              2024 NBA Draft • Round 1, Pick 1
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">Draft in Progress</Badge>
            <Button className="bg-primary hover:bg-primary/90">
              <Trophy className="w-4 h-4 mr-2" />
              Make Pick
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Draft Board */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Available Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Draft System Coming Soon</h3>
                  <p className="text-muted-foreground">
                    The draft system is currently under development. Stay tuned for updates!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Draft Info */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Draft Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-foreground">1</span>
                      </div>
                      <div>
                        <div className="text-foreground font-medium">Los Angeles Lakers</div>
                        <div className="text-sm text-muted-foreground">Your pick</div>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-foreground">2</span>
                      </div>
                      <div>
                        <div className="text-foreground font-medium">Golden State Warriors</div>
                        <div className="text-sm text-muted-foreground">Next up</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Draft History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No picks made yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
