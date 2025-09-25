export interface GamePrompt {
  id: string;
  description: string;
  timestamp: number;
}

export interface GameState {
  id: string;
  name: string;
  description: string;
  players: Player[];
  gameObjects: GameObject[];
  gameLogic: GameLogic;
  status: 'generating' | 'ready' | 'playing' | 'ended';
  createdAt: number;
  analytics: GameAnalytics;
  isRemix: boolean;
  originalGameId?: string;
  creator?: string;
  assets: GameAsset[];
  selectedAsset?: string;
}

export interface GameAnalytics {
  playCount: number;
  shareCount: number;
  remixCount: number;
  likeCount: number;
  lastPlayed: number;
  tags: string[];
  uniqueShares: number;
  totalPlayTime: number;
  averagePlayTime: number;
}

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

export interface GameLogic {
  objective: string;
  winConditions: string[];
  loseConditions: string[];
  controls: string[];
  mechanics: string[];
  playerStartPosition: Vector3;
  goalPosition: Vector3;
  obstacles: GameObject[];
  collectibles: GameObject[];
  timeLimit?: number;
  scoreTarget?: number;
}

export interface Player {
  id: string;
  name: string;
  position: Vector3;
  rotation: Vector3;
  color: string;
  isHost: boolean;
}

export interface GameObject {
  id: string;
  type: 'cube' | 'sphere' | 'plane' | 'custom';
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  color: string;
  material?: string;
  physics?: PhysicsProperties;
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

export interface GameEvent {
  type: 'player_join' | 'player_leave' | 'player_move' | 'object_spawn' | 'object_destroy' | 'game_start' | 'game_end';
  data: any;
  timestamp: number;
}

export interface SocketEvents {
  // Client to Server
  'join_game': { gameId: string; playerName: string };
  'leave_game': { gameId: string };
  'player_move': { gameId: string; position: Vector3; rotation: Vector3 };
  'generate_game': { prompt: string; voiceStyle?: string };
  'game_event': { gameId: string; eventType: string; data: any };
  
  // Server to Client
  'game_created': { game: GameState };
  'game_updated': { game: GameState };
  'player_joined': { player: Player };
  'player_left': { playerId: string };
  'game_event': { event: GameEvent };
  'game_event_broadcast': { eventType: string; data: any; timestamp: number };
  'voice_intro': { audioUrl: string; text: string; voice: VoiceInfo };
  'voice_event': { eventType: string; audioUrl: string; text: string; voice: VoiceInfo };
  'error': { message: string };
}

export interface VoiceInfo {
  id: string;
  name: string;
  style: 'narrator' | 'character' | 'announcer' | 'guide';
}

export interface VoiceSettings {
  id: string;
  name: string;
  description: string;
  voiceId: string;
  style: 'narrator' | 'character' | 'announcer' | 'guide';
  stability: number;
  similarityBoost: number;
}
