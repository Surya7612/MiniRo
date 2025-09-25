import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';

import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { AIController } from './controllers/aiController.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize controller
const aiController = new AIController();

// Routes
app.get('/health', (req, res) => aiController.healthCheck(req, res));
app.post('/api/generate-game', (req, res) => aiController.generateGame(req, res));
app.post('/api/analyze-prompt', (req, res) => aiController.analyzePrompt(req, res));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🤖 AI Service running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🎮 Game generation: http://localhost:${PORT}/api/generate-game`);
  console.log(`🧠 Prompt analysis: http://localhost:${PORT}/api/analyze-prompt`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down AI service gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down AI service gracefully');
  process.exit(0);
});
