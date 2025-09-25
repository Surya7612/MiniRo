import { v4 as uuidv4 } from 'uuid';
import { GameState, Player, GameEvent } from '../types/index.js';
import { GameGenerator } from '../utils/gameGenerator.js';
import { AssetService } from './assetService.js';
import axios from 'axios';

export class GameService {
  private games: Map<string, GameState> = new Map();
  private playerColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
  private assetService: AssetService;

  constructor() {
    this.assetService = new AssetService();
  }

  async createGame(prompt: string): Promise<GameState> {
    try {
      // Try to use AI service first
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5001';
      const response = await axios.post(`${aiServiceUrl}/api/generate-game`, {
        prompt,
        options: {
          style: 'realistic',
          complexity: 'medium',
          multiplayer: true,
          maxPlayers: 4
        }
      }, {
        timeout: 10000 // 10 second timeout
      });

      if (response.data.success) {
        const aiGame = response.data.game;
        const game: GameState = {
          id: aiGame.id,
          name: aiGame.name,
          description: aiGame.description,
          players: [],
          gameObjects: aiGame.gameObjects,
          gameLogic: {
            objective: aiGame.rules.objective,
            winConditions: aiGame.rules.winConditions,
            loseConditions: aiGame.rules.loseConditions,
            controls: aiGame.rules.controls,
            mechanics: aiGame.rules.mechanics,
            playerStartPosition: { x: 0, y: 1, z: 0 },
            goalPosition: { x: 5, y: 1, z: 5 },
            obstacles: [],
            collectibles: [],
            timeLimit: 120
          },
          status: 'ready',
          createdAt: Date.now(),
          analytics: {
            playCount: 0,
            shareCount: 0,
            remixCount: 0,
            likeCount: 0,
            lastPlayed: 0,
            tags: ['AI Generated'],
            uniqueShares: 0,
            totalPlayTime: 0,
            averagePlayTime: 0
          },
          isRemix: false,
          creator: 'AI Assistant',
          assets: [],
          selectedAsset: undefined
        };
        
        this.games.set(game.id, game);
        return game;
      }
    } catch (error) {
      console.warn('AI service unavailable, using fallback generator:', error);
    }

    // Fallback to local generator
    const game = await GameGenerator.generateGame(prompt);
    this.games.set(game.id, game);
    return game;
  }

  getGame(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  getAllGames(): GameState[] {
    return Array.from(this.games.values());
  }

  addPlayer(gameId: string, playerName: string, socketId: string): Player | null {
    const game = this.games.get(gameId);
    if (!game) return null;

    // Check if player already exists
    const existingPlayer = game.players.find(p => p.socketId === socketId);
    if (existingPlayer) return existingPlayer;

    const player: Player = {
      id: uuidv4(),
      name: playerName,
      position: { x: 0, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      color: this.getNextAvailableColor(game),
      isHost: game.players.length === 0,
      socketId
    };

    game.players.push(player);
    this.games.set(gameId, game);

    return player;
  }

  removePlayer(gameId: string, socketId: string): string | null {
    const game = this.games.get(gameId);
    if (!game) return null;

    const playerIndex = game.players.findIndex(p => p.socketId === socketId);
    if (playerIndex === -1) return null;

    const player = game.players[playerIndex];
    game.players.splice(playerIndex, 1);

    // If host left, assign new host
    if (player.isHost && game.players.length > 0) {
      game.players[0].isHost = true;
    }

    this.games.set(gameId, game);
    return player.id;
  }

  updatePlayerPosition(gameId: string, socketId: string, position: any, rotation: any): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;

    const player = game.players.find(p => p.socketId === socketId);
    if (!player) return false;

    player.position = position;
    player.rotation = rotation;
    this.games.set(gameId, game);

    return true;
  }

  private getNextAvailableColor(game: GameState): string {
    const usedColors = game.players.map(p => p.color);
    const availableColors = this.playerColors.filter(color => !usedColors.includes(color));
    
    if (availableColors.length > 0) {
      return availableColors[0];
    }
    
    // If all colors are used, return a random one
    return this.playerColors[Math.floor(Math.random() * this.playerColors.length)];
  }

  createGameEvent(type: GameEvent['type'], data: any): GameEvent {
    return {
      type,
      data,
      timestamp: Date.now()
    };
  }

  deleteGame(gameId: string): boolean {
    return this.games.delete(gameId);
  }

  // Analytics tracking methods
  trackGamePlay(gameId: string): void {
    const game = this.games.get(gameId);
    if (game) {
      game.analytics.playCount++;
      game.analytics.lastPlayed = Date.now();
      this.games.set(gameId, game);
    }
  }

  trackGameShare(gameId: string): void {
    const game = this.games.get(gameId);
    if (game) {
      game.analytics.shareCount++;
      this.games.set(gameId, game);
    }
  }

  trackGameRemix(originalGameId: string): void {
    const game = this.games.get(originalGameId);
    if (game) {
      game.analytics.remixCount++;
      this.games.set(originalGameId, game);
    }
  }

  trackGameLike(gameId: string): void {
    const game = this.games.get(gameId);
    if (game) {
      game.analytics.likeCount++;
      this.games.set(gameId, game);
    }
  }

  getViralGames(limit: number = 10): GameState[] {
    return Array.from(this.games.values())
      .sort((a, b) => {
        // Sort by viral score (combination of plays, shares, and remixes)
        const scoreA = a.analytics.playCount + a.analytics.shareCount * 2 + a.analytics.remixCount * 3;
        const scoreB = b.analytics.playCount + b.analytics.shareCount * 2 + b.analytics.remixCount * 3;
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  // Asset generation methods
  async generateGameAssets(gameId: string, assetType: 'background' | 'sprite' | 'texture' | 'icon', style?: string, theme?: string): Promise<boolean> {
    const game = this.games.get(gameId);
    if (!game) return false;

    try {
      const assets = await this.assetService.generateGameAssets({
        gameId,
        gamePrompt: game.description,
        assetType,
        style: style || 'realistic',
        theme
      });

      if (assets.length > 0) {
        game.assets.push(...assets);
        if (!game.selectedAsset && assets[0]) {
          game.selectedAsset = assets[0].id;
        }
        this.games.set(gameId, game);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error generating assets:', error);
      return false;
    }
  }

  async selectGameAsset(gameId: string, assetId: string): Promise<boolean> {
    const game = this.games.get(gameId);
    if (!game) return false;

    const asset = game.assets.find(a => a.id === assetId);
    if (!asset) return false;

    game.selectedAsset = assetId;
    this.games.set(gameId, game);
    return true;
  }

  // Enhanced analytics tracking
  trackUniqueShare(gameId: string, shareId: string): void {
    const game = this.games.get(gameId);
    if (game) {
      game.analytics.uniqueShares++;
      this.games.set(gameId, game);
    }
  }

  trackPlayTime(gameId: string, playTime: number): void {
    const game = this.games.get(gameId);
    if (game) {
      game.analytics.totalPlayTime += playTime;
      game.analytics.averagePlayTime = game.analytics.totalPlayTime / Math.max(game.analytics.playCount, 1);
      this.games.set(gameId, game);
    }
  }
}
