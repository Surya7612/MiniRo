import { Server as SocketIOServer, Socket } from 'socket.io';
import { GameService } from './gameService.js';
import { VoiceService } from './voiceService.js';
import { SocketEvents } from '../types/index.js';

export class SocketService {
  private io: SocketIOServer;
  private gameService: GameService;
  private voiceService: VoiceService;
  private gameVoiceSettings: Map<string, string> = new Map(); // gameId -> voiceStyle

  constructor(io: SocketIOServer) {
    this.io = io;
    this.gameService = new GameService();
    this.voiceService = new VoiceService();
    
    // Optimize Socket.io for fast multiplayer
    this.optimizeForMultiplayer();
    this.setupSocketHandlers();
  }

  private optimizeForMultiplayer() {
    // Configure Socket.io for optimal multiplayer performance
    this.io.engine.on('connection_error', (err) => {
      console.log('Socket.io connection error:', err.req, err.code, err.message, err.context);
    });

    // Optimize for low latency
    this.io.engine.opts.pingTimeout = 60000;
    this.io.engine.opts.pingInterval = 25000;
    
    // Enable binary data for position updates
    this.io.engine.opts.allowEIO3 = true;
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle game generation
      socket.on('generate_game', async (data: SocketEvents['generate_game'] & { voiceStyle?: string }) => {
        try {
          console.log(`Generating game for prompt: ${data.prompt}`);
          const game = await this.gameService.createGame(data.prompt);
          
          // Set default voice style if not provided
          const voiceStyle = data.voiceStyle || 'narrator-classic';
          this.gameVoiceSettings.set(game.id, voiceStyle);
          
          // Join the socket to the game room
          socket.join(game.id);
          
          // Generate game intro voice
          try {
            const introText = this.voiceService.generateGameIntro(game.name, game.description, voiceStyle);
            const voice = this.voiceService.getVoiceById(voiceStyle);
            
            if (voice) {
              const voiceResult = await this.voiceService.generateVoice({
                text: introText,
                voiceId: voice.voiceId,
                stability: voice.stability,
                similarityBoost: voice.similarityBoost
              });
              
              if (voiceResult.success) {
                // Emit voice intro to the game room
                this.io.to(game.id).emit('voice_intro', {
                  audioUrl: voiceResult.audioUrl,
                  text: introText,
                  voice: {
                    id: voice.id,
                    name: voice.name,
                    style: voice.style
                  }
                });
              }
            }
          } catch (voiceError) {
            console.error('Error generating voice intro:', voiceError);
            // Continue without voice if it fails
          }
          
          // Emit game created event
          socket.emit('game_created', { game });
          
          // Broadcast to all clients that a new game was created
          this.io.emit('game_updated', { game });
          
        } catch (error) {
          console.error('Error generating game:', error);
          socket.emit('error', { message: 'Failed to generate game' });
        }
      });

      // Handle joining a game
      socket.on('join_game', (data: SocketEvents['join_game']) => {
        try {
          const { gameId, playerName } = data;
          const game = this.gameService.getGame(gameId);
          
          if (!game) {
            socket.emit('error', { message: 'Game not found' });
            return;
          }

          // Add player to game
          const player = this.gameService.addPlayer(gameId, playerName, socket.id);
          
          if (!player) {
            socket.emit('error', { message: 'Failed to join game' });
            return;
          }

          // Join socket to game room
          socket.join(gameId);
          
          // Emit player joined event to all players in the game
          this.io.to(gameId).emit('player_joined', { player });
          
          // Emit updated game state
          const updatedGame = this.gameService.getGame(gameId);
          if (updatedGame) {
            this.io.to(gameId).emit('game_updated', { game: updatedGame });
          }

          // Create and emit game event
          const event = this.gameService.createGameEvent('player_join', { player });
          this.io.to(gameId).emit('game_event', { event });
          
          // Generate voice narration for player join
          this.generateEventVoice(gameId, 'player_join', { player });
          
        } catch (error) {
          console.error('Error joining game:', error);
          socket.emit('error', { message: 'Failed to join game' });
        }
      });

      // Handle leaving a game
      socket.on('leave_game', (data: SocketEvents['leave_game']) => {
        try {
          const { gameId } = data;
          const playerId = this.gameService.removePlayer(gameId, socket.id);
          
          if (playerId) {
            // Leave socket from game room
            socket.leave(gameId);
            
            // Emit player left event to all players in the game
            this.io.to(gameId).emit('player_left', { playerId });
            
            // Emit updated game state
            const updatedGame = this.gameService.getGame(gameId);
            if (updatedGame) {
              this.io.to(gameId).emit('game_updated', { game: updatedGame });
            }

            // Create and emit game event
            const event = this.gameService.createGameEvent('player_leave', { playerId });
            this.io.to(gameId).emit('game_event', { event });
          }
          
        } catch (error) {
          console.error('Error leaving game:', error);
          socket.emit('error', { message: 'Failed to leave game' });
        }
      });

      // Handle player movement with throttling for performance
      let lastMoveTime = 0;
      const MOVE_THROTTLE_MS = 50; // Limit to 20 updates per second
      
      socket.on('player_move', (data: SocketEvents['player_move']) => {
        try {
          const now = Date.now();
          
          // Throttle movement updates to prevent spam
          if (now - lastMoveTime < MOVE_THROTTLE_MS) {
            return;
          }
          lastMoveTime = now;
          
          const { gameId, position, rotation } = data;
          const success = this.gameService.updatePlayerPosition(gameId, socket.id, position, rotation);
          
          if (success) {
            // Broadcast player movement to all other players in the game
            // Use optimized data structure for faster transmission
            socket.to(gameId).emit('player_move', { 
              gameId, 
              position, 
              rotation,
              playerId: socket.id,
              timestamp: now
            });
          }
          
        } catch (error) {
          console.error('Error updating player position:', error);
          socket.emit('error', { message: 'Failed to update player position' });
        }
      });

      // Handle game events (win, lose, collect item)
      socket.on('game_event', (data: { gameId: string; eventType: string; data: any }) => {
        try {
          const { gameId, eventType, data: eventData } = data;
          const game = this.gameService.getGame(gameId);
          
          if (!game) {
            socket.emit('error', { message: 'Game not found' });
            return;
          }

          // Handle different game events
          switch (eventType) {
            case 'item_collect':
              // Generate voice event for item collection
              this.generateEventVoice(gameId, 'item_collect', eventData);
              break;
            
            case 'player_win':
              game.status = 'ended';
              this.generateEventVoice(gameId, 'player_win', eventData);
              break;
            
            case 'player_lose':
              game.status = 'ended';
              this.generateEventVoice(gameId, 'player_lose', eventData);
              break;
          }

          // Broadcast game event to all players
          this.io.to(gameId).emit('game_event_broadcast', {
            eventType,
            data: eventData,
            timestamp: Date.now()
          });

          // Update game state
          this.io.to(gameId).emit('game_updated', { game });
          
        } catch (error) {
          console.error('Error handling game event:', error);
          socket.emit('error', { message: 'Failed to handle game event' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        
        // Remove player from all games they were in
        const games = this.gameService.getAllGames();
        games.forEach(game => {
          const playerId = this.gameService.removePlayer(game.id, socket.id);
          if (playerId) {
            this.io.to(game.id).emit('player_left', { playerId });
            
            const updatedGame = this.gameService.getGame(game.id);
            if (updatedGame) {
              this.io.to(game.id).emit('game_updated', { game: updatedGame });
            }
          }
        });
      });
    });
  }

  getGameService(): GameService {
    return this.gameService;
  }

  private async generateEventVoice(gameId: string, eventType: string, context: any): Promise<void> {
    try {
      const voiceStyle = this.gameVoiceSettings.get(gameId);
      if (!voiceStyle) return;

      const narrationText = this.voiceService.generateEventNarration(eventType, context, voiceStyle);
      const voice = this.voiceService.getVoiceById(voiceStyle);
      
      if (!voice) return;

      const voiceResult = await this.voiceService.generateVoice({
        text: narrationText,
        voiceId: voice.voiceId,
        stability: voice.stability,
        similarityBoost: voice.similarityBoost
      });

      if (voiceResult.success) {
        this.io.to(gameId).emit('voice_event', {
          eventType,
          audioUrl: voiceResult.audioUrl,
          text: narrationText,
          voice: {
            id: voice.id,
            name: voice.name,
            style: voice.style
          }
        });
      }
    } catch (error) {
      console.error('Error generating event voice:', error);
      // Continue without voice if it fails
    }
  }

  // Method to trigger voice events from game logic
  async triggerGameEvent(gameId: string, eventType: string, context: any): Promise<void> {
    await this.generateEventVoice(gameId, eventType, context);
  }
}
