import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Clock, Play, RefreshCw } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

interface GameRoom {
  id: string;
  name: string;
  description: string;
  players: number;
  maxPlayers: number;
  status: string;
  createdAt: number;
}

interface RoomDiscoveryProps {
  onJoinRoom: (roomId: string) => void;
  onClose: () => void;
}

const RoomDiscovery: React.FC<RoomDiscoveryProps> = ({ onJoinRoom, onClose }) => {
  const [rooms, setRooms] = useState<GameRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [playerName, setPlayerName] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/games');
      const data = await response.json();
      
      if (data.success) {
        const gameRooms: GameRoom[] = data.games.map((game: any) => ({
          id: game.id,
          name: game.name,
          description: game.description,
          players: game.players.length,
          maxPlayers: 8, // Default max players
          status: game.status,
          createdAt: game.createdAt
        }));
        setRooms(gameRooms);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleJoinRoom = (roomId: string) => {
    if (!playerName.trim()) {
      alert('Please enter your name first');
      return;
    }
    onJoinRoom(roomId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Find Games</h2>
          <motion.button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        {/* Player Name Input */}
        <div className="mb-6">
          <label className="block text-white/80 text-sm mb-2">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name to join games"
            className="input w-full"
            maxLength={20}
          />
        </div>

        {/* Search and Refresh */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search games..."
              className="input w-full pl-10"
            />
          </div>
          <motion.button
            onClick={fetchRooms}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-white/60">Loading games...</div>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-white/60 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No games found</p>
                <p className="text-sm">Try adjusting your search or create a new game</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRooms.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium text-lg">{room.name}</h3>
                      <p className="text-white/60 text-sm line-clamp-2">{room.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(room.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {room.players}/{room.maxPlayers}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        room.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                        room.status === 'playing' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {room.status}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => handleJoinRoom(room.id)}
                    disabled={!playerName.trim() || room.players >= room.maxPlayers}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    {room.players >= room.maxPlayers ? 'Full' : 'Join Game'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RoomDiscovery;
