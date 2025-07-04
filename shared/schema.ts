import { z } from "zod";

// Enums
export const Position = z.enum(["PG", "SG", "SF", "PF", "C"]);
export const PlayerStatus = z.enum(["active", "injured", "suspended", "retired"]);
export const GameStatus = z.enum(["scheduled", "in_progress", "completed"]);
export const TradeStatus = z.enum(["pending", "accepted", "rejected", "completed"]);
export const TrainingType = z.enum(["strength", "shooting", "defense", "speed", "endurance"]);
export const ContractOfferStatus = z.enum(["pending", "accepted", "rejected", "expired", "withdrawn"]);
export const ContractType = z.enum(["rookie", "veteran", "max", "minimum", "extension"]);

// Player Schema
export const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().min(18).max(45),
  position: Position,
  jerseyNumber: z.number().min(0).max(99),
  teamId: z.string().nullable(),
  salary: z.number().min(0),
  contractYears: z.number().min(0).max(10),
  
  // Ratings (0-100)
  overall: z.number().min(0).max(100),
  offense: z.number().min(0).max(100),
  defense: z.number().min(0).max(100),
  speed: z.number().min(0).max(100),
  shooting: z.number().min(0).max(100),
  threePoint: z.number().min(0).max(100),
  rebounding: z.number().min(0).max(100),
  passing: z.number().min(0).max(100),
  
  // Stats
  gamesPlayed: z.number().min(0).default(0),
  pointsPerGame: z.number().min(0).default(0),
  reboundsPerGame: z.number().min(0).default(0),
  assistsPerGame: z.number().min(0).default(0),
  
  status: PlayerStatus.default("active"),
  potential: z.number().min(0).max(100),
  morale: z.number().min(0).max(100).default(75),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Team Schema
export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  conference: z.enum(["Eastern", "Western"]),
  division: z.string(),
  
  // Season record
  wins: z.number().min(0).default(0),
  losses: z.number().min(0).default(0),
  
  // Team stats
  overallRating: z.number().min(0).max(100),
  offenseRating: z.number().min(0).max(100),
  defenseRating: z.number().min(0).max(100),
  avgPointsPerGame: z.number().min(0).default(0),
  avgPointsAllowed: z.number().min(0).default(0),
  
  // Financial
  salaryCap: z.number().default(112000000), // $112M
  currentSalary: z.number().min(0).default(0),
  
  // Team morale and chemistry
  teamMorale: z.number().min(0).max(100).default(75),
  teamChemistry: z.number().min(0).max(100).default(75),
  
  // Coaching
  headCoachId: z.string().nullable(),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Coach Schema
export const coachSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().min(25).max(80),
  experience: z.number().min(0).max(50),
  
  // Coaching ratings
  overallRating: z.number().min(0).max(100),
  offenseRating: z.number().min(0).max(100),
  defenseRating: z.number().min(0).max(100),
  developmentRating: z.number().min(0).max(100),
  
  // Contract
  salary: z.number().min(0),
  contractYears: z.number().min(0).max(10),
  
  teamId: z.string().nullable(),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Game Schema
export const gameSchema = z.object({
  id: z.string(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  
  homeScore: z.number().min(0).default(0),
  awayScore: z.number().min(0).default(0),
  
  status: GameStatus.default("scheduled"),
  scheduledDate: z.date(),
  
  // Game stats
  homeTeamStats: z.object({
    fieldGoals: z.number().default(0),
    threePointers: z.number().default(0),
    rebounds: z.number().default(0),
    assists: z.number().default(0),
    turnovers: z.number().default(0),
  }).default({}),
  
  awayTeamStats: z.object({
    fieldGoals: z.number().default(0),
    threePointers: z.number().default(0),
    rebounds: z.number().default(0),
    assists: z.number().default(0),
    turnovers: z.number().default(0),
  }).default({}),
  
  season: z.string(),
  week: z.number().min(1).max(32),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Trade Schema
export const tradeSchema = z.object({
  id: z.string(),
  fromTeamId: z.string(),
  toTeamId: z.string(),
  
  playersOffered: z.array(z.string()), // Player IDs
  playersRequested: z.array(z.string()), // Player IDs
  
  status: TradeStatus.default("pending"),
  
  proposedDate: z.date().default(() => new Date()),
  decidedDate: z.date().nullable(),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Training Schema
export const trainingSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  type: TrainingType,
  
  duration: z.number().min(1).max(30), // days
  startDate: z.date(),
  endDate: z.date(),
  
  ratingImprovement: z.number().min(0).max(10),
  completed: z.boolean().default(false),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Season Schema
export const seasonSchema = z.object({
  id: z.string(),
  year: z.string(), // "2024-25"
  currentWeek: z.number().min(1).max(32),
  totalWeeks: z.number().default(32),
  
  isActive: z.boolean().default(true),
  
  draftCompleted: z.boolean().default(false),
  playoffsStarted: z.boolean().default(false),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Draft Schema
export const draftSchema = z.object({
  id: z.string(),
  season: z.string(),
  
  currentPick: z.number().min(1).default(1),
  totalPicks: z.number().default(60),
  
  picks: z.array(z.object({
    pickNumber: z.number(),
    teamId: z.string(),
    playerId: z.string().nullable(),
    traded: z.boolean().default(false),
  })),
  
  isComplete: z.boolean().default(false),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Contract Offer Schema
export const contractOfferSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  teamId: z.string(),
  
  // Contract terms
  contractType: ContractType,
  yearsOffered: z.number().min(1).max(10),
  totalValue: z.number().min(0),
  annualSalary: z.number().min(0),
  
  // Offer details
  signingBonus: z.number().min(0).default(0),
  teamOption: z.boolean().default(false), // Team option for final year
  playerOption: z.boolean().default(false), // Player option for final year
  noTradeClause: z.boolean().default(false),
  
  // Status
  status: ContractOfferStatus.default("pending"),
  offerExpiresAt: z.date(),
  
  // Player response
  playerInterest: z.number().min(0).max(100).nullable(), // How interested the player is (0-100)
  counterOffer: z.object({
    yearsWanted: z.number().min(1).max(10),
    totalValueWanted: z.number().min(0),
    demands: z.array(z.string()).default([]),
  }).nullable(),
  
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

// Insert schemas
export const insertPlayerSchema = playerSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertTeamSchema = teamSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertCoachSchema = coachSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertGameSchema = gameSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertTradeSchema = tradeSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertTrainingSchema = trainingSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertSeasonSchema = seasonSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertDraftSchema = draftSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertContractOfferSchema = contractOfferSchema.omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type Player = z.infer<typeof playerSchema>;
export type Team = z.infer<typeof teamSchema>;
export type Coach = z.infer<typeof coachSchema>;
export type Game = z.infer<typeof gameSchema>;
export type Trade = z.infer<typeof tradeSchema>;
export type Training = z.infer<typeof trainingSchema>;
export type Season = z.infer<typeof seasonSchema>;
export type Draft = z.infer<typeof draftSchema>;
export type ContractOffer = z.infer<typeof contractOfferSchema>;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertCoach = z.infer<typeof insertCoachSchema>;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type InsertSeason = z.infer<typeof insertSeasonSchema>;
export type InsertDraft = z.infer<typeof insertDraftSchema>;
export type InsertContractOffer = z.infer<typeof insertContractOfferSchema>;
