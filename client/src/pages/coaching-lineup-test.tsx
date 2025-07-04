import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function CoachingLineupTest() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <Link to="/coaching">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Coaching
          </Button>
        </Link>
      </div>
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Coaching Lineup Test</h1>
        <p className="text-muted-foreground">This is a test page to check if routing works.</p>
        
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Starting Lineup</h2>
            <p>PG - Point Guard</p>
            <p>SG - Shooting Guard</p>
            <p>SF - Small Forward</p>
            <p>PF - Power Forward</p>
            <p>C - Center</p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Bench Players</h2>
            <p>Bench player 1</p>
            <p>Bench player 2</p>
            <p>Bench player 3</p>
            <p>Bench player 4</p>
            <p>Bench player 5</p>
          </div>
        </div>
      </div>
    </div>
  );
}