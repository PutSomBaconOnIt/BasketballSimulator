import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeftRight } from "lucide-react";
import type { Player } from "@shared/schema";

interface PlayerCardProps {
  player: Player;
  onEdit?: () => void;
  onTrade?: () => void;
  showActions?: boolean;
}

export function PlayerCard({ player, onEdit, onTrade, showActions = true }: PlayerCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 90) return "rating-excellent";
    if (rating >= 80) return "rating-good";
    if (rating >= 70) return "rating-average";
    return "rating-poor";
  };

  const formatSalary = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <Card className="hover-lift cursor-pointer bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <span className="text-foreground font-semibold">{player.jerseyNumber}</span>
            </div>
            <div>
              <div className="text-foreground font-semibold">{player.name}</div>
              <div className="text-sm text-muted-foreground">
                {player.position} • {player.age}yrs • {formatSalary(player.salary)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-white font-semibold ${getRatingColor(player.overall)}`}>
                {player.overall}
              </div>
              <div className="text-xs text-muted-foreground">OVR</div>
            </div>

            <div className="flex space-x-2">
              <div className="text-center">
                <div className={`text-white text-sm ${getRatingColor(player.offense)}`}>
                  {player.offense}
                </div>
                <div className="text-xs text-muted-foreground">OFF</div>
              </div>
              <div className="text-center">
                <div className={`text-white text-sm ${getRatingColor(player.defense)}`}>
                  {player.defense}
                </div>
                <div className="text-xs text-muted-foreground">DEF</div>
              </div>
              <div className="text-center">
                <div className={`text-white text-sm ${getRatingColor(player.speed)}`}>
                  {player.speed}
                </div>
                <div className="text-xs text-muted-foreground">SPD</div>
              </div>
            </div>

            {showActions && (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onTrade}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {player.status !== "active" && (
          <div className="mt-3">
            <Badge variant="destructive">{player.status}</Badge>
          </div>
        )}

        {player.gamesPlayed > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">PPG</div>
              <div className="text-foreground font-semibold">{player.pointsPerGame}</div>
            </div>
            <div>
              <div className="text-muted-foreground">RPG</div>
              <div className="text-foreground font-semibold">{player.reboundsPerGame}</div>
            </div>
            <div>
              <div className="text-muted-foreground">APG</div>
              <div className="text-foreground font-semibold">{player.assistsPerGame}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
