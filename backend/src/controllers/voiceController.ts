import { Request, Response } from 'express';
import { VoiceService } from '../services/voiceService.js';
import { z } from 'zod';

const voiceService = new VoiceService();

const generateVoiceSchema = z.object({
  text: z.string().min(1).max(1000),
  voiceId: z.string().min(1),
  stability: z.number().min(0).max(1).optional(),
  similarityBoost: z.number().min(0).max(1).optional(),
  style: z.number().min(0).max(1).optional(),
  useSpeakerBoost: z.boolean().optional()
});

const generateGameIntroSchema = z.object({
  gameName: z.string().min(1),
  gameDescription: z.string().min(1),
  voiceStyle: z.string().min(1)
});

const generateEventNarrationSchema = z.object({
  eventType: z.enum(['game_start', 'player_win', 'player_lose', 'item_collect', 'level_complete', 'player_join']),
  context: z.any().optional(),
  voiceStyle: z.string().min(1)
});

export class VoiceController {
  async generateVoice(req: Request, res: Response) {
    try {
      const request = generateVoiceSchema.parse(req.body);
      
      console.log(`Generating voice for text: ${request.text.substring(0, 50)}...`);
      
      const result = await voiceService.generateVoice(request);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }
      
      res.json({
        success: true,
        audioUrl: result.audioUrl,
        duration: result.duration
      });
    } catch (error) {
      console.error('Error generating voice:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate voice'
      });
    }
  }

  async generateGameIntro(req: Request, res: Response) {
    try {
      const { gameName, gameDescription, voiceStyle } = generateGameIntroSchema.parse(req.body);
      
      console.log(`Generating game intro for: ${gameName}`);
      
      const introText = voiceService.generateGameIntro(gameName, gameDescription, voiceStyle);
      const voice = voiceService.getVoiceById(voiceStyle);
      
      if (!voice) {
        return res.status(400).json({
          success: false,
          error: 'Invalid voice style'
        });
      }
      
      const result = await voiceService.generateVoice({
        text: introText,
        voiceId: voice.voiceId,
        stability: voice.stability,
        similarityBoost: voice.similarityBoost
      });
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }
      
      res.json({
        success: true,
        audioUrl: result.audioUrl,
        duration: result.duration,
        text: introText,
        voice: {
          id: voice.id,
          name: voice.name,
          style: voice.style
        }
      });
    } catch (error) {
      console.error('Error generating game intro:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate game intro'
      });
    }
  }

  async generateEventNarration(req: Request, res: Response) {
    try {
      const { eventType, context, voiceStyle } = generateEventNarrationSchema.parse(req.body);
      
      console.log(`Generating event narration for: ${eventType}`);
      
      const narrationText = voiceService.generateEventNarration(eventType, context, voiceStyle);
      const voice = voiceService.getVoiceById(voiceStyle);
      
      if (!voice) {
        return res.status(400).json({
          success: false,
          error: 'Invalid voice style'
        });
      }
      
      const result = await voiceService.generateVoice({
        text: narrationText,
        voiceId: voice.voiceId,
        stability: voice.stability,
        similarityBoost: voice.similarityBoost
      });
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        });
      }
      
      res.json({
        success: true,
        audioUrl: result.audioUrl,
        duration: result.duration,
        text: narrationText,
        eventType,
        voice: {
          id: voice.id,
          name: voice.name,
          style: voice.style
        }
      });
    } catch (error) {
      console.error('Error generating event narration:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate event narration'
      });
    }
  }

  async getPresetVoices(req: Request, res: Response) {
    try {
      const voices = voiceService.getPresetVoices();
      
      res.json({
        success: true,
        voices
      });
    } catch (error) {
      console.error('Error getting preset voices:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get preset voices'
      });
    }
  }

  async getVoiceById(req: Request, res: Response) {
    try {
      const { voiceId } = req.params;
      const voice = voiceService.getVoiceById(voiceId);
      
      if (!voice) {
        return res.status(404).json({
          success: false,
          error: 'Voice not found'
        });
      }
      
      res.json({
        success: true,
        voice
      });
    } catch (error) {
      console.error('Error getting voice:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get voice'
      });
    }
  }

  async cleanupAudio(req: Request, res: Response) {
    try {
      const { maxAgeHours } = req.query;
      const hours = maxAgeHours ? parseInt(maxAgeHours as string) : 24;
      
      await voiceService.cleanupOldAudio(hours);
      
      res.json({
        success: true,
        message: `Cleaned up audio files older than ${hours} hours`
      });
    } catch (error) {
      console.error('Error cleaning up audio:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cleanup audio files'
      });
    }
  }
}
