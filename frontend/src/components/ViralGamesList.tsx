import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, Users, Clock, Play, Share2, RotateCcw } from 'lucide-react';

interface ViralGame {
  id: string;
  name: string;
  description: string;
  originalPrompt: string;
  remixCount: number;
  playCount: number;
  shareCount: number;
  likeCount: number;
  createdAt: number;
  isRemix: boolean;
  originalGameId?: string;
  creator: string;
  tags: string[];
}

interface ViralGamesListProps {
  onPlayGame: (gameId: string) => void;
  onRemixGame: (game: ViralGame) => void;
  onShareGame: (game: ViralGame) => void;
}

const ViralGamesList: React.FC<ViralGamesListProps> = ({ onPlayGame, onRemixGame, onShareGame }) => {
  const [games, setGames] = useState<ViralGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'trending' | 'popular' | 'recent'>('trending');

  // Mock data for demonstration
  useEffect(() => {
    const mockGames: ViralGame[] = [
      {
        id: '1',
        name: 'Epic Space Battle Royale',
        description: 'A massive multiplayer space battle with power-ups and team strategies',
        originalPrompt: 'A space battle game with asteroids and power-ups',
        remixCount: 47,
        playCount: 1234,
        shareCount: 89,
        likeCount: 156,
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
        isRemix: false,
        creator: 'SpaceGamer99',
        tags: ['Space', 'Battle', 'Multiplayer']
      },
      {
        id: '2',
        name: 'Neon Racing Remix',
        description: 'High-speed racing through a cyberpunk city with neon lights',
        originalPrompt: 'A racing game with obstacles',
        remixCount: 23,
        playCount: 892,
        shareCount: 45,
        likeCount: 98,
        createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        isRemix: true,
        originalGameId: '1',
        creator: 'CyberRacer',
        tags: ['Racing', 'Cyberpunk', 'Neon']
      },
      {
        id: '3',
        name: 'Mystical Platform Adventure',
        description: 'Jump through floating islands in a magical realm',
        originalPrompt: 'A platform jumping puzzle',
        remixCount: 34,
        playCount: 756,
        shareCount: 67,
        likeCount: 134,
        createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        isRemix: false,
        creator: 'MagicJumper',
        tags: ['Platform', 'Magic', 'Adventure']
      },
      {
        id: '4',
        name: 'Zombie Survival Remix',
        description: 'Survive waves of zombies in a post-apocalyptic world',
        originalPrompt: 'A survival game with enemies',
        remixCount: 18,
        playCount: 634,
        shareCount: 34,
        likeCount: 87,
        createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
        isRemix: true,
        originalGameId: '3',
        creator: 'ZombieHunter',
        tags: ['Survival', 'Zombies', 'Horror']
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setGames(mockGames);
      setLoading(false);
    }, 1000);
  }, []);

  const sortedGames = [...games].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return (b.remixCount + b.playCount) - (a.remixCount + a.playCount);
      case 'popular':
        return b.likeCount - a.likeCount;
      case 'recent':
        return b.createdAt - a.createdAt;
      default:
        return 0;
    }
  });

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white/60">Loading viral games...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Viral Games & Remixes
          </h2>
          <p className="text-white/60 text-sm">Most popular and trending games</p>
        </div>
        
        {/* Sort Options */}
        <div className="flex gap-2">
          {[
            { key: 'trending', label: 'Trending' },
            { key: 'popular', label: 'Popular' },
            { key: 'recent', label: 'Recent' }
          ].map((option) => (
            <motion.button
              key={option.key}
              onClick={() => setSortBy(option.key as any)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortBy === option.key
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-white/60 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
          >
            {/* Game Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-medium text-lg mb-1">{game.name}</h3>
                <p className="text-white/60 text-sm line-clamp-2">{game.description}</p>
              </div>
              {game.isRemix && (
                <div className="ml-2 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                  Remix
                </div>
              )}
            </div>

            {/* Creator and Time */}
            <div className="flex items-center justify-between mb-3 text-white/60 text-xs">
              <span>by {game.creator}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(game.createdAt)}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              <div className="flex flex-col items-center">
                <Heart className="w-4 h-4 text-red-400 mb-1" />
                <span className="text-white/80 text-xs">{formatNumber(game.likeCount)}</span>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-4 h-4 text-blue-400 mb-1" />
                <span className="text-white/80 text-xs">{formatNumber(game.playCount)}</span>
              </div>
              <div className="flex flex-col items-center">
                <Share2 className="w-4 h-4 text-green-400 mb-1" />
                <span className="text-white/80 text-xs">{formatNumber(game.shareCount)}</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-purple-400 mb-1" />
                <span className="text-white/80 text-xs">{formatNumber(game.remixCount)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                onClick={() => onPlayGame(game.id)}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" />
                Play
              </motion.button>
              <motion.button
                onClick={() => onRemixGame(game)}
                className="btn btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => onShareGame(game)}
                className="btn btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <motion.button
          className="btn btn-secondary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Load More Games
        </motion.button>
      </div>
    </div>
  );
};

export default ViralGamesList;
