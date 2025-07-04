import { Router } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertPlayerSchema, insertTeamSchema, insertCoachSchema, insertGameSchema,
  insertTradeSchema, insertTrainingSchema, insertSeasonSchema, insertDraftSchema, insertContractOfferSchema
} from "@shared/schema";
import { simulateGame } from "./services/simulation";

const router = Router();

// Players
router.get("/api/players", async (req, res) => {
  const players = await storage.getPlayers();
  res.json(players);
});

router.get("/api/players/:id", async (req, res) => {
  const player = await storage.getPlayer(req.params.id);
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }
  res.json(player);
});

router.post("/api/players", async (req, res) => {
  try {
    const data = insertPlayerSchema.parse(req.body);
    const player = await storage.createPlayer(data);
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: "Invalid player data" });
  }
});

router.put("/api/players/:id", async (req, res) => {
  try {
    const player = await storage.updatePlayer(req.params.id, req.body);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    res.status(400).json({ error: "Invalid player data" });
  }
});

router.delete("/api/players/:id", async (req, res) => {
  const deleted = await storage.deletePlayer(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Player not found" });
  }
  res.status(204).send();
});

router.get("/api/players/team/:teamId", async (req, res) => {
  const players = await storage.getPlayersByTeam(req.params.teamId);
  res.json(players);
});

router.get("/api/players/free-agents", async (req, res) => {
  const players = await storage.getFreeAgentPlayers();
  res.json(players);
});

// Teams
router.get("/api/teams", async (req, res) => {
  const teams = await storage.getTeams();
  res.json(teams);
});

router.get("/api/teams/:id", async (req, res) => {
  const team = await storage.getTeam(req.params.id);
  if (!team) {
    return res.status(404).json({ error: "Team not found" });
  }
  res.json(team);
});

router.post("/api/teams", async (req, res) => {
  try {
    const data = insertTeamSchema.parse(req.body);
    const team = await storage.createTeam(data);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: "Invalid team data" });
  }
});

router.put("/api/teams/:id", async (req, res) => {
  try {
    const team = await storage.updateTeam(req.params.id, req.body);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.json(team);
  } catch (error) {
    res.status(400).json({ error: "Invalid team data" });
  }
});

router.delete("/api/teams/:id", async (req, res) => {
  const deleted = await storage.deleteTeam(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Team not found" });
  }
  res.status(204).send();
});

// Coaches
router.get("/api/coaches", async (req, res) => {
  const coaches = await storage.getCoaches();
  res.json(coaches);
});

router.get("/api/coaches/:id", async (req, res) => {
  const coach = await storage.getCoach(req.params.id);
  if (!coach) {
    return res.status(404).json({ error: "Coach not found" });
  }
  res.json(coach);
});

router.post("/api/coaches", async (req, res) => {
  try {
    const data = insertCoachSchema.parse(req.body);
    const coach = await storage.createCoach(data);
    res.status(201).json(coach);
  } catch (error) {
    res.status(400).json({ error: "Invalid coach data" });
  }
});

router.put("/api/coaches/:id", async (req, res) => {
  try {
    const coach = await storage.updateCoach(req.params.id, req.body);
    if (!coach) {
      return res.status(404).json({ error: "Coach not found" });
    }
    res.json(coach);
  } catch (error) {
    res.status(400).json({ error: "Invalid coach data" });
  }
});

router.delete("/api/coaches/:id", async (req, res) => {
  const deleted = await storage.deleteCoach(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Coach not found" });
  }
  res.status(204).send();
});

router.get("/api/coaches/free-agents", async (req, res) => {
  const coaches = await storage.getFreeAgentCoaches();
  res.json(coaches);
});

// Games
router.get("/api/games", async (req, res) => {
  const games = await storage.getGames();
  res.json(games);
});

router.get("/api/games/:id", async (req, res) => {
  const game = await storage.getGame(req.params.id);
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }
  res.json(game);
});

router.post("/api/games", async (req, res) => {
  try {
    const data = insertGameSchema.parse(req.body);
    const game = await storage.createGame(data);
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ error: "Invalid game data" });
  }
});

router.put("/api/games/:id", async (req, res) => {
  try {
    const game = await storage.updateGame(req.params.id, req.body);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: "Invalid game data" });
  }
});

router.delete("/api/games/:id", async (req, res) => {
  const deleted = await storage.deleteGame(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Game not found" });
  }
  res.status(204).send();
});

router.get("/api/games/team/:teamId", async (req, res) => {
  const games = await storage.getGamesByTeam(req.params.teamId);
  res.json(games);
});

router.get("/api/games/season/:season", async (req, res) => {
  const games = await storage.getGamesBySeason(req.params.season);
  res.json(games);
});

// Game simulation
router.post("/api/games/:id/simulate", async (req, res) => {
  try {
    const game = await storage.getGame(req.params.id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    if (game.status !== "scheduled") {
      return res.status(400).json({ error: "Game is not scheduled" });
    }

    const result = await simulateGame(game.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Game simulation failed" });
  }
});

// Trades
router.get("/api/trades", async (req, res) => {
  const trades = await storage.getTrades();
  res.json(trades);
});

router.get("/api/trades/:id", async (req, res) => {
  const trade = await storage.getTrade(req.params.id);
  if (!trade) {
    return res.status(404).json({ error: "Trade not found" });
  }
  res.json(trade);
});

router.post("/api/trades", async (req, res) => {
  try {
    const data = insertTradeSchema.parse(req.body);
    const trade = await storage.createTrade(data);
    res.status(201).json(trade);
  } catch (error) {
    res.status(400).json({ error: "Invalid trade data" });
  }
});

router.put("/api/trades/:id", async (req, res) => {
  try {
    const trade = await storage.updateTrade(req.params.id, req.body);
    if (!trade) {
      return res.status(404).json({ error: "Trade not found" });
    }
    res.json(trade);
  } catch (error) {
    res.status(400).json({ error: "Invalid trade data" });
  }
});

router.delete("/api/trades/:id", async (req, res) => {
  const deleted = await storage.deleteTrade(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Trade not found" });
  }
  res.status(204).send();
});

router.get("/api/trades/team/:teamId", async (req, res) => {
  const trades = await storage.getTradesByTeam(req.params.teamId);
  res.json(trades);
});

// Training
router.get("/api/training", async (req, res) => {
  const trainings = await storage.getTrainings();
  res.json(trainings);
});

router.get("/api/training/:id", async (req, res) => {
  const training = await storage.getTraining(req.params.id);
  if (!training) {
    return res.status(404).json({ error: "Training not found" });
  }
  res.json(training);
});

router.post("/api/training", async (req, res) => {
  try {
    const data = insertTrainingSchema.parse(req.body);
    const training = await storage.createTraining(data);
    res.status(201).json(training);
  } catch (error) {
    res.status(400).json({ error: "Invalid training data" });
  }
});

router.put("/api/training/:id", async (req, res) => {
  try {
    const training = await storage.updateTraining(req.params.id, req.body);
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.json(training);
  } catch (error) {
    res.status(400).json({ error: "Invalid training data" });
  }
});

router.delete("/api/training/:id", async (req, res) => {
  const deleted = await storage.deleteTraining(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Training not found" });
  }
  res.status(204).send();
});

router.get("/api/training/player/:playerId", async (req, res) => {
  const trainings = await storage.getTrainingsByPlayer(req.params.playerId);
  res.json(trainings);
});

// Seasons
router.get("/api/seasons", async (req, res) => {
  const seasons = await storage.getSeasons();
  res.json(seasons);
});

router.get("/api/seasons/active", async (req, res) => {
  const season = await storage.getActiveSeason();
  if (!season) {
    return res.status(404).json({ error: "No active season found" });
  }
  res.json(season);
});

router.get("/api/seasons/:id", async (req, res) => {
  const season = await storage.getSeason(req.params.id);
  if (!season) {
    return res.status(404).json({ error: "Season not found" });
  }
  res.json(season);
});

router.post("/api/seasons", async (req, res) => {
  try {
    const data = insertSeasonSchema.parse(req.body);
    const season = await storage.createSeason(data);
    res.status(201).json(season);
  } catch (error) {
    res.status(400).json({ error: "Invalid season data" });
  }
});

router.put("/api/seasons/:id", async (req, res) => {
  try {
    const season = await storage.updateSeason(req.params.id, req.body);
    if (!season) {
      return res.status(404).json({ error: "Season not found" });
    }
    res.json(season);
  } catch (error) {
    res.status(400).json({ error: "Invalid season data" });
  }
});

router.delete("/api/seasons/:id", async (req, res) => {
  const deleted = await storage.deleteSeason(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Season not found" });
  }
  res.status(204).send();
});

// Draft
router.get("/api/draft", async (req, res) => {
  const drafts = await storage.getDrafts();
  res.json(drafts);
});

router.get("/api/draft/:id", async (req, res) => {
  const draft = await storage.getDraft(req.params.id);
  if (!draft) {
    return res.status(404).json({ error: "Draft not found" });
  }
  res.json(draft);
});

router.get("/api/draft/season/:season", async (req, res) => {
  const draft = await storage.getDraftBySeason(req.params.season);
  if (!draft) {
    return res.status(404).json({ error: "Draft not found for season" });
  }
  res.json(draft);
});

router.post("/api/draft", async (req, res) => {
  try {
    const data = insertDraftSchema.parse(req.body);
    const draft = await storage.createDraft(data);
    res.status(201).json(draft);
  } catch (error) {
    res.status(400).json({ error: "Invalid draft data" });
  }
});

router.put("/api/draft/:id", async (req, res) => {
  try {
    const draft = await storage.updateDraft(req.params.id, req.body);
    if (!draft) {
      return res.status(404).json({ error: "Draft not found" });
    }
    res.json(draft);
  } catch (error) {
    res.status(400).json({ error: "Invalid draft data" });
  }
});

router.delete("/api/draft/:id", async (req, res) => {
  const deleted = await storage.deleteDraft(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Draft not found" });
  }
  res.status(204).send();
});

// Contract Offers
router.get("/api/contract-offers", async (req, res) => {
  const offers = await storage.getContractOffers();
  res.json(offers);
});

router.get("/api/contract-offers/active", async (req, res) => {
  const offers = await storage.getActiveContractOffers();
  res.json(offers);
});

router.get("/api/contract-offers/:id", async (req, res) => {
  const offer = await storage.getContractOffer(req.params.id);
  if (!offer) {
    return res.status(404).json({ error: "Contract offer not found" });
  }
  res.json(offer);
});

router.get("/api/contract-offers/player/:playerId", async (req, res) => {
  const offers = await storage.getContractOffersByPlayer(req.params.playerId);
  res.json(offers);
});

router.get("/api/contract-offers/team/:teamId", async (req, res) => {
  const offers = await storage.getContractOffersByTeam(req.params.teamId);
  res.json(offers);
});

router.post("/api/contract-offers", async (req, res) => {
  try {
    const data = insertContractOfferSchema.parse(req.body);
    const offer = await storage.createContractOffer(data);
    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ error: "Invalid contract offer data" });
  }
});

router.put("/api/contract-offers/:id", async (req, res) => {
  try {
    const offer = await storage.updateContractOffer(req.params.id, req.body);
    if (!offer) {
      return res.status(404).json({ error: "Contract offer not found" });
    }
    res.json(offer);
  } catch (error) {
    res.status(400).json({ error: "Invalid contract offer data" });
  }
});

router.post("/api/contract-offers/:id/accept", async (req, res) => {
  try {
    const offer = await storage.getContractOffer(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: "Contract offer not found" });
    }

    // Update offer status to accepted
    const updatedOffer = await storage.updateContractOffer(req.params.id, {
      status: "accepted"
    });

    // Update player contract
    const player = await storage.getPlayer(offer.playerId);
    if (player) {
      await storage.updatePlayer(offer.playerId, {
        teamId: offer.teamId,
        salary: offer.annualSalary,
        contractYears: offer.yearsOffered
      });

      // Update team salary
      const team = await storage.getTeam(offer.teamId);
      if (team) {
        await storage.updateTeam(offer.teamId, {
          currentSalary: team.currentSalary + offer.annualSalary
        });
      }
    }

    res.json(updatedOffer);
  } catch (error) {
    res.status(400).json({ error: "Failed to accept contract offer" });
  }
});

router.post("/api/contract-offers/:id/reject", async (req, res) => {
  try {
    const updatedOffer = await storage.updateContractOffer(req.params.id, {
      status: "rejected"
    });
    if (!updatedOffer) {
      return res.status(404).json({ error: "Contract offer not found" });
    }
    res.json(updatedOffer);
  } catch (error) {
    res.status(400).json({ error: "Failed to reject contract offer" });
  }
});

router.delete("/api/contract-offers/:id", async (req, res) => {
  const deleted = await storage.deleteContractOffer(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Contract offer not found" });
  }
  res.status(204).send();
});

export function registerRoutes(app: any) {
  app.use(router);
  
  const server = createServer(app);
  return server;
}

export default router;
