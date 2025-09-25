import { VoiceInfo } from '../types';

export interface AudioPlaybackOptions {
  volume?: number;
  loop?: boolean;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export class AudioService {
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    // Initialize audio context on user interaction
    this.initializeAudioContext();
  }

  private async initializeAudioContext(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Audio context not supported:', error);
    }
  }

  async playVoiceIntro(audioUrl: string, voice: VoiceInfo, options: AudioPlaybackOptions = {}): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await this.playAudio(audioUrl, {
        volume: options.volume || this.volume,
        onEnd: options.onEnd,
        onError: options.onError
      });

      console.log(`Playing voice intro: ${voice.name} (${voice.style})`);
    } catch (error) {
      console.error('Error playing voice intro:', error);
      options.onError?.(error as Error);
    }
  }

  async playVoiceEvent(eventType: string, audioUrl: string, voice: VoiceInfo, options: AudioPlaybackOptions = {}): Promise<void> {
    if (!this.isEnabled) return;

    try {
      await this.playAudio(audioUrl, {
        volume: options.volume || this.volume,
        onEnd: options.onEnd,
        onError: options.onError
      });

      console.log(`Playing voice event: ${eventType} - ${voice.name} (${voice.style})`);
    } catch (error) {
      console.error('Error playing voice event:', error);
      options.onError?.(error as Error);
    }
  }

  private async playAudio(audioUrl: string, options: AudioPlaybackOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop current audio if playing
      this.stopCurrentAudio();

      // Create new audio element
      const audio = new Audio(audioUrl);
      audio.volume = options.volume || this.volume;
      audio.loop = options.loop || false;

      // Handle audio events
      audio.addEventListener('ended', () => {
        this.currentAudio = null;
        options.onEnd?.();
        resolve();
      });

      audio.addEventListener('error', (event) => {
        this.currentAudio = null;
        const error = new Error(`Audio playback failed: ${audioUrl}`);
        options.onError?.(error);
        reject(error);
      });

      audio.addEventListener('canplaythrough', () => {
        // Audio is ready to play
        this.currentAudio = audio;
        audio.play().catch(reject);
      });

      // Start loading the audio
      audio.load();
    });
  }

  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.volume;
    }
  }

  getVolume(): number {
    return this.volume;
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopCurrentAudio();
    }
  }

  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  // Preload audio for better performance
  async preloadAudio(audioUrl: string): Promise<void> {
    try {
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve);
        audio.addEventListener('error', reject);
        audio.load();
      });
    } catch (error) {
      console.warn('Failed to preload audio:', audioUrl, error);
    }
  }

  // Get audio duration without playing
  async getAudioDuration(audioUrl: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.addEventListener('error', reject);
      audio.load();
    });
  }
}
