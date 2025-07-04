import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Play, Volleyball } from "lucide-react";
import type { Team } from "@shared/schema";

interface HeaderProps {
  team?: Team;
  onSimulateGame?: () => void;
}

export function Header({ team, onSimulateGame }: HeaderProps) {
  const { data: games } = useQuery({
    queryKey: ["/api/games", team?.id],
    enabled: !!team,
  });

  const nextGame = games?.find((game: any) => 
    game.status === "scheduled" && 
    (game.homeTeamId === team?.id || game.awayTeamId === team?.id)
  );

  const formatSalary = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <header className="bg-card border-b border-border p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Volleyball className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {team?.city} {team?.name}
            </h1>
            <p className="text-muted-foreground">
              {team?.wins}-{team?.losses} • {team?.conference} Conference
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Salary Cap</div>
            <div className="text-lg font-semibold text-foreground">
              {team && (
                <>
                  {formatSalary(team.currentSalary)} / {formatSalary(team.salaryCap)}
                </>
              )}
            </div>
          </div>
          {nextGame && (
            <Button onClick={onSimulateGame} className="bg-primary hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              Simulate Game
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
