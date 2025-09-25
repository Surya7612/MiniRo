import { Request, Response } from 'express';
import { GameService } from '../services/gameService.js';
import { z } from 'zod';

const gameService = new GameService();

const generateGameSchema = z.object({
  prompt: z.string().min(1).max(500)
});

export class GameController {
  async generateGame(req: Request, res: Response) {
    try {
      const { prompt } = generateGameSchema.parse(req.body);
      
      const game = await gameService.createGame(prompt);
      
      res.json({
        success: true,
        game
      });
    } catch (error) {
      console.error('Error generating game:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate game'
      });
    }
  }

  async getGame(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      const game = gameService.getGame(gameId);
      
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }
      
      res.json({
        success: true,
        game
      });
    } catch (error) {
      console.error('Error getting game:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get game'
      });
    }
  }

  async getAllGames(req: Request, res: Response) {
    try {
      const games = gameService.getAllGames();
      
      // Filter out sensitive information for public listing
      const publicGames = games.map(game => ({
        id: game.id,
        name: game.name,
        description: game.description,
        players: game.players.length,
        status: game.status,
        createdAt: game.createdAt
      }));
      
      res.json({
        success: true,
        games: publicGames
      });
    } catch (error) {
      console.error('Error getting all games:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get games'
      });
    }
  }

  async deleteGame(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      const deleted = gameService.deleteGame(gameId);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Game deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting game:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete game'
      });
    }
  }

  async trackGamePlay(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      gameService.trackGamePlay(gameId);
      
      res.json({
        success: true,
        message: 'Game play tracked'
      });
    } catch (error) {
      console.error('Error tracking game play:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track game play'
      });
    }
  }

  async trackGameShare(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      gameService.trackGameShare(gameId);
      
      res.json({
        success: true,
        message: 'Game share tracked'
      });
    } catch (error) {
      console.error('Error tracking game share:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track game share'
      });
    }
  }

  async trackGameRemix(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      gameService.trackGameRemix(gameId);
      
      res.json({
        success: true,
        message: 'Game remix tracked'
      });
    } catch (error) {
      console.error('Error tracking game remix:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track game remix'
      });
    }
  }

  async trackGameLike(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      gameService.trackGameLike(gameId);
      
      res.json({
        success: true,
        message: 'Game like tracked'
      });
    } catch (error) {
      console.error('Error tracking game like:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to track game like'
      });
    }
  }

  async getViralGames(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const games = gameService.getViralGames(limit);
      
      res.json({
        success: true,
        games
      });
    } catch (error) {
      console.error('Error getting viral games:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get viral games'
      });
    }
  }

  async getGameAnalytics(req: Request, res: Response) {
    try {
      const { gameId } = req.params;
      const game = gameService.getGame(gameId);
      
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }
      
      res.json({
        success: true,
        analytics: game.analytics
      });
    } catch (error) {
      console.error('Error getting game analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get game analytics'
      });
    }
  }

  async getGlobalAnalytics(req: Request, res: Response) {
    try {
      const allGames = gameService.getAllGames();
      
      const globalAnalytics = {
        totalGames: allGames.length,
        totalPlays: allGames.reduce((sum, game) => sum + game.analytics.playCount, 0),
        totalShares: allGames.reduce((sum, game) => sum + game.analytics.shareCount, 0),
        totalRemixes: allGames.reduce((sum, game) => sum + game.analytics.remixCount, 0),
        totalLikes: allGames.reduce((sum, game) => sum + game.analytics.likeCount, 0),
        totalPlayTime: allGames.reduce((sum, game) => sum + game.analytics.totalPlayTime, 0),
        averagePlayTime: 0,
        mostPlayedGame: allGames.reduce((max, game) => 
          game.analytics.playCount > max.analytics.playCount ? game : max, allGames[0] || null),
        mostSharedGame: allGames.reduce((max, game) => 
          game.analytics.shareCount > max.analytics.shareCount ? game : max, allGames[0] || null),
        mostRemixedGame: allGames.reduce((max, game) => 
          game.analytics.remixCount > max.analytics.remixCount ? game : max, allGames[0] || null)
      };
      
      // Calculate average play time
      if (globalAnalytics.totalPlays > 0) {
        globalAnalytics.averagePlayTime = globalAnalytics.totalPlayTime / globalAnalytics.totalPlays;
      }
      
      res.json({
        success: true,
        analytics: globalAnalytics
      });
    } catch (error) {
      console.error('Error getting global analytics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get global analytics'
      });
    }
  }
}
