import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { 
  Home, 
  Users, 
  Search, 
  Trophy, 
  ArrowLeftRight, 
  Handshake, 
  BarChart3,
  Zap
} from "lucide-react";

const getNavigation = (teamId?: string) => {
  const teamParam = teamId ? `?team=${teamId}` : '';
  return [
    { name: "Dashboard", href: `/dashboard${teamParam}`, icon: Home },
    { name: "Team Roster", href: `/roster${teamParam}`, icon: Users },
    { name: "Player Database", href: `/players${teamParam}`, icon: Search },
    { name: "Draft Room", href: `/draft${teamParam}`, icon: Trophy },
    { name: "Trades", href: `/trades${teamParam}`, icon: ArrowLeftRight },
    { name: "Free Agency", href: `/free-agency${teamParam}`, icon: Handshake },
    { name: "Statistics", href: `/statistics${teamParam}`, icon: BarChart3 },
  ];
};

export function Sidebar() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const currentTeamId = urlParams.get('team');

  const { data: season } = useQuery({
    queryKey: ["/api/seasons/active"],
  });

  const seasonProgress = season ? ((season as any).currentWeek / (season as any).totalWeeks) * 100 : 0;
  const navigation = getNavigation(currentTeamId || undefined);

  return (
    <div className="w-64 bg-sidebar-bg border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/">
          <div className="flex items-center space-x-3 hover:bg-sidebar-accent rounded-lg p-2 -m-2 transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Basketball Sim</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Season Info */}
      <div className="p-4 border-t border-border">
        <div className="bg-card rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Current Season</div>
          <div className="text-lg font-semibold text-foreground">
            {(season as any)?.year || "2024-25"}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Week {(season as any)?.currentWeek || 12} of {(season as any)?.totalWeeks || 32}
          </div>
          <Progress value={seasonProgress} className="mt-2" />
        </div>
      </div>
    </div>
  );
}
