import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './ui/navigation';
import HeroSection from './ui/hero-section';
import GameCard from './ui/game-card';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  Star, 
  Filter, 
  Search,
  Sparkles,
  Zap,
  Target,
  Award,
  Trophy,
  Users,
  Clock,
  Eye,
  ArrowRight,
  Play
} from 'lucide-react';
import { formatNumber } from '../lib/utils';

interface ModernHomePageProps {
  onCreateGame: () => void;
  onJoinRoom: () => void;
  onShowViralGames: () => void;
  onPlayGame: (gameId: string) => void;
  onViewGameDetail: (gameId: string) => void;
  onViewCommunity: () => void;
  onViewProfile: () => void;
  user?: any;
}

const ModernHomePage: React.FC<ModernHomePageProps> = ({
  onCreateGame,
  onJoinRoom,
  onShowViralGames,
  onPlayGame,
  onViewGameDetail,
  onViewCommunity,
  onViewProfile,
  user
}) => {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced mock data with modern gaming platform details
  const mockGames = [
    {
      id: '1',
      name: 'Cyber Racing 2077',
      description: 'High-speed racing through neon-lit cyberpunk cities with stunning visuals and intense gameplay. Experience the future of racing with AI-powered opponents and dynamic weather systems.',
      genre: 'Racing',
      rating: 4.8,
      playCount: 15420,
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop&crop=center',
      tags: ['racing', 'cyberpunk', 'multiplayer', 'futuristic'],
      creator: 'CyberGames Studio',
      createdAt: '2 hours ago',
      isFeatured: true,
      isTrending: true,
      multiplayer: true,
      achievements: 45,
      price: '$29.99',
      discount: 20
    },
    {
      id: '2',
      name: 'Space Battle Arena',
      description: 'Epic space combat with asteroids, power-ups, and multiplayer battles in zero gravity. Command your fleet in intense tactical warfare across the galaxy.',
      genre: 'Action',
      rating: 4.6,
      playCount: 8930,
      thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=225&fit=crop&crop=center',
      tags: ['space', 'combat', 'shooter', 'strategy'],
      creator: 'CosmicGames',
      createdAt: '5 hours ago',
      isTrending: true,
      multiplayer: true,
      achievements: 32,
      price: '$19.99'
    },
    {
      id: '3',
      name: 'Puzzle Dimensions',
      description: 'Mind-bending puzzles with gravity mechanics and beautiful 3D environments. Challenge your intellect with complex spatial reasoning and innovative mechanics.',
      genre: 'Puzzle',
      rating: 4.9,
      playCount: 12300,
      thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=225&fit=crop&crop=center',
      tags: ['puzzle', 'gravity', 'brain-teaser', 'logic'],
      creator: 'Enigma Studios',
      createdAt: '1 day ago',
      isFeatured: true,
      multiplayer: false,
      achievements: 20,
      price: '$14.99'
    },
    {
      id: '4',
      name: 'Robot Wars',
      description: 'Intense robot battles with upgrade systems and tactical combat mechanics. Customize your robot and dominate the arena in this action-packed brawler.',
      genre: 'Action',
      rating: 4.4,
      playCount: 6780,
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop&crop=center',
      tags: ['robots', 'battle', 'upgrades', 'arena'],
      creator: 'MechForge',
      createdAt: '3 days ago',
      multiplayer: true,
      achievements: 38,
      price: '$24.99',
      discount: 10
    },
    {
      id: '5',
      name: 'Flight Simulator Pro',
      description: 'Realistic airplane piloting experience with detailed cockpits and weather systems. Soar through the skies and master complex flight controls in various aircraft.',
      genre: 'Simulation',
      rating: 4.7,
      playCount: 9870,
      thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=225&fit=crop&crop=center',
      tags: ['flight', 'simulation', 'realistic', 'aviation'],
      creator: 'SkyHigh Studios',
      createdAt: '1 week ago',
      multiplayer: true,
      achievements: 50,
      price: '$39.99'
    },
    {
      id: '6',
      name: 'Neon City Runner',
      description: 'Parkour through a cyberpunk city with stunning neon visuals and fluid movement. Master acrobatic moves and outrun your pursuers in this high-octane adventure.',
      genre: 'Action',
      rating: 4.5,
      playCount: 7890,
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop&crop=center',
      tags: ['parkour', 'cyberpunk', 'runner', 'adventure'],
      creator: 'UrbanFlow Games',
      createdAt: '4 days ago',
      isTrending: true,
      multiplayer: false,
      achievements: 25,
      price: '$17.99'
    }
  ];

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'racing', label: 'Racing', icon: Zap },
    { id: 'action', label: 'Action', icon: Target },
    { id: 'puzzle', label: 'Puzzle', icon: Award },
    { id: 'simulation', label: 'Simulation', icon: Trophy },
  ];

  const filteredGames = mockGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = activeTab === 'trending' ? game.isTrending :
                       activeTab === 'featured' ? game.isFeatured :
                       game.genre.toLowerCase() === activeTab;

    return matchesSearch && matchesTab;
  });

  const featuredGames = mockGames.filter(game => game.isFeatured);
  const trendingGames = mockGames.filter(game => game.isTrending);

  const handleLike = (gameId: string) => {
    console.log('Liked game:', gameId);
  };

  const handleShare = (gameId: string) => {
    console.log('Shared game:', gameId);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <Navigation
        user={user}
        onLogin={() => console.log('Login clicked')}
        onSignup={() => console.log('Signup clicked')}
        onCreateGame={onCreateGame}
        onNavigate={(path) => console.log('Navigate to:', path)}
      />

      {/* Hero Section */}
      <HeroSection
        onCreateGame={onCreateGame}
        onExploreGames={onShowViralGames}
      />

      {/* Featured Games Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-gaming-secondary/20 border border-gaming-secondary/30 rounded-full text-gaming-secondary text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Featured Collection</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="text-gradient font-display">
                Featured Games
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Discover amazing games created by our community and powered by cutting-edge AI technology. 
              Each game is a masterpiece of interactive entertainment.
            </motion.p>
          </div>

          {/* Featured Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GameCard
                  game={game}
                  onPlay={onPlayGame}
                  onViewDetails={onViewGameDetail}
                  onLike={handleLike}
                  onShare={handleShare}
                  variant="featured"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs Navigation */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="sticky top-16 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-gaming-primary text-gaming-primary'
                          : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50 focus:border-transparent"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Games Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GameCard
                    game={game}
                    onPlay={onPlayGame}
                    onViewDetails={onViewGameDetail}
                    onLike={handleLike}
                    onShare={handleShare}
                    variant="default"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="group"
            >
              Load More Games
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">MiniRo</h3>
                  <p className="text-sm text-slate-400">AI Gaming Platform</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                The future of gaming is here. Create, play, and share incredible games powered by artificial intelligence.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Games', 'Leaderboard', 'Community', 'Support'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Refund Policy'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                {['Twitter', 'Discord', 'YouTube', 'GitHub'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 MiniRo. All rights reserved. Powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernHomePage;
