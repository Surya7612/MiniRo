import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/environment.js';

export interface VoiceSettings {
  id: string;
  name: string;
  description: string;
  voiceId: string;
  style: 'narrator' | 'character' | 'announcer' | 'guide';
  stability: number;
  similarityBoost: number;
}

export interface VoiceGenerationRequest {
  text: string;
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

export interface VoiceGenerationResponse {
  success: boolean;
  audioUrl?: string;
  audioPath?: string;
  error?: string;
  duration?: number;
}

export class VoiceService {
  private apiKey: string;
  private baseUrl: string = 'https://api.elevenlabs.io/v1';
  private audioDir: string;
  
  // Preset voices for different game scenarios
  private presetVoices: VoiceSettings[] = [
    {
      id: 'narrator-classic',
      name: 'Classic Narrator',
      description: 'Warm, engaging narrator perfect for game introductions',
      voiceId: 'F6rDBJ205pxOgOMuBK3T', // Your custom narrator voice
      style: 'narrator',
      stability: 0.5,
      similarityBoost: 0.8
    },
    {
      id: 'character-heroic',
      name: 'Heroic Character',
      description: 'Bold, adventurous voice for action games',
      voiceId: '8Es4wFxsDlHBmFWAOWRS', // Your custom energetic character voice
      style: 'character',
      stability: 0.4,
      similarityBoost: 0.9
    },
    {
      id: 'announcer-sports',
      name: 'Sports Announcer',
      description: 'Energetic announcer perfect for racing and competitive games',
      voiceId: 'mtrellq69YZsNwzUSyXh', // Your custom announcer voice
      style: 'announcer',
      stability: 0.3,
      similarityBoost: 0.7
    },
    {
      id: 'guide-mystical',
      name: 'Mystical Guide',
      description: 'Mysterious, wise voice for puzzle and adventure games',
      voiceId: 'DMyrgzQFny3JI1Y1paM5', // Your custom guide voice
      style: 'guide',
      stability: 0.6,
      similarityBoost: 0.8
    }
  ];

  constructor() {
    this.apiKey = config.elevenLabsApiKey;
    this.audioDir = path.join(process.cwd(), 'public', 'audio');
    
    // Ensure audio directory exists
    fs.ensureDirSync(this.audioDir);
  }

  async generateVoice(request: VoiceGenerationRequest): Promise<VoiceGenerationResponse> {
    try {
      if (!this.apiKey) {
        console.warn('ElevenLabs API key not provided, using mock voice generation');
        return this.mockVoiceGeneration(request);
      }

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${request.voiceId}`,
        {
          text: request.text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: request.stability || 0.5,
            similarity_boost: request.similarityBoost || 0.8,
            style: request.style || 0.0,
            use_speaker_boost: request.useSpeakerBoost || true
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey
          },
          responseType: 'arraybuffer'
        }
      );

      // Generate unique filename
      const filename = `voice_${uuidv4()}.mp3`;
      const filePath = path.join(this.audioDir, filename);
      
      // Save audio file
      await fs.writeFile(filePath, response.data);
      
      // Generate public URL
      const audioUrl = `/audio/${filename}`;
      
      return {
        success: true,
        audioUrl,
        audioPath: filePath,
        duration: this.estimateDuration(request.text)
      };

    } catch (error) {
      console.error('Error generating voice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate voice'
      };
    }
  }

  private async mockVoiceGeneration(request: VoiceGenerationRequest): Promise<VoiceGenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // For demo purposes, return a mock response
    return {
      success: true,
      audioUrl: '/audio/mock-voice.mp3', // This would be a pre-recorded mock file
      duration: this.estimateDuration(request.text)
    };
  }

  private estimateDuration(text: string): number {
    // Rough estimation: average speaking rate is ~150 words per minute
    const words = text.split(' ').length;
    return Math.max(1, Math.round((words / 150) * 60));
  }

  getPresetVoices(): VoiceSettings[] {
    return this.presetVoices;
  }

  getVoiceById(voiceId: string): VoiceSettings | undefined {
    return this.presetVoices.find(voice => voice.id === voiceId);
  }

  // Generate game-specific voice content
  generateGameIntro(gameName: string, gameDescription: string, voiceStyle: string): string {
    const voice = this.getVoiceById(voiceStyle);
    const style = voice?.style || 'narrator';

    switch (style) {
      case 'narrator':
        return `Welcome to ${gameName}! ${gameDescription}. Your adventure begins now. Good luck, and may the best player win!`;
      
      case 'character':
        return `Greetings, brave adventurer! You've entered the world of ${gameName}. ${gameDescription}. Are you ready for this epic journey?`;
      
      case 'announcer':
        return `Ladies and gentlemen, welcome to ${gameName}! ${gameDescription}. Let the games begin!`;
      
      case 'guide':
        return `Step into the mystical realm of ${gameName}. ${gameDescription}. I shall guide you through this enchanted world.`;
      
      default:
        return `Welcome to ${gameName}! ${gameDescription}. Let's begin!`;
    }
  }

  generateEventNarration(eventType: string, context: any, voiceStyle: string): string {
    const voice = this.getVoiceById(voiceStyle);
    const style = voice?.style || 'narrator';

    switch (eventType) {
      case 'game_start':
        return style === 'announcer' 
          ? 'The game has begun! Let the competition start!'
          : 'The game begins now. Good luck!';
      
      case 'player_win':
        return style === 'announcer'
          ? 'Incredible! You have achieved victory!'
          : 'Congratulations! You have won!';
      
      case 'player_lose':
        return style === 'announcer'
          ? 'Game over! Better luck next time!'
          : 'Game over. Don\'t give up!';
      
      case 'item_collect':
        return style === 'character'
          ? 'Excellent! You found something useful!'
          : 'Item collected!';
      
      case 'level_complete':
        return style === 'guide'
          ? 'Well done! You have mastered this challenge.'
          : 'Level completed!';
      
      case 'player_join':
        return style === 'announcer'
          ? 'A new player has joined the game!'
          : 'Welcome, new player!';
      
      default:
        return 'Something interesting happened!';
    }
  }

  // Clean up old audio files (call this periodically)
  async cleanupOldAudio(maxAgeHours: number = 24): Promise<void> {
    try {
      const files = await fs.readdir(this.audioDir);
      const now = Date.now();
      const maxAge = maxAgeHours * 60 * 60 * 1000;

      for (const file of files) {
        if (file.startsWith('voice_') && file.endsWith('.mp3')) {
          const filePath = path.join(this.audioDir, file);
          const stats = await fs.stat(filePath);
          
          if (now - stats.mtime.getTime() > maxAge) {
            await fs.remove(filePath);
            console.log(`Cleaned up old audio file: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up audio files:', error);
    }
  }
}
