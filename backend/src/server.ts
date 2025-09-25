import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import helmet from 'helmet';

import { corsMiddleware } from './middleware/cors.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { GameController } from './controllers/gameController.js';
import { VoiceController } from './controllers/voiceController.js';
import { AssetController } from './controllers/assetController.js';
import { SocketService } from './services/socketService.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (audio files and assets)
app.use('/audio', express.static('public/audio'));
app.use('/assets', express.static('public/assets'));

// Initialize services
const gameController = new GameController();
const voiceController = new VoiceController();
const assetController = new AssetController();
const socketService = new SocketService(io);

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'roam-game-backend'
  });
});

// Game routes
app.get('/api/games', (req, res) => gameController.getAllGames(req, res));
app.get('/api/games/:gameId', (req, res) => gameController.getGame(req, res));
app.post('/api/games/generate', (req, res) => gameController.generateGame(req, res));
app.delete('/api/games/:gameId', (req, res) => gameController.deleteGame(req, res));

// Analytics routes
app.post('/api/games/:gameId/track/play', (req, res) => gameController.trackGamePlay(req, res));
app.post('/api/games/:gameId/track/share', (req, res) => gameController.trackGameShare(req, res));
app.post('/api/games/:gameId/track/remix', (req, res) => gameController.trackGameRemix(req, res));
app.post('/api/games/:gameId/track/like', (req, res) => gameController.trackGameLike(req, res));
app.get('/api/games/viral', (req, res) => gameController.getViralGames(req, res));
app.get('/api/games/:gameId/analytics', (req, res) => gameController.getGameAnalytics(req, res));
app.get('/api/analytics/global', (req, res) => gameController.getGlobalAnalytics(req, res));

// Asset routes
app.post('/api/assets/generate', (req, res) => assetController.generateAssets(req, res));
app.post('/api/assets/select', (req, res) => assetController.selectAsset(req, res));
app.get('/api/games/:gameId/assets', (req, res) => assetController.getGameAssets(req, res));
app.delete('/api/assets/:assetId', (req, res) => assetController.deleteAsset(req, res));

// Voice routes
app.get('/api/voices', (req, res) => voiceController.getPresetVoices(req, res));
app.get('/api/voices/:voiceId', (req, res) => voiceController.getVoiceById(req, res));
app.post('/api/voices/generate', (req, res) => voiceController.generateVoice(req, res));
app.post('/api/voices/game-intro', (req, res) => voiceController.generateGameIntro(req, res));
app.post('/api/voices/event-narration', (req, res) => voiceController.generateEventNarration(req, res));
app.post('/api/voices/cleanup', (req, res) => voiceController.cleanupAudio(req, res));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
