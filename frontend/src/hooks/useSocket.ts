import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../stores/gameStore';
import { useVoiceStore } from '../stores/voiceStore';
import { AudioService } from '../services/audioService';
import { SocketEvents, GameState, Player, GameEvent, VoiceInfo } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5002';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const audioServiceRef = useRef<AudioService | null>(null);
  
  const {
    setConnected,
    setCurrentGame,
    updateGame,
    addPlayer,
    removePlayer,
    updatePlayer,
    addGameEvent,
    setError
  } = useGameStore();

  const { isAudioEnabled, volume } = useVoiceStore();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    // Initialize audio service
    audioServiceRef.current = new AudioService();

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to server');
    });

    // Game events
    socket.on('game_created', (data: { game: GameState }) => {
      console.log('🎮 Game created:', data.game.name, data.game.description);
      setCurrentGame(data.game);
    });

    socket.on('game_updated', (data: { game: GameState }) => {
      console.log('Game updated:', data.game);
      setCurrentGame(data.game);
    });

    socket.on('player_joined', (data: { player: Player }) => {
      console.log('Player joined:', data.player);
      addPlayer(data.player);
    });

    socket.on('player_left', (data: { playerId: string }) => {
      console.log('Player left:', data.playerId);
      removePlayer(data.playerId);
    });

    // Handle real-time player movement
    socket.on('player_move', (data: { gameId: string; position: Vector3; rotation: Vector3; playerId: string }) => {
      console.log('Player moved:', data);
      // Update the specific player's position
      updatePlayer(data.playerId, { position: data.position, rotation: data.rotation });
    });

    socket.on('game_event', (data: { event: GameEvent }) => {
      console.log('Game event:', data.event);
      addGameEvent(data.event);
    });

    socket.on('error', (data: { message: string }) => {
      console.error('Server error:', data.message);
      setError(data.message);
    });

    // Voice events
    socket.on('voice_intro', async (data: { audioUrl: string; text: string; voice: VoiceInfo }) => {
      console.log('Voice intro received:', data);
      if (audioServiceRef.current && isAudioEnabled) {
        try {
          await audioServiceRef.current.playVoiceIntro(
            data.audioUrl,
            data.voice,
            { volume }
          );
        } catch (error) {
          console.error('Error playing voice intro:', error);
        }
      }
    });

    socket.on('voice_event', async (data: { eventType: string; audioUrl: string; text: string; voice: VoiceInfo }) => {
      console.log('Voice event received:', data);
      if (audioServiceRef.current && isAudioEnabled) {
        try {
          await audioServiceRef.current.playVoiceEvent(
            data.eventType,
            data.audioUrl,
            data.voice,
            { volume }
          );
        } catch (error) {
          console.error('Error playing voice event:', error);
        }
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [setConnected, setCurrentGame, addPlayer, removePlayer, addGameEvent, setError]);

  const emit = <K extends keyof SocketEvents>(
    event: K,
    data: SocketEvents[K]
  ) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const joinGame = (gameId: string, playerName: string) => {
    emit('join_game', { gameId, playerName });
  };

  const leaveGame = (gameId: string) => {
    emit('leave_game', { gameId });
  };

  const updatePlayerPosition = (gameId: string, position: any, rotation: any) => {
    emit('player_move', { gameId, position, rotation });
  };

  const generateGame = (prompt: string, voiceStyle?: string) => {
    console.log('🚀 Generating game with prompt:', prompt);
    
    // Clear current game state before generating new one
    setCurrentGame(null);
    setError(null);
    
    emit('generate_game', { prompt, voiceStyle });
  };

  const sendGameEvent = (gameId: string, eventType: string, data: any) => {
    emit('game_event', { gameId, eventType, data });
  };

  return {
    socket: socketRef.current,
    emit,
    joinGame,
    leaveGame,
    updatePlayerPosition,
    generateGame,
    sendGameEvent
  };
};
