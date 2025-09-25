import { GameAsset } from '../types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export interface AssetGenerationRequest {
  gameId: string;
  assetType: 'background' | 'sprite' | 'texture' | 'icon';
  style?: string;
  theme?: string;
}

export interface AssetSelectionRequest {
  gameId: string;
  assetId: string;
}

export class AssetService {
  async generateAssets(request: AssetGenerationRequest): Promise<{ success: boolean; game?: any; error?: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/assets/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating assets:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate assets'
      };
    }
  }

  async selectAsset(request: AssetSelectionRequest): Promise<{ success: boolean; game?: any; error?: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/assets/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error selecting asset:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to select asset'
      };
    }
  }

  async getGameAssets(gameId: string): Promise<{ success: boolean; assets?: GameAsset[]; selectedAsset?: string; error?: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/games/${gameId}/assets`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting game assets:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get game assets'
      };
    }
  }

  async deleteAsset(assetId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/assets/${assetId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting asset:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete asset'
      };
    }
  }

  // Utility method to get asset URL with fallback
  getAssetUrl(asset: GameAsset): string {
    if (asset.url.startsWith('http')) {
      return asset.url;
    }
    return `${BACKEND_URL}${asset.url}`;
  }

  // Utility method to check if asset is AI-generated
  isAIGenerated(asset: GameAsset): boolean {
    return asset.model !== 'default' && asset.model !== 'placeholder';
  }

  // Utility method to get asset type display name
  getAssetTypeDisplayName(type: GameAsset['type']): string {
    const typeMap = {
      'background': 'Background',
      'sprite': 'Sprite',
      'texture': 'Texture',
      'icon': 'Icon'
    };
    return typeMap[type] || type;
  }

  // Utility method to get model display name
  getModelDisplayName(model: string): string {
    const modelMap = {
      'stable-diffusion': 'Stable Diffusion',
      'dall-e': 'DALL-E',
      'midjourney': 'Midjourney',
      'default': 'Default',
      'placeholder': 'Placeholder'
    };
    return modelMap[model] || model;
  }
}

export const assetService = new AssetService();
