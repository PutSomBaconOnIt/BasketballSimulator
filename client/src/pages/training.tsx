import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertTrainingSchema } from "@shared/schema";
import { Dumbbell, Plus, Clock, Target, Activity, Zap, Shield, Heart } from "lucide-react";
import type { Player, Training, Team } from "@shared/schema";
import { z } from "zod";

const trainingFormSchema = insertTrainingSchema.extend({
  duration: z.number().min(1).max(30),
});

export function Training() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  const userTeam = teams?.[0] as Team;

  const { data: players } = useQuery({
    queryKey: ["/api/players/team", userTeam?.id],
    enabled: !!userTeam,
  });

  const { data: trainings } = useQuery({
    queryKey: ["/api/training"],
  });

  const form = useForm<z.infer<typeof trainingFormSchema>>({
    resolver: zodResolver(trainingFormSchema),
    defaultValues: {
      playerId: "",
      type: "strength",
      duration: 7,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ratingImprovement: 2,
      completed: false,
    },
  });

  const createTrainingMutation = useMutation({
    mutationFn: async (data: z.infer<typeof trainingFormSchema>) => {
      return apiRequest("/api/training", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Training Scheduled",
        description: "Training session has been scheduled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule training session.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof trainingFormSchema>) => {
    createTrainingMutation.mutate(data);
  };

  const getTrainingIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Dumbbell className="w-5 h-5" />;
      case "shooting":
        return <Target className="w-5 h-5" />;
      case "defense":
        return <Shield className="w-5 h-5" />;
      case "speed":
        return <Zap className="w-5 h-5" />;
      case "endurance":
        return <Heart className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getTrainingColor = (type: string) => {
    switch (type) {
      case "strength":
        return "bg-red-500/20 text-red-400";
      case "shooting":
        return "bg-blue-500/20 text-blue-400";
      case "defense":
        return "bg-green-500/20 text-green-400";
      case "speed":
        return "bg-yellow-500/20 text-yellow-400";
      case "endurance":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  const getTrainingImprovement = (type: string) => {
    switch (type) {
      case "strength":
        return "+2 REB";
      case "shooting":
        return "+2 SHT";
      case "defense":
        return "+2 DEF";
      case "speed":
        return "+2 SPD";
      case "endurance":
        return "+2 MOR";
      default:
        return "+1 STAT";
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const getPlayerName = (playerId: string) => {
    const player = players?.find((p: Player) => p.id === playerId);
    return player?.name || "Unknown Player";
  };

  const activeTrainings = trainings?.filter((t: Training) => 
    !t.completed && players?.some((p: Player) => p.id === t.playerId)
  ) || [];

  const completedTrainings = trainings?.filter((t: Training) => 
    t.completed && players?.some((p: Player) => p.id === t.playerId)
  ) || [];

  const availablePlayers = players?.filter((p: Player) => 
    p.status === "active" && !activeTrainings.some((t: Training) => t.playerId === p.id)
  ) || [];

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Training Center</h1>
            <p className="text-muted-foreground">
              Manage player development and training sessions
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Training
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule Training Session</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="playerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Player</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a player" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availablePlayers.map((player: Player) => (
                              <SelectItem key={player.id} value={player.id}>
                                {player.name} - {player.position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Training Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select training type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="strength">Strength Training</SelectItem>
                            <SelectItem value="shooting">Shooting Drills</SelectItem>
                            <SelectItem value="defense">Defense Training</SelectItem>
                            <SelectItem value="speed">Speed Training</SelectItem>
                            <SelectItem value="endurance">Endurance Training</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (days)</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="7">1 week</SelectItem>
                            <SelectItem value="14">2 weeks</SelectItem>
                            <SelectItem value="30">1 month</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createTrainingMutation.isPending}>
                    {createTrainingMutation.isPending ? "Scheduling..." : "Schedule Training"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Training Sessions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Active Training Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {activeTrainings.length === 0 ? (
                <div className="text-center py-8">
                  <Dumbbell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Active Training</h3>
                  <p className="text-muted-foreground mb-4">
                    Schedule training sessions to improve player ratings.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Training
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeTrainings.map((training: Training) => {
                    const daysRemaining = getDaysRemaining(training.endDate);
                    const progress = ((training.duration - daysRemaining) / training.duration) * 100;
                    
                    return (
                      <div key={training.id} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTrainingColor(training.type)}`}>
                              {getTrainingIcon(training.type)}
                            </div>
                            <div>
                              <div className="text-foreground font-semibold">
                                {getPlayerName(training.playerId)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {training.type.charAt(0).toUpperCase() + training.type.slice(1)} Training
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-green-400">
                              {getTrainingImprovement(training.type)}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground">
                              {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining
                            </span>
                          </div>
                          <div className="w-full bg-muted-foreground/20 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Training History */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Training History</CardTitle>
            </CardHeader>
            <CardContent>
              {completedTrainings.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Training History</h3>
                  <p className="text-muted-foreground">
                    Completed training sessions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedTrainings.slice(0, 10).map((training: Training) => (
                    <div key={training.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTrainingColor(training.type)}`}>
                            {getTrainingIcon(training.type)}
                          </div>
                          <div>
                            <div className="text-foreground font-medium">
                              {getPlayerName(training.playerId)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {training.type.charAt(0).toUpperCase() + training.type.slice(1)} Training
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-green-400">
                            {getTrainingImprovement(training.type)}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">
                            Completed
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Available Players */}
        <Card className="bg-card border-border mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">Available for Training</CardTitle>
          </CardHeader>
          <CardContent>
            {availablePlayers.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">All Players Busy</h3>
                <p className="text-muted-foreground">
                  All active players are currently in training sessions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availablePlayers.map((player: Player) => (
                  <div key={player.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">{player.jerseyNumber}</span>
                        </div>
                        <div>
                          <div className="text-foreground font-semibold">{player.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {player.position} • OVR {player.overall}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          form.setValue("playerId", player.id);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
