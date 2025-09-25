# Multiplayer System Documentation

## Overview

The Roam Game Super App includes a comprehensive multiplayer system built with Socket.io that allows players to connect to the same game session and see each other in real-time.

## Features Implemented

### ✅ **Core Multiplayer Features**

1. **Real-time Player Synchronization**
   - Players see each other move in real-time
   - Position updates broadcast to all connected clients
   - Smooth movement interpolation

2. **Lobby System**
   - Players can join games via game ID
   - Shareable game links and room codes
   - Player list with unique avatars and colors
   - Host controls for starting games

3. **Room Discovery**
   - Browse existing games
   - Search and filter games
   - Join games with player name input
   - Real-time room status updates

4. **Player Management**
   - Unique player avatars with colors
   - Player names displayed above avatars
   - Host/guest distinction
   - Automatic player cleanup on disconnect

5. **Game State Synchronization**
   - Shared world state across all players
   - Real-time game events (win/lose, item collection)
   - Voice announcements for multiplayer events

## Technical Implementation

### **Backend (Socket.io)**

#### Socket Events
```typescript
// Client to Server
'join_game': { gameId: string; playerName: string }
'leave_game': { gameId: string }
'player_move': { gameId: string; position: Vector3; rotation: Vector3 }
'game_event': { gameId: string; eventType: string; data: any }

// Server to Client
'game_created': { game: GameState }
'game_updated': { game: GameState }
'player_joined': { player: Player }
'player_left': { playerId: string }
'player_move': { gameId: string; position: Vector3; rotation: Vector3; playerId: string }
'game_event_broadcast': { eventType: string; data: any; timestamp: number }
```

#### Room Management
- Each game creates a Socket.io room with the game ID
- Players automatically join the room when connecting
- Events are broadcast to all players in the room
- Automatic cleanup when players disconnect

#### Player Data Structure
```typescript
interface Player {
  id: string;
  name: string;
  position: Vector3;
  rotation: Vector3;
  color: string;
  isHost: boolean;
  socketId: string;
}
```

### **Frontend (React + Socket.io Client)**

#### Components
- **GameLobby**: Main lobby interface with player list and game sharing
- **RoomDiscovery**: Browse and join existing games
- **PlayableGame**: 3D game with multiplayer player rendering
- **GamePrompt**: Entry point with room discovery option

#### State Management
- **useGameStore**: Global game state management
- **useGameplayStore**: Local player state (position, score, etc.)
- **useSocket**: Socket.io connection and event handling

#### Real-time Updates
- Player positions updated via `player_move` events
- Game state synchronized via `game_updated` events
- Voice events broadcast to all players

## User Flow

### **Creating a Game**
1. User enters game prompt
2. AI generates game with unique ID
3. User becomes host and enters lobby
4. Game link/code can be shared

### **Joining a Game**
1. **Via Link**: Click shared link → auto-join game
2. **Via Code**: Enter game code in lobby
3. **Via Discovery**: Browse existing games and join
4. Enter player name and join game

### **Playing Multiplayer**
1. All players see each other in 3D world
2. Real-time movement synchronization
3. Shared game objectives and mechanics
4. Voice announcements for events
5. Win/lose conditions apply to all players

## Session Management

### **Room Creation**
- Games are created with unique UUIDs
- Room persists until all players leave
- Automatic cleanup after inactivity

### **Player Limits**
- Default max players: 8 per game
- Configurable per game type
- Graceful handling of full rooms

### **Connection Handling**
- Automatic reconnection on network issues
- Player state preservation during reconnects
- Graceful handling of disconnections

## Security Considerations

### **Input Validation**
- Player names sanitized and limited
- Game IDs validated before joining
- Rate limiting on movement updates

### **Data Privacy**
- Public game listings exclude sensitive data
- Player positions only shared within game rooms
- No persistent storage of player data

## Performance Optimizations

### **Network Efficiency**
- Movement updates throttled to 20fps
- Only essential data transmitted
- Compression for large game states

### **Rendering Optimization**
- Other players rendered as simple capsules
- LOD system for distant players
- Efficient collision detection

## API Endpoints

### **Game Management**
```
GET /api/games - List all public games
GET /api/games/:gameId - Get specific game details
POST /api/games/generate - Create new game
DELETE /api/games/:gameId - Delete game (host only)
```

### **Socket Events**
- All real-time communication via Socket.io
- No REST endpoints for live gameplay
- WebSocket connection for low latency

## Browser Compatibility

### **Supported Features**
- Modern browsers with WebSocket support
- WebGL for 3D rendering
- Web Audio API for voice features

### **Fallbacks**
- Polling fallback for WebSocket issues
- 2D rendering fallback for WebGL issues
- Text-only fallback for audio issues

## Testing Multiplayer

### **Local Testing**
1. Start backend server: `npm run dev:backend`
2. Start frontend: `npm run dev:frontend`
3. Open multiple browser tabs/windows
4. Create game in one tab, join in others

### **Network Testing**
1. Deploy to staging environment
2. Test from different devices/networks
3. Verify real-time synchronization
4. Test connection recovery

## Future Enhancements

### **Planned Features**
- Spectator mode for watching games
- Tournament brackets and matchmaking
- Custom game modes and rules
- Player profiles and statistics
- Chat system for communication
- Screen sharing for collaboration

### **Technical Improvements**
- Dedicated game servers for better performance
- Advanced anti-cheat systems
- Cross-platform mobile support
- VR/AR multiplayer support
- Advanced physics synchronization

## Troubleshooting

### **Common Issues**
1. **Players not seeing each other**: Check Socket.io connection
2. **Movement lag**: Verify network connection and server performance
3. **Game not found**: Ensure game ID is correct and game exists
4. **Voice not working**: Check ElevenLabs API key and browser permissions

### **Debug Tools**
- Browser developer tools for network monitoring
- Socket.io debug mode for connection issues
- Console logging for game state debugging
- Performance monitoring for optimization

## Conclusion

The multiplayer system provides a solid foundation for real-time collaborative gaming with room management, player synchronization, and voice integration. The architecture is designed to scale and can be extended with additional features as needed.
