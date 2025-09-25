import Replicate from 'replicate';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { config } from '../config/environment.js';

export interface GameAsset {
  id: string;
  type: 'background' | 'sprite' | 'texture' | 'icon';
  url: string;
  localPath: string;
  prompt: string;
  model: string;
  createdAt: number;
  gameId: string;
}

export interface AssetGenerationRequest {
  gameId: string;
  gamePrompt: string;
  assetType: 'background' | 'sprite' | 'texture' | 'icon';
  style?: string;
  theme?: string;
}

export class AssetService {
  private replicate: Replicate;
  private assetsDir: string;

  constructor() {
    this.replicate = new Replicate({
      auth: config.replicateApiToken,
    });
    this.assetsDir = path.join(process.cwd(), config.assetsDir);
    this.ensureAssetsDirectory();
  }

  private async ensureAssetsDirectory() {
    try {
      await fs.ensureDir(this.assetsDir);
      console.log('Assets directory ensured:', this.assetsDir);
    } catch (error) {
      console.error('Failed to create assets directory:', error);
    }
  }

  async generateGameAssets(request: AssetGenerationRequest): Promise<GameAsset[]> {
    const { gameId, gamePrompt, assetType, style = 'realistic', theme } = request;
    const assets: GameAsset[] = [];

    try {
      // Generate background asset
      if (assetType === 'background' || assetType === 'texture') {
        const backgroundAsset = await this.generateBackground(gameId, gamePrompt, style, theme);
        if (backgroundAsset) {
          assets.push(backgroundAsset);
        }
      }

      // Generate sprite/character assets
      if (assetType === 'sprite' || assetType === 'icon') {
        const spriteAsset = await this.generateSprite(gameId, gamePrompt, style, theme);
        if (spriteAsset) {
          assets.push(spriteAsset);
        }
      }

      return assets;
    } catch (error) {
      console.error('Error generating game assets:', error);
      return [];
    }
  }

  private async generateBackground(gameId: string, gamePrompt: string, style: string, theme?: string): Promise<GameAsset | null> {
    try {
      const prompt = this.buildBackgroundPrompt(gamePrompt, style, theme);
      console.log('Generating background with prompt:', prompt);

      const output = await this.replicate.run(
        "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
        {
          input: {
            prompt: prompt,
            width: 1024,
            height: 1024,
            num_outputs: 1,
            scheduler: "K_EULER",
            num_inference_steps: 20,
            guidance_scale: 7.5,
            seed: Math.floor(Math.random() * 1000000)
          }
        }
      ) as string[];

      if (output && output.length > 0) {
        const imageUrl = output[0];
        const asset = await this.saveAsset(gameId, imageUrl, 'background', prompt);
        return asset;
      }

      return null;
    } catch (error) {
      console.error('Error generating background:', error);
      return null;
    }
  }

  private async generateSprite(gameId: string, gamePrompt: string, style: string, theme?: string): Promise<GameAsset | null> {
    try {
      const prompt = this.buildSpritePrompt(gamePrompt, style, theme);
      console.log('Generating sprite with prompt:', prompt);

      const output = await this.replicate.run(
        "stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
        {
          input: {
            prompt: prompt,
            width: 512,
            height: 512,
            num_outputs: 1,
            scheduler: "K_EULER",
            num_inference_steps: 20,
            guidance_scale: 7.5,
            seed: Math.floor(Math.random() * 1000000)
          }
        }
      ) as string[];

      if (output && output.length > 0) {
        const imageUrl = output[0];
        const asset = await this.saveAsset(gameId, imageUrl, 'sprite', prompt);
        return asset;
      }

      return null;
    } catch (error) {
      console.error('Error generating sprite:', error);
      return null;
    }
  }

  private buildBackgroundPrompt(gamePrompt: string, style: string, theme?: string): string {
    const basePrompt = `Game background for: ${gamePrompt}`;
    const stylePrompt = this.getStylePrompt(style);
    const themePrompt = theme ? `, ${theme} theme` : '';
    
    return `${basePrompt}${themePrompt}, ${stylePrompt}, game environment, detailed, high quality, 4k resolution`;
  }

  private buildSpritePrompt(gamePrompt: string, style: string, theme?: string): string {
    const basePrompt = `Game character or object for: ${gamePrompt}`;
    const stylePrompt = this.getStylePrompt(style);
    const themePrompt = theme ? `, ${theme} theme` : '';
    
    return `${basePrompt}${themePrompt}, ${stylePrompt}, game asset, clean background, centered, high quality`;
  }

  private getStylePrompt(style: string): string {
    const styleMap: { [key: string]: string } = {
      'realistic': 'photorealistic, detailed textures',
      'cartoon': 'cartoon style, colorful, animated',
      'pixel': 'pixel art, 16-bit style, retro gaming',
      'minimalist': 'minimalist design, clean lines, simple',
      'fantasy': 'fantasy art style, magical, mystical',
      'sci-fi': 'sci-fi style, futuristic, technological',
      'cyberpunk': 'cyberpunk style, neon colors, futuristic',
      'medieval': 'medieval fantasy style, ancient, historical'
    };

    return styleMap[style] || styleMap['realistic'];
  }

  private async saveAsset(gameId: string, imageUrl: string, type: string, prompt: string): Promise<GameAsset> {
    try {
      // Download the image
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);

      // Create filename
      const filename = `${gameId}-${type}-${uuidv4()}.png`;
      const filePath = path.join(this.assetsDir, filename);

      // Save the image
      await fs.writeFile(filePath, buffer);

      // Create asset record
      const asset: GameAsset = {
        id: uuidv4(),
        type: type as any,
        url: `/assets/${filename}`,
        localPath: filePath,
        prompt,
        model: 'stable-diffusion',
        createdAt: Date.now(),
        gameId
      };

      console.log('Asset saved:', asset.url);
      return asset;
    } catch (error) {
      console.error('Error saving asset:', error);
      throw error;
    }
  }

  async getAssetById(assetId: string): Promise<GameAsset | null> {
    try {
      // In a real implementation, this would query a database
      // For now, we'll return null as we're not persisting asset metadata
      return null;
    } catch (error) {
      console.error('Error getting asset:', error);
      return null;
    }
  }

  async getAssetsByGameId(gameId: string): Promise<GameAsset[]> {
    try {
      // In a real implementation, this would query a database
      // For now, we'll return empty array
      return [];
    } catch (error) {
      console.error('Error getting game assets:', error);
      return [];
    }
  }

  async deleteAsset(assetId: string): Promise<boolean> {
    try {
      // In a real implementation, this would delete from database and filesystem
      return true;
    } catch (error) {
      console.error('Error deleting asset:', error);
      return false;
    }
  }

  // Fallback method to generate assets without API (for demo purposes)
  async generateFallbackAssets(gameId: string, gamePrompt: string): Promise<GameAsset[]> {
    const assets: GameAsset[] = [];

    // Create placeholder assets
    const backgroundAsset: GameAsset = {
      id: uuidv4(),
      type: 'background',
      url: '/assets/placeholder-background.jpg',
      localPath: '',
      prompt: gamePrompt,
      model: 'placeholder',
      createdAt: Date.now(),
      gameId
    };

    const spriteAsset: GameAsset = {
      id: uuidv4(),
      type: 'sprite',
      url: '/assets/placeholder-sprite.png',
      localPath: '',
      prompt: gamePrompt,
      model: 'placeholder',
      createdAt: Date.now(),
      gameId
    };

    assets.push(backgroundAsset, spriteAsset);
    return assets;
  }
}
