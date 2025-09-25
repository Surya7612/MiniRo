import { v4 as uuidv4 } from 'uuid';
import { GameState, GameObject, Vector3, GameLogic, GameAnalytics, GameAsset } from '../types/index.js';

// Mock AI game generation - in real implementation, this would call the AI module
export class GameGenerator {
  static async generateGame(prompt: string): Promise<GameState> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const gameId = uuidv4();
    const gameName = this.extractGameName(prompt);
    const gameLogic = this.generateGameLogic(prompt);
    const gameObjects = this.generateGameObjects(prompt, gameLogic);
    const analytics = this.createAnalytics(prompt);
    const assets = this.createDefaultAssets(gameId, prompt);

    return {
      id: gameId,
      name: gameName,
      description: prompt,
      players: [],
      gameObjects,
      gameLogic,
      status: 'ready',
      createdAt: Date.now(),
      analytics,
      isRemix: false,
      creator: 'Anonymous',
      assets,
      selectedAsset: assets[0]?.id
    };
  }

  private static extractGameName(prompt: string): string {
    // Simple name extraction - in real implementation, AI would generate this
    const words = prompt.toLowerCase().split(' ');
    
    if (words.includes('racing') || words.includes('race')) {
      return 'Speed Racer';
    } else if (words.includes('space') || words.includes('battle')) {
      return 'Space Warriors';
    } else if (words.includes('puzzle') || words.includes('platform')) {
      return 'Mind Bender';
    } else if (words.includes('hide') || words.includes('seek')) {
      return 'Hide & Seek';
    } else if (words.includes('maze') || words.includes('labyrinth')) {
      return 'Maze Runner';
    } else {
      return 'Custom Adventure';
    }
  }

  private static generateGameLogic(prompt: string): GameLogic {
    const words = prompt.toLowerCase();
    
    if (words.includes('racing') || words.includes('car')) {
      return {
        objective: 'Race to the finish line as fast as possible!',
        winConditions: ['Reach the finish line', 'Complete the race in time'],
        loseConditions: ['Fall off the track', 'Run out of time'],
        controls: ['WASD to move', 'Space to brake', 'Shift to boost'],
        mechanics: ['Racing', 'Speed boost', 'Obstacle avoidance'],
        playerStartPosition: { x: 0, y: 1, z: -5 },
        goalPosition: { x: 0, y: 1, z: 15 },
        obstacles: [],
        collectibles: [],
        timeLimit: 60
      };
    } else if (words.includes('space') || words.includes('asteroid')) {
      return {
        objective: 'Survive in space and collect resources!',
        winConditions: ['Collect 5 resources', 'Survive for 2 minutes'],
        loseConditions: ['Hit by asteroid', 'Run out of fuel'],
        controls: ['WASD to move', 'Space to shoot', 'Mouse to aim'],
        mechanics: ['Space combat', 'Resource collection', 'Asteroid avoidance'],
        playerStartPosition: { x: 0, y: 0, z: 0 },
        goalPosition: { x: 0, y: 0, z: 0 },
        obstacles: [],
        collectibles: [],
        scoreTarget: 5
      };
    } else if (words.includes('platform') || words.includes('puzzle')) {
      return {
        objective: 'Jump between platforms to reach the goal!',
        winConditions: ['Reach the final platform', 'Collect all gems'],
        loseConditions: ['Fall off the world', 'Run out of time'],
        controls: ['WASD to move', 'Space to jump', 'Mouse to look'],
        mechanics: ['Platform jumping', 'Gem collection', 'Puzzle solving'],
        playerStartPosition: { x: 0, y: 1, z: 0 },
        goalPosition: { x: -3, y: 4, z: 0 },
        obstacles: [],
        collectibles: [],
        timeLimit: 120
      };
    } else {
      // Default adventure game
      return {
        objective: 'Explore the world and complete your mission!',
        winConditions: ['Find the treasure', 'Defeat the boss'],
        loseConditions: ['Fall into a pit', 'Get caught by enemies'],
        controls: ['WASD to move', 'Space to jump', 'Mouse to look around'],
        mechanics: ['Exploration', 'Combat', 'Puzzle solving'],
        playerStartPosition: { x: 0, y: 1, z: 0 },
        goalPosition: { x: 5, y: 1, z: 5 },
        obstacles: [],
        collectibles: [],
        timeLimit: 180
      };
    }
  }

  private static generateGameObjects(prompt: string, gameLogic: GameLogic): GameObject[] {
    const objects: GameObject[] = [];
    const words = prompt.toLowerCase();

    // Add ground/platform
    objects.push(
      this.createObject('plane', { x: 0, y: -1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 20, y: 1, z: 20 }, '#2c3e50')
    );

    // Add goal object
    objects.push(
      this.createObject('sphere', gameLogic.goalPosition, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#ffd700')
    );

    // Generate objects based on prompt keywords
    if (words.includes('racing') || words.includes('car')) {
      // Racing track with obstacles
      objects.push(
        this.createObject('cube', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.5, z: 1 }, '#ff6b6b'),
        this.createObject('cube', { x: 0, y: 0, z: 5 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.5, z: 1 }, '#4ecdc4'),
        this.createObject('cube', { x: 0, y: 0, z: 10 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.5, z: 1 }, '#45b7d1'),
        // Obstacles
        this.createObject('cube', { x: 3, y: 0.5, z: 3 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#ff0000'),
        this.createObject('cube', { x: -3, y: 0.5, z: 7 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#ff0000')
      );
    } else if (words.includes('space') || words.includes('asteroid')) {
      // Space environment with asteroids and collectibles
      objects.push(
        // Asteroids (obstacles)
        this.createObject('sphere', { x: 3, y: 2, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#8b4513'),
        this.createObject('sphere', { x: -2, y: 1, z: 3 }, { x: 0, y: 0, z: 0 }, { x: 0.8, y: 0.8, z: 0.8 }, '#654321'),
        this.createObject('sphere', { x: 0, y: 3, z: -2 }, { x: 0, y: 0, z: 0 }, { x: 1.2, y: 1.2, z: 1.2 }, '#a0522d'),
        // Collectible resources
        this.createObject('cube', { x: 2, y: 1, z: 2 }, { x: 0, y: 0, z: 0 }, { x: 0.3, y: 0.3, z: 0.3 }, '#00ff00'),
        this.createObject('cube', { x: -3, y: 2, z: -1 }, { x: 0, y: 0, z: 0 }, { x: 0.3, y: 0.3, z: 0.3 }, '#00ff00'),
        this.createObject('cube', { x: 1, y: 0.5, z: -3 }, { x: 0, y: 0, z: 0 }, { x: 0.3, y: 0.3, z: 0.3 }, '#00ff00')
      );
    } else if (words.includes('platform') || words.includes('puzzle')) {
      // Platform jumping game with collectibles
      objects.push(
        // Platforms
        this.createObject('cube', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.2, z: 2 }, '#3498db'),
        this.createObject('cube', { x: 3, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.2, z: 2 }, '#e74c3c'),
        this.createObject('cube', { x: 0, y: 2, z: 3 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.2, z: 2 }, '#2ecc71'),
        this.createObject('cube', { x: -3, y: 3, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.2, z: 2 }, '#f39c12'),
        // Collectible gems
        this.createObject('sphere', { x: 3, y: 1.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0.3, y: 0.3, z: 0.3 }, '#ff00ff'),
        this.createObject('sphere', { x: 0, y: 2.5, z: 3 }, { x: 0, y: 0, z: 0 }, { x: 0.3, y: 0.3, z: 0.3 }, '#ff00ff'),
        this.createObject('sphere', { x: -3, y: 3.5, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0.3, y: 0.3, z: 0.3 }, '#ff00ff')
      );
    } else {
      // Default adventure game objects
      objects.push(
        // Decorative objects
        this.createObject('cube', { x: 2, y: 0.5, z: 2 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#ff6b6b'),
        this.createObject('sphere', { x: -2, y: 1, z: -2 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#4ecdc4'),
        // Collectible treasure
        this.createObject('cube', { x: 3, y: 0.5, z: 3 }, { x: 0, y: 0, z: 0 }, { x: 0.5, y: 0.5, z: 0.5 }, '#ffff00'),
        this.createObject('cube', { x: -3, y: 0.5, z: -3 }, { x: 0, y: 0, z: 0 }, { x: 0.5, y: 0.5, z: 0.5 }, '#ffff00')
      );
    }

    return objects;
  }

  private static createAnalytics(prompt: string): GameAnalytics {
    const words = prompt.toLowerCase();
    const tags: string[] = [];

    // Extract tags based on prompt content
    if (words.includes('racing') || words.includes('car')) tags.push('Racing');
    if (words.includes('space') || words.includes('asteroid')) tags.push('Space');
    if (words.includes('platform') || words.includes('jump')) tags.push('Platform');
    if (words.includes('puzzle') || words.includes('solve')) tags.push('Puzzle');
    if (words.includes('battle') || words.includes('fight')) tags.push('Combat');
    if (words.includes('collect') || words.includes('item')) tags.push('Collection');
    if (words.includes('multiplayer') || words.includes('team')) tags.push('Multiplayer');
    if (words.includes('survival') || words.includes('survive')) tags.push('Survival');

    return {
      playCount: 0,
      shareCount: 0,
      remixCount: 0,
      likeCount: 0,
      lastPlayed: 0,
      tags: tags.length > 0 ? tags : ['Adventure'],
      uniqueShares: 0,
      totalPlayTime: 0,
      averagePlayTime: 0
    };
  }

  private static createDefaultAssets(gameId: string, prompt: string): GameAsset[] {
    const assets: GameAsset[] = [];
    const words = prompt.toLowerCase();

    // Create default background asset
    let backgroundUrl = '/assets/default-background.jpg';
    if (words.includes('space')) {
      backgroundUrl = '/assets/space-background.jpg';
    } else if (words.includes('racing') || words.includes('car')) {
      backgroundUrl = '/assets/racing-background.jpg';
    } else if (words.includes('platform') || words.includes('jump')) {
      backgroundUrl = '/assets/platform-background.jpg';
    }

    assets.push({
      id: uuidv4(),
      type: 'background',
      url: backgroundUrl,
      localPath: '',
      prompt: `Default background for: ${prompt}`,
      model: 'default',
      createdAt: Date.now(),
      gameId
    });

    // Create default sprite asset
    let spriteUrl = '/assets/default-sprite.png';
    if (words.includes('space')) {
      spriteUrl = '/assets/space-ship.png';
    } else if (words.includes('racing') || words.includes('car')) {
      spriteUrl = '/assets/car-sprite.png';
    } else if (words.includes('platform') || words.includes('jump')) {
      spriteUrl = '/assets/character-sprite.png';
    }

    assets.push({
      id: uuidv4(),
      type: 'sprite',
      url: spriteUrl,
      localPath: '',
      prompt: `Default sprite for: ${prompt}`,
      model: 'default',
      createdAt: Date.now(),
      gameId
    });

    return assets;
  }

  private static createObject(
    type: GameObject['type'],
    position: Vector3,
    rotation: Vector3,
    scale: Vector3,
    color: string
  ): GameObject {
    return {
      id: uuidv4(),
      type,
      position,
      rotation,
      scale,
      color,
      physics: {
        mass: 1,
        friction: 0.5,
        restitution: 0.3,
        isStatic: type === 'plane'
      }
    };
  }
}
