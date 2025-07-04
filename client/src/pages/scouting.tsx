import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Eye, Users, Award } from "lucide-react";

export function Scouting() {
  const [activeTab, setActiveTab] = useState("prospects");

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scouting Department</h1>
            <p className="text-muted-foreground">
              Discover prospects and analyze player data
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Eye className="w-4 h-4 mr-2" />
            New Scout Report
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prospects">Prospects</TabsTrigger>
            <TabsTrigger value="player-database">Player Database</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prospects" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Prospects */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Top Prospects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Prospects Scouted</h3>
                    <p className="text-muted-foreground mb-4">
                      Start scouting to discover promising players.
                    </p>
                    <Button variant="outline">
                      <Search className="w-4 h-4 mr-2" />
                      Begin Scouting
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Scout Reports */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-500" />
                    Recent Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Recent Reports</h3>
                    <p className="text-muted-foreground">
                      Scout reports will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Draft Eligible */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-500" />
                    Draft Eligible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Draft Prospects</h3>
                    <p className="text-muted-foreground">
                      Players eligible for the draft will be listed here.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* International Prospects */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-500" />
                    International
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No International Prospects</h3>
                    <p className="text-muted-foreground">
                      International players to scout.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="player-database" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 gap-8">
              {/* Player Database */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Search className="w-5 h-5 mr-2 text-blue-500" />
                    Player Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Search className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-foreground mb-3">Search All Players</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Browse through all available players in the league. Search by name, position, team, or statistics.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline">
                        <Search className="w-4 h-4 mr-2" />
                        Search Players
                      </Button>
                      <Button variant="outline">
                        <Users className="w-4 h-4 mr-2" />
                        View All Players
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Filters */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Quick Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Button variant="outline" className="flex flex-col h-20">
                      <span className="text-lg font-bold">PG</span>
                      <span className="text-xs">Point Guards</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20">
                      <span className="text-lg font-bold">SG</span>
                      <span className="text-xs">Shooting Guards</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20">
                      <span className="text-lg font-bold">SF</span>
                      <span className="text-xs">Small Forwards</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20">
                      <span className="text-lg font-bold">PF</span>
                      <span className="text-xs">Power Forwards</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-20">
                      <span className="text-lg font-bold">C</span>
                      <span className="text-xs">Centers</span>
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