import { create } from 'zustand';
import { GameState, Player, GameEvent } from '../types';

interface GameStore {
  // State
  currentGame: GameState | null;
  isConnected: boolean;
  isGenerating: boolean;
  error: string | null;
  
  // Actions
  setCurrentGame: (game: GameState | null) => void;
  updateGame: (updates: Partial<GameState>) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  addGameEvent: (event: GameEvent) => void;
  setConnected: (connected: boolean) => void;
  setGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentGame: null,
  isConnected: false,
  isGenerating: false,
  error: null,
  
  // Actions
  setCurrentGame: (game) => set({ currentGame: game }),
  
  updateGame: (updates) => set((state) => ({
    currentGame: state.currentGame ? { ...state.currentGame, ...updates } : null
  })),
  
  addPlayer: (player) => set((state) => ({
    currentGame: state.currentGame ? {
      ...state.currentGame,
      players: [...state.currentGame.players, player]
    } : null
  })),
  
  removePlayer: (playerId) => set((state) => ({
    currentGame: state.currentGame ? {
      ...state.currentGame,
      players: state.currentGame.players.filter(p => p.id !== playerId)
    } : null
  })),
  
  updatePlayer: (playerId, updates) => set((state) => ({
    currentGame: state.currentGame ? {
      ...state.currentGame,
      players: state.currentGame.players.map(p => 
        p.id === playerId ? { ...p, ...updates } : p
      )
    } : null
  })),
  
  addGameEvent: (event) => set((state) => ({
    currentGame: state.currentGame ? {
      ...state.currentGame,
      // Add event to game history if needed
    } : null
  })),
  
  setConnected: (connected) => set({ isConnected: connected }),
  setGenerating: (generating) => set({ isGenerating: generating }),
  setError: (error) => set({ error }),
  
  reset: () => set({
    currentGame: null,
    isConnected: false,
    isGenerating: false,
    error: null
  })
}));
