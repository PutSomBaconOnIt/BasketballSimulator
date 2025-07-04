import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useSimulation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const simulateGameMutation = useMutation({
    mutationFn: async (gameId: string) => {
      return apiRequest(`/api/games/${gameId}/simulate`, {
        method: "POST",
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Game Simulated",
        description: `Game completed! Final score: ${data.homeScore}-${data.awayScore}`,
      });
      
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
    },
    onError: (error: any) => {
      toast({
        title: "Simulation Error",
        description: error.message || "Failed to simulate the game.",
        variant: "destructive",
      });
    },
  });

  const simulateTrainingMutation = useMutation({
    mutationFn: async (trainingId: string) => {
      return apiRequest(`/api/training/${trainingId}/complete`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Training Completed",
        description: "Player training has been completed successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
    },
    onError: (error: any) => {
      toast({
        title: "Training Error",
        description: error.message || "Failed to complete training.",
        variant: "destructive",
      });
    },
  });

  const simulateGame = (gameId: string) => {
    simulateGameMutation.mutate(gameId);
  };

  const completeTraining = (trainingId: string) => {
    simulateTrainingMutation.mutate(trainingId);
  };

  return {
    simulateGame,
    completeTraining,
    isSimulatingGame: simulateGameMutation.isPending,
    isCompletingTraining: simulateTrainingMutation.isPending,
  };
}
