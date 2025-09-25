import OpenAI from 'openai';
import { GameGenerationRequest, GeneratedGame, AIAnalysis, GeneratedGameObject, Vector3 } from '../types/index.js';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'mock-key-for-demo'
    });
  }

  async generateGame(request: GameGenerationRequest): Promise<GeneratedGame> {
    try {
      // For demo purposes, we'll use a mock response
      // In production, this would call the actual OpenAI API
      return await this.mockGameGeneration(request);
    } catch (error) {
      console.error('Error generating game with OpenAI:', error);
      throw new Error('Failed to generate game');
    }
  }

  async analyzePrompt(prompt: string): Promise<AIAnalysis> {
    try {
      // Mock analysis for demo
      return {
        prompt,
        extractedKeywords: this.extractKeywords(prompt),
        gameType: this.determineGameType(prompt),
        complexity: this.calculateComplexity(prompt),
        suggestedImprovements: this.generateSuggestions(prompt)
      };
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      throw new Error('Failed to analyze prompt');
    }
  }

  private async mockGameGeneration(request: GameGenerationRequest): Promise<GeneratedGame> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const analysis = await this.analyzePrompt(request.prompt);
    
    return {
      id: `game_${Date.now()}`,
      name: this.generateGameName(request.prompt),
      description: request.prompt,
      gameObjects: this.generateGameObjects(request.prompt, analysis),
      rules: this.generateGameRules(request.prompt, analysis),
      metadata: {
        genre: analysis.gameType,
        estimatedPlayTime: '5-10 minutes',
        difficulty: analysis.complexity > 7 ? 'hard' : analysis.complexity > 4 ? 'medium' : 'easy',
        tags: analysis.extractedKeywords,
        createdAt: Date.now()
      }
    };
  }

  private extractKeywords(prompt: string): string[] {
    const words = prompt.toLowerCase().split(/\s+/);
    const keywords: string[] = [];
    
    const gameKeywords = ['racing', 'puzzle', 'platform', 'shooter', 'adventure', 'strategy', 'arcade'];
    const objectKeywords = ['car', 'ball', 'cube', 'sphere', 'platform', 'obstacle', 'power-up'];
    const actionKeywords = ['jump', 'run', 'collect', 'avoid', 'shoot', 'race', 'solve'];
    
    [...gameKeywords, ...objectKeywords, ...actionKeywords].forEach(keyword => {
      if (words.some(word => word.includes(keyword))) {
        keywords.push(keyword);
      }
    });
    
    return [...new Set(keywords)];
  }

  private determineGameType(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('racing') || lowerPrompt.includes('car')) return 'Racing';
    if (lowerPrompt.includes('puzzle') || lowerPrompt.includes('solve')) return 'Puzzle';
    if (lowerPrompt.includes('platform') || lowerPrompt.includes('jump')) return 'Platformer';
    if (lowerPrompt.includes('shooter') || lowerPrompt.includes('shoot')) return 'Shooter';
    if (lowerPrompt.includes('space') || lowerPrompt.includes('asteroid')) return 'Space';
    if (lowerPrompt.includes('maze') || lowerPrompt.includes('labyrinth')) return 'Maze';
    
    return 'Adventure';
  }

  private calculateComplexity(prompt: string): number {
    const words = prompt.split(/\s+/).length;
    const complexity = Math.min(Math.max(words / 10, 1), 10);
    return Math.round(complexity);
  }

  private generateSuggestions(prompt: string): string[] {
    const suggestions = [];
    
    if (prompt.length < 20) {
      suggestions.push('Add more details about game mechanics');
    }
    
    if (!prompt.toLowerCase().includes('multiplayer')) {
      suggestions.push('Consider adding multiplayer features');
    }
    
    if (!prompt.toLowerCase().includes('objective')) {
      suggestions.push('Define clear win/lose conditions');
    }
    
    return suggestions;
  }

  private generateGameName(prompt: string): string {
    const analysis = this.determineGameType(prompt);
    const adjectives = ['Epic', 'Super', 'Ultimate', 'Mega', 'Turbo', 'Neon', 'Cyber'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    return `${adjective} ${analysis}`;
  }

  private generateGameObjects(prompt: string, analysis: AIAnalysis): GeneratedGameObject[] {
    const objects: GeneratedGameObject[] = [];
    const lowerPrompt = prompt.toLowerCase();
    
    // Base ground/platform
    objects.push({
      id: 'ground',
      type: 'plane',
      position: { x: 0, y: -1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 20, y: 1, z: 20 },
      color: '#2c3e50',
      physics: { mass: 0, friction: 0.8, restitution: 0.1, isStatic: true }
    });
    
    // Generate objects based on game type
    if (lowerPrompt.includes('racing')) {
      objects.push(
        this.createObject('cube', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.5, z: 1 }, '#ff6b6b'),
        this.createObject('cube', { x: 0, y: 0, z: 5 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.5, z: 1 }, '#4ecdc4'),
        this.createObject('cube', { x: 0, y: 0, z: 10 }, { x: 0, y: 0, z: 0 }, { x: 2, y: 0.5, z: 1 }, '#45b7d1')
      );
    } else if (lowerPrompt.includes('space')) {
      objects.push(
        this.createObject('sphere', { x: 3, y: 2, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#8b4513'),
        this.createObject('sphere', { x: -2, y: 1, z: 3 }, { x: 0, y: 0, z: 0 }, { x: 0.8, y: 0.8, z: 0.8 }, '#654321'),
        this.createObject('cube', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 0.5, y: 0.5, z: 0.5 }, '#ffd700')
      );
    } else {
      // Default objects
      objects.push(
        this.createObject('cube', { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#ff6b6b'),
        this.createObject('sphere', { x: 2, y: 1, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#4ecdc4'),
        this.createObject('cube', { x: -2, y: 0, z: 2 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, '#45b7d1')
      );
    }
    
    return objects;
  }

  private createObject(
    type: GeneratedGameObject['type'],
    position: Vector3,
    rotation: Vector3,
    scale: Vector3,
    color: string
  ): GeneratedGameObject {
    return {
      id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      position,
      rotation,
      scale,
      color,
      physics: {
        mass: type === 'plane' ? 0 : 1,
        friction: 0.5,
        restitution: 0.3,
        isStatic: type === 'plane'
      }
    };
  }

  private generateGameRules(prompt: string, analysis: AIAnalysis): any {
    const lowerPrompt = prompt.toLowerCase();
    
    return {
      objective: this.generateObjective(lowerPrompt),
      winConditions: this.generateWinConditions(lowerPrompt),
      loseConditions: this.generateLoseConditions(lowerPrompt),
      controls: this.generateControls(lowerPrompt),
      mechanics: this.generateMechanics(lowerPrompt)
    };
  }

  private generateObjective(prompt: string): string {
    if (prompt.includes('racing')) return 'Race to the finish line as fast as possible';
    if (prompt.includes('puzzle')) return 'Solve puzzles to progress through levels';
    if (prompt.includes('space')) return 'Survive and collect resources in space';
    if (prompt.includes('maze')) return 'Find your way through the maze';
    return 'Complete the objective and have fun!';
  }

  private generateWinConditions(prompt: string): string[] {
    if (prompt.includes('racing')) return ['Cross the finish line first', 'Complete the race in time'];
    if (prompt.includes('puzzle')) return ['Solve all puzzles', 'Reach the end'];
    if (prompt.includes('space')) return ['Survive for a set time', 'Collect all resources'];
    return ['Complete the main objective'];
  }

  private generateLoseConditions(prompt: string): string[] {
    if (prompt.includes('racing')) return ['Fall off the track', 'Run out of time'];
    if (prompt.includes('space')) return ['Get hit by asteroids', 'Run out of fuel'];
    return ['Fall off the world', 'Take too much damage'];
  }

  private generateControls(prompt: string): string[] {
    return ['WASD or Arrow Keys to move', 'Mouse to look around', 'Space to jump', 'Shift to run'];
  }

  private generateMechanics(prompt: string): string[] {
    const mechanics = ['Movement', 'Physics'];
    
    if (prompt.includes('jump')) mechanics.push('Jumping');
    if (prompt.includes('collect')) mechanics.push('Collection');
    if (prompt.includes('power')) mechanics.push('Power-ups');
    if (prompt.includes('multiplayer')) mechanics.push('Multiplayer');
    
    return mechanics;
  }
}
