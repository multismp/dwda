import { type User, type InsertUser, type Player, type InsertPlayer, type UpdatePlayer } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllPlayers(): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(id: string, player: UpdatePlayer): Promise<Player | undefined>;
  deletePlayer(id: string): Promise<boolean>;
  getPlayerByName(name: string): Promise<Player | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private players: Map<string, Player>;

  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.initializeDefaultPlayers();
  }

  private initializeDefaultPlayers() {
    const defaultPlayers: InsertPlayer[] = [
      {
        name: 'Marlowww',
        points: 405,
        region: 'NA',
        title: 'Combat Grandmaster',
        titleIcon: 'fas fa-crown',
        tiers: {
          vanilla: 'HT1', smp: 'HT1', mace: 'HT1', pot: 'LT1',
          axe: 'LT1', uhc: 'LT1', sword: 'LT1', nethop: 'LT1'
        }
      },
      {
        name: 'ItzRealMe',
        points: 330,
        region: 'NA',
        title: 'Combat Master',
        titleIcon: 'fas fa-medal',
        tiers: {
          pot: 'HT1', vanilla: 'HT1', nethop: 'HT1', smp: 'HT1',
          sword: 'HT2', axe: 'LT2', uhc: 'LT2', mace: 'LT2'
        }
      },
      {
        name: 'Swight',
        points: 260,
        region: 'NA',
        title: 'Combat Master',
        titleIcon: 'fas fa-medal',
        tiers: {
          uhc: 'HT1', axe: 'LT1', vanilla: 'LT2', mace: 'LT2',
          nethop: 'HT3', pot: 'HT3', smp: 'HT1', sword: 'LT2'
        }
      },
      {
        name: 'coldified',
        points: 226,
        region: 'EU',
        title: 'Combat Ace',
        titleIcon: 'fas fa-star',
        tiers: {
          axe: 'HT2', mace: 'LT2', sword: 'LT2', pot: 'LT2',
          nethop: 'HT3', vanilla: 'LT3', smp: 'HT1', uhc: 'HT1'
        }
      },
      {
        name: 'Kylaz',
        points: 222,
        region: 'NA',
        title: 'Combat Ace',
        titleIcon: 'fas fa-star',
        tiers: {
          sword: 'HT1', pot: 'HT1', uhc: 'LT3', vanilla: 'LT3',
          smp: 'LT3', nethop: 'HT1', axe: 'LT2'
        }
      }
    ];

    defaultPlayers.forEach(playerData => {
      const id = randomUUID();
      const player: Player = { ...playerData, id };
      this.players.set(id, player);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Player methods
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values()).sort((a, b) => b.points - a.points);
  }

  async getPlayer(id: string): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const id = randomUUID();
    const player: Player = { ...insertPlayer, id };
    this.players.set(id, player);
    return player;
  }

  async updatePlayer(id: string, updatePlayer: UpdatePlayer): Promise<Player | undefined> {
    const existingPlayer = this.players.get(id);
    if (!existingPlayer) return undefined;
    
    const updatedPlayer: Player = { ...existingPlayer, ...updatePlayer };
    this.players.set(id, updatedPlayer);
    return updatedPlayer;
  }

  async deletePlayer(id: string): Promise<boolean> {
    return this.players.delete(id);
  }

  async getPlayerByName(name: string): Promise<Player | undefined> {
    return Array.from(this.players.values()).find(
      (player) => player.name.toLowerCase() === name.toLowerCase(),
    );
  }
}

export const storage = new MemStorage();
