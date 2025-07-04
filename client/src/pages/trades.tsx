import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Plus, Clock } from "lucide-react";

export function Trades() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trade Center</h1>
            <p className="text-muted-foreground">
              Manage trades and negotiations
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Propose Trade
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Trades */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Active Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ArrowLeftRight className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Active Trades</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any active trade proposals at the moment.
                </p>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Trade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trade History */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Trade History</h3>
                <p className="text-muted-foreground">
                  Your completed trades will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
