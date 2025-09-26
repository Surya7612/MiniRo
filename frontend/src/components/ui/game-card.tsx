import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './card';
import { Button } from './button';
import { 
  Play, 
  Heart, 
  Share2, 
  ThumbsUp, 
  Eye, 
  Clock, 
  Users, 
  Trophy,
  Star,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { formatNumber } from '../../lib/utils';

interface GameCardProps {
  game: {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    rating: number;
    playCount: number;
    createdAt: string;
    tags: string[];
    creator: string;
    isFeatured?: boolean;
    isTrending?: boolean;
    multiplayer?: boolean;
    achievements?: number;
    price?: string;
    discount?: number;
  };
  onPlay: (gameId: string) => void;
  onViewDetails: (gameId: string) => void;
  onLike: (gameId: string) => void;
  onShare: (gameId: string) => void;
  variant?: 'default' | 'featured' | 'compact';
}

const GameCard: React.FC<GameCardProps> = ({
  game,
  onPlay,
  onViewDetails,
  onLike,
  onShare,
  variant = 'default'
}) => {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`gaming-card group cursor-pointer ${isCompact ? 'h-48' : isFeatured ? 'h-96' : 'h-80'}`}
    >
      {/* Game Thumbnail */}
      <div className={`relative overflow-hidden rounded-t-xl ${isCompact ? 'h-24' : 'h-48'}`}>
        <img 
          src={game.thumbnail} 
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex space-x-2">
          {game.isTrending && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold rounded-full shadow-lg"
            >
              <TrendingUp className="w-3 h-3" />
              <span>Trending</span>
            </motion.span>
          )}
          {game.isFeatured && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-semibold rounded-full shadow-lg"
            >
              <Sparkles className="w-3 h-3" />
              <span>Featured</span>
            </motion.span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
          <Star className="w-3 h-3 text-yellow-400 fill-current" />
          <span className="text-white text-xs font-semibold">{game.rating}</span>
        </div>

        {/* Price */}
        {game.price && (
          <div className="absolute bottom-3 right-3">
            {game.discount ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-green-400">{game.price}</span>
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                  -{game.discount}%
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                {game.price}
              </span>
            )}
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex space-x-3"
          >
            <Button
              variant="gradient"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onPlay(game.id);
              }}
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Play Now</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(game.id);
              }}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Details</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gaming-primary transition-colors line-clamp-1">
            {game.name}
          </h3>
          <p className="text-slate-300 text-sm mb-3 line-clamp-2">
            {game.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {game.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatNumber(game.playCount)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{game.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Multiplayer & Achievements */}
        <div className="flex items-center justify-between mb-3">
          {game.multiplayer && (
            <div className="flex items-center space-x-1 text-gaming-success">
              <Users className="w-4 h-4" />
              <span className="text-xs">Multiplayer</span>
            </div>
          )}
          {game.achievements && (
            <div className="flex items-center space-x-1 text-gaming-warning">
              <Trophy className="w-4 h-4" />
              <span className="text-xs">{game.achievements} achievements</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onLike(game.id);
              }}
              className="p-2 text-slate-400 hover:text-gaming-accent transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onShare(game.id);
              }}
              className="p-2 text-slate-400 hover:text-gaming-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              className="p-2 text-slate-400 hover:text-gaming-success transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThumbsUp className="w-4 h-4" />
            </motion.button>
          </div>
          <span className="text-xs text-slate-400">by {game.creator}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
