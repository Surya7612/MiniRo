import { Request, Response } from 'express';
import { OpenAIService } from '../services/openaiService.js';
import { z } from 'zod';

const openaiService = new OpenAIService();

const generateGameSchema = z.object({
  prompt: z.string().min(1).max(1000),
  options: z.object({
    style: z.enum(['realistic', 'cartoon', 'abstract', 'pixel']).optional(),
    complexity: z.enum(['simple', 'medium', 'complex']).optional(),
    multiplayer: z.boolean().optional(),
    maxPlayers: z.number().min(2).max(10).optional()
  }).optional()
});

const analyzePromptSchema = z.object({
  prompt: z.string().min(1).max(1000)
});

export class AIController {
  async generateGame(req: Request, res: Response) {
    try {
      const startTime = Date.now();
      const { prompt, options } = generateGameSchema.parse(req.body);
      
      console.log(`Generating game for prompt: ${prompt}`);
      
      const game = await openaiService.generateGame({ prompt, options });
      const processingTime = Date.now() - startTime;
      
      res.json({
        success: true,
        game,
        processingTime
      });
    } catch (error) {
      console.error('Error generating game:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate game'
      });
    }
  }

  async analyzePrompt(req: Request, res: Response) {
    try {
      const { prompt } = analyzePromptSchema.parse(req.body);
      
      console.log(`Analyzing prompt: ${prompt}`);
      
      const analysis = await openaiService.analyzePrompt(prompt);
      
      res.json({
        success: true,
        analysis
      });
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze prompt'
      });
    }
  }

  async healthCheck(req: Request, res: Response) {
    res.json({
      status: 'ok',
      service: 'roam-game-ai',
      timestamp: new Date().toISOString(),
      features: [
        'Game Generation',
        'Prompt Analysis',
        'AI-powered Game Objects',
        'Dynamic Game Rules'
      ]
    });
  }
}
