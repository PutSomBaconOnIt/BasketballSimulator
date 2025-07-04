import { nanoid } from "nanoid";
import type { 
  Player, Team, Coach, Game, Trade, Training, Season, Draft, ContractOffer,
  InsertPlayer, InsertTeam, InsertCoach, InsertGame, InsertTrade, InsertTraining, InsertSeason, InsertDraft, InsertContractOffer
} from "@shared/schema";

export interface IStorage {
  // Players
  getPlayers(): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | null>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, player: Partial<Player>): Promise<Player | null>;
  deletePlayer(id: string): Promise<boolean>;
  getPlayersByTeam(teamId: string): Promise<Player[]>;
  getFreeAgentPlayers(): Promise<Player[]>;
  
  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: string): Promise<Team | null>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, team: Partial<Team>): Promise<Team | null>;
  deleteTeam(id: string): Promise<boolean>;
  
  // Coaches
  getCoaches(): Promise<Coach[]>;
  getCoach(id: string): Promise<Coach | null>;
  createCoach(coach: InsertCoach): Promise<Coach>;
  updateCoach(id: string, coach: Partial<Coach>): Promise<Coach | null>;
  deleteCoach(id: string): Promise<boolean>;
  getFreeAgentCoaches(): Promise<Coach[]>;
  
  // Games
  getGames(): Promise<Game[]>;
  getGame(id: string): Promise<Game | null>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: string, game: Partial<Game>): Promise<Game | null>;
  deleteGame(id: string): Promise<boolean>;
  getGamesByTeam(teamId: string): Promise<Game[]>;
  getGamesBySeason(season: string): Promise<Game[]>;
  
  // Trades
  getTrades(): Promise<Trade[]>;
  getTrade(id: string): Promise<Trade | null>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: string, trade: Partial<Trade>): Promise<Trade | null>;
  deleteTrade(id: string): Promise<boolean>;
  getTradesByTeam(teamId: string): Promise<Trade[]>;
  
  // Training
  getTrainings(): Promise<Training[]>;
  getTraining(id: string): Promise<Training | null>;
  createTraining(training: InsertTraining): Promise<Training>;
  updateTraining(id: string, training: Partial<Training>): Promise<Training | null>;
  deleteTraining(id: string): Promise<boolean>;
  getTrainingsByPlayer(playerId: string): Promise<Training[]>;
  
  // Seasons
  getSeasons(): Promise<Season[]>;
  getSeason(id: string): Promise<Season | null>;
  createSeason(season: InsertSeason): Promise<Season>;
  updateSeason(id: string, season: Partial<Season>): Promise<Season | null>;
  deleteSeason(id: string): Promise<boolean>;
  getActiveSeason(): Promise<Season | null>;
  
  // Draft
  getDrafts(): Promise<Draft[]>;
  getDraft(id: string): Promise<Draft | null>;
  createDraft(draft: InsertDraft): Promise<Draft>;
  updateDraft(id: string, draft: Partial<Draft>): Promise<Draft | null>;
  deleteDraft(id: string): Promise<boolean>;
  getDraftBySeason(season: string): Promise<Draft | null>;
  
  // Contract Offers
  getContractOffers(): Promise<ContractOffer[]>;
  getContractOffer(id: string): Promise<ContractOffer | null>;
  createContractOffer(offer: InsertContractOffer): Promise<ContractOffer>;
  updateContractOffer(id: string, offer: Partial<ContractOffer>): Promise<ContractOffer | null>;
  deleteContractOffer(id: string): Promise<boolean>;
  getContractOffersByPlayer(playerId: string): Promise<ContractOffer[]>;
  getContractOffersByTeam(teamId: string): Promise<ContractOffer[]>;
  getActiveContractOffers(): Promise<ContractOffer[]>;
}

class MemStorage implements IStorage {
  private players: Map<string, Player> = new Map();
  private teams: Map<string, Team> = new Map();
  private coaches: Map<string, Coach> = new Map();
  private games: Map<string, Game> = new Map();
  private trades: Map<string, Trade> = new Map();
  private trainings: Map<string, Training> = new Map();
  private seasons: Map<string, Season> = new Map();
  private drafts: Map<string, Draft> = new Map();
  private contractOffers: Map<string, ContractOffer> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create initial season
    const season: Season = {
      id: nanoid(),
      year: "2024-25",
      currentWeek: 12,
      totalWeeks: 32,
      isActive: true,
      draftCompleted: false,
      playoffsStarted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.seasons.set(season.id, season);

    // Create Lakers team
    const lakersTeam: Team = {
      id: nanoid(),
      name: "Lakers",
      city: "Los Angeles",
      conference: "Western",
      division: "Pacific",
      wins: 15,
      losses: 8,
      overallRating: 87,
      offenseRating: 89,
      defenseRating: 85,
      avgPointsPerGame: 112.4,
      avgPointsAllowed: 108.7,
      salaryCap: 112000000,
      currentSalary: 89200000,
      teamMorale: 83,
      teamChemistry: 81,
      headCoachId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.teams.set(lakersTeam.id, lakersTeam);

    // Create Warriors team
    const warriorsTeam: Team = {
      id: nanoid(),
      name: "Warriors",
      city: "Golden State",
      conference: "Western",
      division: "Pacific",
      wins: 18,
      losses: 5,
      overallRating: 90,
      offenseRating: 93,
      defenseRating: 87,
      avgPointsPerGame: 118.2,
      avgPointsAllowed: 105.3,
      salaryCap: 112000000,
      currentSalary: 95400000,
      teamMorale: 88,
      teamChemistry: 85,
      headCoachId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.teams.set(warriorsTeam.id, warriorsTeam);

    // Create head coach
    const coach: Coach = {
      id: nanoid(),
      name: "Darvin Ham",
      age: 49,
      experience: 3,
      overallRating: 82,
      offenseRating: 85,
      defenseRating: 79,
      developmentRating: 88,
      salary: 3500000,
      contractYears: 3,
      teamId: lakersTeam.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.coaches.set(coach.id, coach);

    // Update Lakers team with coach
    lakersTeam.headCoachId = coach.id;
    this.teams.set(lakersTeam.id, lakersTeam);

    // Create Lakers players with physical measurements
    const lakersPlayers: Player[] = this.createLakersPlayersWithMeasurements(lakersTeam.id);

    lakersPlayers.forEach(player => {
      this.players.set(player.id, player);
    });

    // Create some free agents
    const freeAgents: Player[] = this.createFreeAgentsWithMeasurements();

    freeAgents.forEach(player => {
      this.players.set(player.id, player);
    });

    // Create a scheduled game
    const game: Game = {
      id: nanoid(),
      homeTeamId: warriorsTeam.id,
      awayTeamId: lakersTeam.id,
      homeScore: 0,
      awayScore: 0,
      status: "scheduled",
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      homeTeamStats: {
        fieldGoals: 0,
        threePointers: 0,
        rebounds: 0,
        assists: 0,
        turnovers: 0,
      },
      awayTeamStats: {
        fieldGoals: 0,
        threePointers: 0,
        rebounds: 0,
        assists: 0,
        turnovers: 0,
      },
      season: season.year,
      week: season.currentWeek + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.games.set(game.id, game);

    // Create training sessions
    const trainings: Training[] = [
      {
        id: nanoid(),
        playerId: lakersPlayers[3].id, // Austin Reaves
        type: "strength",
        duration: 7,
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        ratingImprovement: 2,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        playerId: lakersPlayers[4].id, // Rui Hachimura
        type: "shooting",
        duration: 3,
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        ratingImprovement: 1,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    trainings.forEach(training => {
      this.trainings.set(training.id, training);
    });
  }

  // Players
  async getPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayer(id: string): Promise<Player | null> {
    return this.players.get(id) || null;
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const newPlayer: Player = {
      ...player,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.players.set(newPlayer.id, newPlayer);
    return newPlayer;
  }

  async updatePlayer(id: string, player: Partial<Player>): Promise<Player | null> {
    const existing = this.players.get(id);
    if (!existing) return null;

    const updated: Player = {
      ...existing,
      ...player,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.players.set(id, updated);
    return updated;
  }

  async deletePlayer(id: string): Promise<boolean> {
    return this.players.delete(id);
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    return Array.from(this.players.values()).filter(p => p.teamId === teamId);
  }

  async getFreeAgentPlayers(): Promise<Player[]> {
    return Array.from(this.players.values()).filter(p => p.teamId === null);
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }

  async getTeam(id: string): Promise<Team | null> {
    return this.teams.get(id) || null;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const newTeam: Team = {
      ...team,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.teams.set(newTeam.id, newTeam);
    return newTeam;
  }

  async updateTeam(id: string, team: Partial<Team>): Promise<Team | null> {
    const existing = this.teams.get(id);
    if (!existing) return null;

    const updated: Team = {
      ...existing,
      ...team,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.teams.set(id, updated);
    return updated;
  }

  async deleteTeam(id: string): Promise<boolean> {
    return this.teams.delete(id);
  }

  // Coaches
  async getCoaches(): Promise<Coach[]> {
    return Array.from(this.coaches.values());
  }

  async getCoach(id: string): Promise<Coach | null> {
    return this.coaches.get(id) || null;
  }

  async createCoach(coach: InsertCoach): Promise<Coach> {
    const newCoach: Coach = {
      ...coach,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.coaches.set(newCoach.id, newCoach);
    return newCoach;
  }

  async updateCoach(id: string, coach: Partial<Coach>): Promise<Coach | null> {
    const existing = this.coaches.get(id);
    if (!existing) return null;

    const updated: Coach = {
      ...existing,
      ...coach,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.coaches.set(id, updated);
    return updated;
  }

  async deleteCoach(id: string): Promise<boolean> {
    return this.coaches.delete(id);
  }

  async getFreeAgentCoaches(): Promise<Coach[]> {
    return Array.from(this.coaches.values()).filter(c => c.teamId === null);
  }

  // Games
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }

  async getGame(id: string): Promise<Game | null> {
    return this.games.get(id) || null;
  }

  async createGame(game: InsertGame): Promise<Game> {
    const newGame: Game = {
      ...game,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.games.set(newGame.id, newGame);
    return newGame;
  }

  async updateGame(id: string, game: Partial<Game>): Promise<Game | null> {
    const existing = this.games.get(id);
    if (!existing) return null;

    const updated: Game = {
      ...existing,
      ...game,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.games.set(id, updated);
    return updated;
  }

  async deleteGame(id: string): Promise<boolean> {
    return this.games.delete(id);
  }

  async getGamesByTeam(teamId: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(
      g => g.homeTeamId === teamId || g.awayTeamId === teamId
    );
  }

  async getGamesBySeason(season: string): Promise<Game[]> {
    return Array.from(this.games.values()).filter(g => g.season === season);
  }

  // Trades
  async getTrades(): Promise<Trade[]> {
    return Array.from(this.trades.values());
  }

  async getTrade(id: string): Promise<Trade | null> {
    return this.trades.get(id) || null;
  }

  async createTrade(trade: InsertTrade): Promise<Trade> {
    const newTrade: Trade = {
      ...trade,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.trades.set(newTrade.id, newTrade);
    return newTrade;
  }

  async updateTrade(id: string, trade: Partial<Trade>): Promise<Trade | null> {
    const existing = this.trades.get(id);
    if (!existing) return null;

    const updated: Trade = {
      ...existing,
      ...trade,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.trades.set(id, updated);
    return updated;
  }

  async deleteTrade(id: string): Promise<boolean> {
    return this.trades.delete(id);
  }

  async getTradesByTeam(teamId: string): Promise<Trade[]> {
    return Array.from(this.trades.values()).filter(
      t => t.fromTeamId === teamId || t.toTeamId === teamId
    );
  }

  // Training
  async getTrainings(): Promise<Training[]> {
    return Array.from(this.trainings.values());
  }

  async getTraining(id: string): Promise<Training | null> {
    return this.trainings.get(id) || null;
  }

  async createTraining(training: InsertTraining): Promise<Training> {
    const newTraining: Training = {
      ...training,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.trainings.set(newTraining.id, newTraining);
    return newTraining;
  }

  async updateTraining(id: string, training: Partial<Training>): Promise<Training | null> {
    const existing = this.trainings.get(id);
    if (!existing) return null;

    const updated: Training = {
      ...existing,
      ...training,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.trainings.set(id, updated);
    return updated;
  }

  async deleteTraining(id: string): Promise<boolean> {
    return this.trainings.delete(id);
  }

  async getTrainingsByPlayer(playerId: string): Promise<Training[]> {
    return Array.from(this.trainings.values()).filter(t => t.playerId === playerId);
  }

  // Seasons
  async getSeasons(): Promise<Season[]> {
    return Array.from(this.seasons.values());
  }

  async getSeason(id: string): Promise<Season | null> {
    return this.seasons.get(id) || null;
  }

  async createSeason(season: InsertSeason): Promise<Season> {
    const newSeason: Season = {
      ...season,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.seasons.set(newSeason.id, newSeason);
    return newSeason;
  }

  async updateSeason(id: string, season: Partial<Season>): Promise<Season | null> {
    const existing = this.seasons.get(id);
    if (!existing) return null;

    const updated: Season = {
      ...existing,
      ...season,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.seasons.set(id, updated);
    return updated;
  }

  async deleteSeason(id: string): Promise<boolean> {
    return this.seasons.delete(id);
  }

  async getActiveSeason(): Promise<Season | null> {
    const activeSeason = Array.from(this.seasons.values()).find(s => s.isActive);
    return activeSeason || null;
  }

  // Draft
  async getDrafts(): Promise<Draft[]> {
    return Array.from(this.drafts.values());
  }

  async getDraft(id: string): Promise<Draft | null> {
    return this.drafts.get(id) || null;
  }

  async createDraft(draft: InsertDraft): Promise<Draft> {
    const newDraft: Draft = {
      ...draft,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.drafts.set(newDraft.id, newDraft);
    return newDraft;
  }

  async updateDraft(id: string, draft: Partial<Draft>): Promise<Draft | null> {
    const existing = this.drafts.get(id);
    if (!existing) return null;

    const updated: Draft = {
      ...existing,
      ...draft,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.drafts.set(id, updated);
    return updated;
  }

  async deleteDraft(id: string): Promise<boolean> {
    return this.drafts.delete(id);
  }

  async getDraftBySeason(season: string): Promise<Draft | null> {
    const draft = Array.from(this.drafts.values()).find(d => d.season === season);
    return draft || null;
  }

  // Contract Offers
  async getContractOffers(): Promise<ContractOffer[]> {
    return Array.from(this.contractOffers.values());
  }

  async getContractOffer(id: string): Promise<ContractOffer | null> {
    return this.contractOffers.get(id) || null;
  }

  async createContractOffer(offer: InsertContractOffer): Promise<ContractOffer> {
    const newOffer: ContractOffer = {
      ...offer,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.contractOffers.set(newOffer.id, newOffer);
    return newOffer;
  }

  async updateContractOffer(id: string, offer: Partial<ContractOffer>): Promise<ContractOffer | null> {
    const existing = this.contractOffers.get(id);
    if (!existing) return null;

    const updated: ContractOffer = {
      ...existing,
      ...offer,
      id: existing.id,
      updatedAt: new Date(),
    };
    this.contractOffers.set(id, updated);
    return updated;
  }

  async deleteContractOffer(id: string): Promise<boolean> {
    return this.contractOffers.delete(id);
  }

  async getContractOffersByPlayer(playerId: string): Promise<ContractOffer[]> {
    return Array.from(this.contractOffers.values()).filter(offer => offer.playerId === playerId);
  }

  async getContractOffersByTeam(teamId: string): Promise<ContractOffer[]> {
    return Array.from(this.contractOffers.values()).filter(offer => offer.teamId === teamId);
  }

  async getActiveContractOffers(): Promise<ContractOffer[]> {
    const now = new Date();
    return Array.from(this.contractOffers.values()).filter(offer => 
      offer.status === "pending" && offer.offerExpiresAt > now
    );
  }

  private createLakersPlayersWithMeasurements(teamId: string): Player[] {
    return [
      {
        id: nanoid(),
        name: "LeBron James",
        age: 39,
        position: "SF",
        jerseyNumber: 23,
        teamId: teamId,
        salary: 47600000,
        contractYears: 2,
        height: 81, // 6'9"
        weight: 250,
        overall: 89,
        offense: 92,
        defense: 85,
        speed: 78,
        shooting: 87,
        threePoint: 82,
        rebounding: 83,
        passing: 91,
        gamesPlayed: 23,
        pointsPerGame: 24.8,
        reboundsPerGame: 7.2,
        assistsPerGame: 7.8,
        status: "active",
        potential: 89,
        morale: 85,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        name: "Anthony Davis",
        age: 30,
        position: "PF",
        jerseyNumber: 3,
        teamId: teamId,
        salary: 43200000,
        contractYears: 3,
        height: 82, // 6'10"
        weight: 253,
        overall: 91,
        offense: 88,
        defense: 94,
        speed: 82,
        shooting: 78,
        threePoint: 71,
        rebounding: 91,
        passing: 75,
        gamesPlayed: 23,
        pointsPerGame: 26.1,
        reboundsPerGame: 12.3,
        assistsPerGame: 2.8,
        status: "active",
        potential: 91,
        morale: 88,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        name: "D'Angelo Russell",
        age: 27,
        position: "PG",
        jerseyNumber: 11,
        teamId: teamId,
        salary: 18700000,
        contractYears: 2,
        height: 74, // 6'2"
        weight: 193,
        overall: 84,
        offense: 88,
        defense: 79,
        speed: 86,
        shooting: 85,
        threePoint: 87,
        rebounding: 65,
        passing: 82,
        gamesPlayed: 23,
        pointsPerGame: 17.4,
        reboundsPerGame: 3.1,
        assistsPerGame: 6.2,
        status: "active",
        potential: 84,
        morale: 82,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        name: "Austin Reaves",
        age: 25,
        position: "SG",
        jerseyNumber: 5,
        teamId: teamId,
        salary: 12000000,
        contractYears: 4,
        height: 77, // 6'5"
        weight: 197,
        overall: 79,
        offense: 81,
        defense: 76,
        speed: 83,
        shooting: 79,
        threePoint: 81,
        rebounding: 68,
        passing: 77,
        gamesPlayed: 23,
        pointsPerGame: 15.2,
        reboundsPerGame: 4.1,
        assistsPerGame: 5.8,
        status: "active",
        potential: 85,
        morale: 90,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        name: "Rui Hachimura",
        age: 26,
        position: "SF",
        jerseyNumber: 15,
        teamId: teamId,
        salary: 15700000,
        contractYears: 3,
        height: 80, // 6'8"
        weight: 230,
        overall: 77,
        offense: 79,
        defense: 74,
        speed: 81,
        shooting: 76,
        threePoint: 78,
        rebounding: 72,
        passing: 68,
        gamesPlayed: 23,
        pointsPerGame: 13.6,
        reboundsPerGame: 5.2,
        assistsPerGame: 1.4,
        status: "active",
        potential: 82,
        morale: 84,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more Lakers players here...
    ];
  }

  private createFreeAgentsWithMeasurements(): Player[] {
    return [
      {
        id: nanoid(),
        name: "Blake Griffin",
        age: 34,
        position: "PF",
        jerseyNumber: 23,
        teamId: null,
        salary: 0,
        contractYears: 0,
        height: 82, // 6'10"
        weight: 250,
        overall: 75,
        offense: 78,
        defense: 70,
        speed: 68,
        shooting: 72,
        threePoint: 74,
        rebounding: 79,
        passing: 76,
        gamesPlayed: 0,
        pointsPerGame: 0,
        reboundsPerGame: 0,
        assistsPerGame: 0,
        status: "active",
        potential: 75,
        morale: 70,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: nanoid(),
        name: "Dwight Howard",
        age: 38,
        position: "C",
        jerseyNumber: 12,
        teamId: null,
        salary: 0,
        contractYears: 0,
        height: 83, // 6'11"
        weight: 265,
        overall: 72,
        offense: 68,
        defense: 85,
        speed: 65,
        shooting: 58,
        threePoint: 30,
        rebounding: 88,
        passing: 62,
        gamesPlayed: 0,
        pointsPerGame: 0,
        reboundsPerGame: 0,
        assistsPerGame: 0,
        status: "active",
        potential: 72,
        morale: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}

export const storage = new MemStorage();
