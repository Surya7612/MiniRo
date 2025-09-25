import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Play, Share2, RotateCcw, Heart, Clock, Users, TrendingUp } from 'lucide-react';
import { GameAnalytics } from '../types';

interface GameStatsCardProps {
  analytics: GameAnalytics;
  isVisible: boolean;
  onToggle: () => void;
}

const GameStatsCard: React.FC<GameStatsCardProps> = ({ analytics, isVisible, onToggle }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}m`;
    } else {
      return `${Math.round(seconds / 3600)}h`;
    }
  };

  const stats = [
    {
      label: 'Plays',
      value: formatNumber(analytics.playCount),
      icon: Play,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      label: 'Shares',
      value: formatNumber(analytics.shareCount),
      icon: Share2,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      label: 'Remixes',
      value: formatNumber(analytics.remixCount),
      icon: RotateCcw,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    },
    {
      label: 'Likes',
      value: formatNumber(analytics.likeCount),
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-400/20'
    }
  ];

  const additionalStats = [
    {
      label: 'Unique Shares',
      value: formatNumber(analytics.uniqueShares),
      icon: Users,
      color: 'text-cyan-400'
    },
    {
      label: 'Avg Play Time',
      value: formatTime(analytics.averagePlayTime),
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      label: 'Total Play Time',
      value: formatTime(analytics.totalPlayTime),
      icon: TrendingUp,
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="fixed top-4 right-4 z-40">
      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="btn btn-secondary mb-2 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BarChart3 className="w-4 h-4" />
        {isVisible ? 'Hide Stats' : 'Show Stats'}
      </motion.button>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          x: isVisible ? 0 : 20,
          scale: isVisible ? 1 : 0.95
        }}
        transition={{ duration: 0.2 }}
        className={`glass p-4 rounded-lg shadow-xl min-w-[280px] ${
          isVisible ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-white font-medium">Game Statistics</h3>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg ${stat.bgColor} border border-white/10`}
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-white/80 text-xs">{stat.label}</span>
              </div>
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="space-y-2">
          <div className="text-white/60 text-xs font-medium mb-2">Additional Metrics</div>
          {additionalStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (index + 4) * 0.1 }}
              className="flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <stat.icon className={`w-3 h-3 ${stat.color}`} />
                <span className="text-white/70 text-xs">{stat.label}</span>
              </div>
              <span className={`text-sm font-medium ${stat.color}`}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Last Played */}
        {analytics.lastPlayed > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs">Last Played</span>
              <span className="text-white/80 text-xs">
                {new Date(analytics.lastPlayed).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Tags */}
        {analytics.tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="text-white/60 text-xs mb-2">Tags</div>
            <div className="flex flex-wrap gap-1">
              {analytics.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GameStatsCard;
