import { storage } from "../storage";
import type { Game, Player, Team, Coach } from "@shared/schema";

export async function simulateGame(gameId: string): Promise<Game> {
  const game = await storage.getGame(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  const homeTeam = await storage.getTeam(game.homeTeamId);
  const awayTeam = await storage.getTeam(game.awayTeamId);
  
  if (!homeTeam || !awayTeam) {
    throw new Error("Teams not found");
  }

  const homePlayers = await storage.getPlayersByTeam(game.homeTeamId);
  const awayPlayers = await storage.getPlayersByTeam(game.awayTeamId);

  // Get coaches
  const homeCoach = homeTeam.headCoachId ? await storage.getCoach(homeTeam.headCoachId) : null;
  const awayCoach = awayTeam.headCoachId ? await storage.getCoach(awayTeam.headCoachId) : null;

  // Calculate team ratings
  const homeTeamRating = calculateTeamRating(homePlayers, homeCoach);
  const awayTeamRating = calculateTeamRating(awayPlayers, awayCoach);

  // Simulate the game
  const result = performGameSimulation(homeTeamRating, awayTeamRating);

  // Update game with results
  const updatedGame = await storage.updateGame(gameId, {
    status: "completed",
    homeScore: result.homeScore,
    awayScore: result.awayScore,
    homeTeamStats: result.homeStats,
    awayTeamStats: result.awayStats,
  });

  // Update team records
  if (result.homeScore > result.awayScore) {
    // Home team wins
    await storage.updateTeam(game.homeTeamId, {
      wins: homeTeam.wins + 1,
    });
    await storage.updateTeam(game.awayTeamId, {
      losses: awayTeam.losses + 1,
    });
  } else {
    // Away team wins
    await storage.updateTeam(game.awayTeamId, {
      wins: awayTeam.wins + 1,
    });
    await storage.updateTeam(game.homeTeamId, {
      losses: homeTeam.losses + 1,
    });
  }

  // Update player stats
  await updatePlayerStats(homePlayers, result.homePlayerStats);
  await updatePlayerStats(awayPlayers, result.awayPlayerStats);

  return updatedGame!;
}

function calculateTeamRating(players: Player[], coach: Coach | null): number {
  if (players.length === 0) return 50;

  // Get starting 5 players (highest overall ratings)
  const starters = players
    .filter(p => p.status === "active")
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 5);

  const baseRating = starters.reduce((sum, player) => sum + player.overall, 0) / 5;
  
  // Apply coaching bonus
  const coachBonus = coach ? (coach.overallRating - 75) * 0.1 : 0;
  
  // Apply team morale (from first player's team)
  const moraleBonus = starters.length > 0 ? (starters[0].morale - 75) * 0.05 : 0;

  return Math.max(0, Math.min(100, baseRating + coachBonus + moraleBonus));
}

function performGameSimulation(homeRating: number, awayRating: number) {
  // Calculate win probability for home team
  const ratingDiff = homeRating - awayRating;
  const homeAdvantage = 3; // Home court advantage
  const adjustedDiff = ratingDiff + homeAdvantage;
  
  // Convert rating difference to win probability
  const winProbability = 0.5 + (adjustedDiff / 100) * 0.3;
  
  // Determine winner
  const homeWins = Math.random() < winProbability;
  
  // Generate realistic scores
  const baseScore = 100;
  const variation = 25;
  
  let homeScore = Math.floor(baseScore + (Math.random() - 0.5) * variation);
  let awayScore = Math.floor(baseScore + (Math.random() - 0.5) * variation);
  
  // Apply rating influence to scores
  homeScore += Math.floor(homeRating * 0.2);
  awayScore += Math.floor(awayRating * 0.2);
  
  // Ensure the right team wins
  if (homeWins && homeScore <= awayScore) {
    homeScore = awayScore + Math.floor(Math.random() * 10) + 1;
  } else if (!homeWins && awayScore <= homeScore) {
    awayScore = homeScore + Math.floor(Math.random() * 10) + 1;
  }

  // Generate team stats
  const homeStats = generateTeamStats(homeScore, homeRating);
  const awayStats = generateTeamStats(awayScore, awayRating);

  // Generate player stats
  const homePlayerStats = generatePlayerStats(5, homeScore);
  const awayPlayerStats = generatePlayerStats(5, awayScore);

  return {
    homeScore,
    awayScore,
    homeStats,
    awayStats,
    homePlayerStats,
    awayPlayerStats,
  };
}

function generateTeamStats(score: number, rating: number) {
  const fieldGoals = Math.floor(score * 0.4 + Math.random() * 10);
  const threePointers = Math.floor(score * 0.12 + Math.random() * 5);
  const rebounds = Math.floor(40 + Math.random() * 20);
  const assists = Math.floor(score * 0.2 + Math.random() * 8);
  const turnovers = Math.floor(12 + Math.random() * 8);

  return {
    fieldGoals,
    threePointers,
    rebounds,
    assists,
    turnovers,
  };
}

function generatePlayerStats(numPlayers: number, teamScore: number) {
  const stats = [];
  let remainingPoints = teamScore;

  for (let i = 0; i < numPlayers; i++) {
    const isLastPlayer = i === numPlayers - 1;
    const maxPoints = isLastPlayer ? remainingPoints : Math.floor(remainingPoints * 0.4);
    const points = Math.floor(Math.random() * maxPoints);
    
    stats.push({
      points,
      rebounds: Math.floor(Math.random() * 12),
      assists: Math.floor(Math.random() * 8),
      steals: Math.floor(Math.random() * 3),
      blocks: Math.floor(Math.random() * 2),
    });

    remainingPoints -= points;
  }

  return stats;
}

async function updatePlayerStats(players: Player[], playerStats: any[]) {
  const starters = players
    .filter(p => p.status === "active")
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 5);

  for (let i = 0; i < Math.min(starters.length, playerStats.length); i++) {
    const player = starters[i];
    const stats = playerStats[i];
    
    const newGamesPlayed = player.gamesPlayed + 1;
    const newPpg = (player.pointsPerGame * player.gamesPlayed + stats.points) / newGamesPlayed;
    const newRpg = (player.reboundsPerGame * player.gamesPlayed + stats.rebounds) / newGamesPlayed;
    const newApg = (player.assistsPerGame * player.gamesPlayed + stats.assists) / newGamesPlayed;

    await storage.updatePlayer(player.id, {
      gamesPlayed: newGamesPlayed,
      pointsPerGame: parseFloat(newPpg.toFixed(1)),
      reboundsPerGame: parseFloat(newRpg.toFixed(1)),
      assistsPerGame: parseFloat(newApg.toFixed(1)),
    });
  }
}

export async function simulateTraining(trainingId: string): Promise<void> {
  const training = await storage.getTraining(trainingId);
  if (!training || training.completed) {
    return;
  }

  const now = new Date();
  if (now >= training.endDate) {
    // Training is complete
    const player = await storage.getPlayer(training.playerId);
    if (!player) return;

    // Apply training improvements
    const improvements: Partial<Player> = {};
    
    switch (training.type) {
      case "strength":
        improvements.rebounding = Math.min(100, player.rebounding + training.ratingImprovement);
        improvements.defense = Math.min(100, player.defense + Math.floor(training.ratingImprovement * 0.5));
        break;
      case "shooting":
        improvements.shooting = Math.min(100, player.shooting + training.ratingImprovement);
        improvements.threePoint = Math.min(100, player.threePoint + training.ratingImprovement);
        break;
      case "defense":
        improvements.defense = Math.min(100, player.defense + training.ratingImprovement);
        break;
      case "speed":
        improvements.speed = Math.min(100, player.speed + training.ratingImprovement);
        break;
      case "endurance":
        improvements.morale = Math.min(100, player.morale + training.ratingImprovement);
        break;
    }

    // Recalculate overall rating
    if (Object.keys(improvements).length > 0) {
      const updatedPlayer = { ...player, ...improvements };
      improvements.overall = calculateOverallRating(updatedPlayer);
      
      await storage.updatePlayer(player.id, improvements);
    }

    // Mark training as completed
    await storage.updateTraining(trainingId, { completed: true });
  }
}

function calculateOverallRating(player: Player): number {
  const weights = {
    offense: 0.25,
    defense: 0.25,
    speed: 0.15,
    shooting: 0.15,
    rebounding: 0.1,
    passing: 0.1,
  };

  return Math.round(
    player.offense * weights.offense +
    player.defense * weights.defense +
    player.speed * weights.speed +
    player.shooting * weights.shooting +
    player.rebounding * weights.rebounding +
    player.passing * weights.passing
  );
}
