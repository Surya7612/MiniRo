import { create } from 'zustand';
import { Vector3 } from '../types';

interface GameplayState {
  // Game state
  playerPosition: Vector3;
  score: number;
  timeLeft: number;
  gameStatus: 'playing' | 'won' | 'lost' | 'paused';
  collectedItems: Set<string>;
  isGrounded: boolean;
  
  // Actions
  setPlayerPosition: (position: Vector3) => void;
  setScore: (score: number) => void;
  setTimeLeft: (time: number) => void;
  setGameStatus: (status: 'playing' | 'won' | 'lost' | 'paused') => void;
  addCollectedItem: (itemId: string) => void;
  setGrounded: (grounded: boolean) => void;
  resetGame: () => void;
}

export const useGameplayStore = create<GameplayState>((set, get) => ({
  // Initial state
  playerPosition: { x: 0, y: 1, z: 0 },
  score: 0,
  timeLeft: 0,
  gameStatus: 'playing',
  collectedItems: new Set(),
  isGrounded: false,
  
  // Actions
  setPlayerPosition: (position) => set({ playerPosition: position }),
  
  setScore: (score) => set({ score }),
  
  setTimeLeft: (time) => set({ timeLeft: time }),
  
  setGameStatus: (status) => set({ gameStatus: status }),
  
  addCollectedItem: (itemId) => set((state) => ({
    collectedItems: new Set([...state.collectedItems, itemId])
  })),
  
  setGrounded: (grounded) => set({ isGrounded: grounded }),
  
  resetGame: () => set({
    playerPosition: { x: 0, y: 1, z: 0 },
    score: 0,
    timeLeft: 0,
    gameStatus: 'playing',
    collectedItems: new Set(),
    isGrounded: false
  })
}));
