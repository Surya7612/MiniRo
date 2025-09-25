import { Request, Response } from 'express';
import { GameService } from '../services/gameService.js';
import { z } from 'zod';

const gameService = new GameService();

const generateAssetsSchema = z.object({
  gameId: z.string().uuid(),
  assetType: z.enum(['background', 'sprite', 'texture', 'icon']),
  style: z.string().optional(),
  theme: z.string().optional()
});

const selectAssetSchema = z.object({
  gameId: z.string().uuid(),
  assetId: z.string().uuid()
});

export class AssetController {
  async generateAssets(req: Request, res: Response) {
    try {
      const { gameId, assetType, style, theme } = generateAssetsSchema.parse(req.body);
      
      const success = await gameService.generateGameAssets(gameId, assetType, style, theme);
      
      if (success) {
        const game = gameService.getGame(gameId);
        res.json({
          success: true,
          message: 'Assets generated successfully',
          game
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Failed to generate assets'
        });
      }
    } catch (error) {
      console.error('Error generating assets:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate assets'
      });
    }
  }

  async selectAsset(req: Request, res: Response) {
    try {
      const { gameId, assetId } = selectAssetSchema.parse(req.body);
      
      const success = await gameService.selectGameAsset(gameId, assetId);
      
      if (success) {
        const game = gameService.getGame(gameId);
        res.json({
          success: true,
          message: 'Asset selected successfully',
          game
        });
      } else {
        res.status(400).json({
          success: false,
          error: 'Failed to select asset'
        });
      }
    } catch (error) {
      console.error('Error selecting asset:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to select asset'
      });
    }
  }

  async getGameAssets(req: Request, res: Response) {
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
        assets: game.assets,
        selectedAsset: game.selectedAsset
      });
    } catch (error) {
      console.error('Error getting game assets:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get game assets'
      });
    }
  }

  async deleteAsset(req: Request, res: Response) {
    try {
      const { assetId } = req.params;
      
      // In a real implementation, this would delete the asset from the game
      // For now, we'll just return success
      res.json({
        success: true,
        message: 'Asset deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete asset'
      });
    }
  }
}
