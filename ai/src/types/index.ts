export interface GameGenerationRequest {
  prompt: string;
  userId?: string;
  options?: GameGenerationOptions;
}

export interface GameGenerationOptions {
  style?: 'realistic' | 'cartoon' | 'abstract' | 'pixel';
  complexity?: 'simple' | 'medium' | 'complex';
  multiplayer?: boolean;
  maxPlayers?: number;
}

export interface GameGenerationResponse {
  success: boolean;
  game?: GeneratedGame;
  error?: string;
  processingTime?: number;
}

export interface GeneratedGame {
  id: string;
  name: string;
  description: string;
  gameObjects: GeneratedGameObject[];
  rules: GameRules;
  metadata: GameMetadata;
}

export interface GeneratedGameObject {
  id: string;
  type: 'cube' | 'sphere' | 'plane' | 'custom';
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  color: string;
  material?: string;
  physics?: PhysicsProperties;
  properties?: Record<string, any>;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface PhysicsProperties {
  mass: number;
  friction: number;
  restitution: number;
  isStatic: boolean;
}

export interface GameRules {
  objective: string;
  winConditions: string[];
  loseConditions: string[];
  controls: string[];
  mechanics: string[];
}

export interface GameMetadata {
  genre: string;
  estimatedPlayTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: number;
}

export interface AIAnalysis {
  prompt: string;
  extractedKeywords: string[];
  gameType: string;
  complexity: number;
  suggestedImprovements: string[];
}
