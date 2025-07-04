import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Play, 
  Settings, 
  BookOpen,
  Target
} from "lucide-react";

export function MainMenu() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Target className="w-16 h-16 text-orange-500 mr-4" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Basketball Manager
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Take control of your basketball franchise. Build your team, manage players, and lead them to championship glory.
          </p>
        </div>

        {/* Main Menu Options */}
        <div className="max-w-md mx-auto space-y-4">
          <Card className="bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 transition-colors">
            <CardContent className="p-6">
              <Button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 text-lg"
                onClick={() => setLocation('/team-selection')}
              >
                <Play className="w-6 h-6 mr-3" />
                Start New Season
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 transition-colors">
            <CardContent className="p-6">
              <Button 
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-600 py-4 text-lg"
                onClick={() => setLocation('/load-game')}
              >
                <Trophy className="w-6 h-6 mr-3" />
                Load Game
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 transition-colors">
            <CardContent className="p-6">
              <Button 
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-600 py-4 text-lg"
                onClick={() => setLocation('/options')}
              >
                <Settings className="w-6 h-6 mr-3" />
                Options
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 border-slate-700 hover:bg-slate-700/80 transition-colors">
            <CardContent className="p-6">
              <Button 
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-600 py-4 text-lg"
                onClick={() => setLocation('/tutorial')}
              >
                <BookOpen className="w-6 h-6 mr-3" />
                Learn How to Play
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-400">
          <p>© 2025 Basketball Manager - Build Your Championship Dynasty</p>
        </div>
      </div>
    </div>
  );
}