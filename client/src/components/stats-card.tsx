import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "info";
  subtitle?: string;
}

export function StatsCard({ title, value, icon: Icon, color = "primary", subtitle }: StatsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "success":
        return "bg-green-500/20 text-green-400";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400";
      case "info":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {subtitle && (
              <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(color)}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
