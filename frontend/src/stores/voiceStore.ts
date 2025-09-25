import { create } from 'zustand';
import { VoiceSettings } from '../types';

interface VoiceStore {
  // State
  availableVoices: VoiceSettings[];
  selectedVoice: VoiceSettings | null;
  isAudioEnabled: boolean;
  volume: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setAvailableVoices: (voices: VoiceSettings[]) => void;
  setSelectedVoice: (voice: VoiceSettings | null) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVoiceStore = create<VoiceStore>((set, get) => ({
  // Initial state
  availableVoices: [],
  selectedVoice: null,
  isAudioEnabled: true,
  volume: 0.7,
  isLoading: false,
  error: null,
  
  // Actions
  setAvailableVoices: (voices) => set({ availableVoices: voices }),
  
  setSelectedVoice: (voice) => set({ selectedVoice: voice }),
  
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  
  setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set({
    availableVoices: [],
    selectedVoice: null,
    isAudioEnabled: true,
    volume: 0.7,
    isLoading: false,
    error: null
  })
}));
