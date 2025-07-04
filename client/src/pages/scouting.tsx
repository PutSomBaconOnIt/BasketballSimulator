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
            {/* Search and Filters */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-500" />
                  Player Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search players..."
                      className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <select className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">All Positions</option>
                    <option value="PG">Point Guard</option>
                    <option value="SG">Shooting Guard</option>
                    <option value="SF">Small Forward</option>
                    <option value="PF">Power Forward</option>
                    <option value="C">Center</option>
                  </select>
                  
                  <select className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">All Teams</option>
                    <option value="free-agents">Free Agents</option>
                    <option value="lakers">Lakers</option>
                  </select>
                  
                  <select className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="overall">Sort by Overall</option>
                    <option value="age">Sort by Age</option>
                    <option value="salary">Sort by Salary</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
                
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Player Results</h3>
                  <p className="text-muted-foreground mb-4">
                    Use the filters above to search through all players in the league.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" size="sm">
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Position Filters */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Quick Position Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  <Button variant="outline" size="sm" className="flex flex-col h-16 text-xs">
                    <span className="font-bold">PG</span>
                    <span className="text-xs text-muted-foreground">Point Guards</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col h-16 text-xs">
                    <span className="font-bold">SG</span>
                    <span className="text-xs text-muted-foreground">Shooting Guards</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col h-16 text-xs">
                    <span className="font-bold">SF</span>
                    <span className="text-xs text-muted-foreground">Small Forwards</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col h-16 text-xs">
                    <span className="font-bold">PF</span>
                    <span className="text-xs text-muted-foreground">Power Forwards</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex flex-col h-16 text-xs">
                    <span className="font-bold">C</span>
                    <span className="text-xs text-muted-foreground">Centers</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}