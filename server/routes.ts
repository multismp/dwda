import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlayerSchema, updatePlayerSchema } from "@shared/schema";
import { z } from "zod";

const adminPassword = "admin123";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication
  app.post("/api/auth/admin", async (req, res) => {
    try {
      const { password } = req.body;
      if (password === adminPassword) {
        res.json({ success: true, message: "Admin authenticated" });
      } else {
        res.status(401).json({ success: false, message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Get all players
  app.get("/api/players", async (req, res) => {
    try {
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  // Create new player
  app.post("/api/players", async (req, res) => {
    try {
      const validatedData = insertPlayerSchema.parse(req.body);
      
      // Check if player name already exists
      const existingPlayer = await storage.getPlayerByName(validatedData.name);
      if (existingPlayer) {
        return res.status(400).json({ message: "Player name already exists" });
      }

      const player = await storage.createPlayer(validatedData);
      res.status(201).json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid player data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create player" });
      }
    }
  });

  // Update player
  app.patch("/api/players/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updatePlayerSchema.parse(req.body);
      
      // Check if name is being updated and already exists
      if (validatedData.name) {
        const existingPlayer = await storage.getPlayerByName(validatedData.name);
        if (existingPlayer && existingPlayer.id !== id) {
          return res.status(400).json({ message: "Player name already exists" });
        }
      }

      const player = await storage.updatePlayer(id, validatedData);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid player data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update player" });
      }
    }
  });

  // Delete player
  app.delete("/api/players/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePlayer(id);
      
      if (!success) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json({ message: "Player deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete player" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
