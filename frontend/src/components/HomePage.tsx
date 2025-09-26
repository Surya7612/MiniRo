import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Star, 
  TrendingUp, 
  Users, 
  Clock, 
  Heart, 
  Share2, 
  Plus,
  Search,
  Filter,
  ArrowLeft,
  ArrowUp,
  Home,
  Gamepad2,
  Sparkles,
  Zap,
  Crown,
  Target,
  Award,
  ChevronRight,
  Eye,
  ThumbsUp,
  Menu,
  X,
  User,
  LogIn,
  Trophy,
  MessageSquare,
  HelpCircle,
  Globe,
  Twitter,
  Youtube,
  Instagram,
  Github,
  ChevronDown,
  Settings,
  Bell,
  Download
} from 'lucide-react';

interface Game {
  id: string;
  name: string;
  description: string;
  genre: string;
  rating: number;
  playCount: number;
  thumbnail: string;
  tags: string[];
  creator: string;
  createdAt: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  screenshots?: string[];
  trailer?: string;
  price?: string;
  discount?: number;
  requirements?: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  achievements?: number;
  multiplayer?: boolean;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
}

interface HomePageProps {
  onCreateGame: () => void;
  onJoinRoom: () => void;
  onShowViralGames: () => void;
  onPlayGame: (gameId: string) => void;
  onViewGameDetail: (gameId: string) => void;
  onViewCommunity: () => void;
  onViewProfile: () => void;
  user?: any;
}

const HomePage: React.FC<HomePageProps> = ({
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
      const [showBackButton, setShowBackButton] = useState(false);
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
      const [showAuthModal, setShowAuthModal] = useState(false);

  // Enhanced mock data with professional gaming platform details
      const mockGames: Game[] = [
        {
          id: '1',
          name: 'Cyber Racing 2077',
          description: 'High-speed racing through neon-lit cyberpunk cities with stunning visuals and intense gameplay. Experience the future of racing with AI-powered opponents and dynamic weather systems.',
          genre: 'Racing',
          rating: 4.8,
          playCount: 15420,
          thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop&crop=center',
          tags: ['racing', 'cyberpunk', 'multiplayer', 'open-world'],
          creator: 'CyberGames Studio',
          createdAt: '2 hours ago',
          isFeatured: true,
          isTrending: true,
          screenshots: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop&crop=center'
          ],
          price: '$29.99',
          discount: 20,
          multiplayer: true,
          achievements: 45,
          releaseDate: '2024-01-15',
          developer: 'CyberGames Studio',
          publisher: 'MiniRo Games',
          requirements: {
            os: 'Windows 10/11',
            processor: 'Intel i5-8400 / AMD Ryzen 5 2600',
            memory: '8 GB RAM',
            graphics: 'GTX 1060 / RX 580',
            storage: '50 GB available space'
          }
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
          screenshots: [
            'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=450&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=450&fit=crop&crop=center'
          ],
          price: '$19.99',
          multiplayer: true,
          achievements: 32,
          releaseDate: '2024-01-10',
          developer: 'CosmicGames',
          publisher: 'MiniRo Games',
          requirements: {
            os: 'Windows 10/11',
            processor: 'Intel i3-8100 / AMD FX-6300',
            memory: '6 GB RAM',
            graphics: 'GTX 750 Ti / RX 460',
            storage: '25 GB available space'
          }
        },
    {
      id: '3',
      name: 'Puzzle Dimensions',
      description: 'Mind-bending puzzles with gravity mechanics and beautiful 3D environments',
      genre: 'Puzzle',
      rating: 4.9,
      playCount: 12300,
      thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=225&fit=crop&crop=center',
      tags: ['puzzle', 'gravity', 'brain-teaser'],
      creator: 'PuzzleMaster',
      createdAt: '1 day ago',
      isFeatured: true
    },
    {
      id: '4',
      name: 'Robot Wars',
      description: 'Intense robot battles with upgrade systems and tactical combat mechanics',
      genre: 'Action',
      rating: 4.4,
      playCount: 6780,
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop&crop=center',
      tags: ['robots', 'battle', 'upgrades'],
      creator: 'RoboBuilder',
      createdAt: '3 days ago'
    },
    {
      id: '5',
      name: 'Flight Simulator Pro',
      description: 'Realistic airplane piloting experience with detailed cockpits and weather systems',
      genre: 'Simulation',
      rating: 4.7,
      playCount: 9870,
      thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=225&fit=crop&crop=center',
      tags: ['flight', 'simulation', 'realistic'],
      creator: 'SkyCaptain',
      createdAt: '1 week ago'
    },
    {
      id: '6',
      name: 'Tic-Tac-Toe 3D',
      description: 'Classic game with a modern 3D twist and multiplayer support',
      genre: 'Strategy',
      rating: 4.2,
      playCount: 4560,
      thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=225&fit=crop&crop=center',
      tags: ['classic', 'strategy', '3d'],
      creator: 'ClassicGamer',
      createdAt: '2 weeks ago'
    },
    {
      id: '7',
      name: 'Neon City Runner',
      description: 'Parkour through a cyberpunk city with stunning neon visuals and fluid movement',
      genre: 'Action',
      rating: 4.5,
      playCount: 7890,
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop&crop=center',
      tags: ['parkour', 'cyberpunk', 'runner'],
      creator: 'NeonRunner',
      createdAt: '4 days ago'
    },
    {
      id: '8',
      name: 'Ocean Explorer',
      description: 'Dive deep into mysterious underwater worlds and discover hidden treasures',
      genre: 'Adventure',
      rating: 4.3,
      playCount: 5430,
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop&crop=center',
      tags: ['ocean', 'exploration', 'adventure'],
      creator: 'DeepDiver',
      createdAt: '1 week ago'
    }
  ];

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'racing', label: 'Racing', icon: Zap },
    { id: 'action', label: 'Action', icon: Target },
    { id: 'puzzle', label: 'Puzzle', icon: Award },
    { id: 'simulation', label: 'Simulation', icon: Gamepad2 }
  ];

  const filteredGames = mockGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'trending') return game.isTrending && matchesSearch;
    if (activeTab === 'featured') return game.isFeatured && matchesSearch;
    return game.genre.toLowerCase() === activeTab && matchesSearch;
  });

  const featuredGame = mockGames.find(game => game.isFeatured);
  const trendingGames = mockGames.filter(game => game.isTrending);

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
          {/* Professional Gaming Platform Navigation */}
          <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* MiniRo Logo */}
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Gamepad2 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">MiniRo</h1>
                    <p className="text-xs text-gray-400">AI-Powered Gaming Platform</p>
                  </div>
                </motion.div>

                {/* Navigation Links */}
                <nav className="hidden lg:flex items-center space-x-8">
                  <button onClick={() => {}} className="text-white hover:text-cyan-400 font-medium transition-colors flex items-center space-x-1">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </button>
                  <button onClick={onShowViralGames} className="text-white/80 hover:text-cyan-400 font-medium transition-colors flex items-center space-x-1">
                    <Gamepad2 className="w-4 h-4" />
                    <span>Games</span>
                  </button>
                  <button onClick={() => {}} className="text-white/80 hover:text-cyan-400 font-medium transition-colors flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>Leaderboard</span>
                  </button>
                  <button onClick={onViewCommunity} className="text-white/80 hover:text-cyan-400 font-medium transition-colors flex items-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Community</span>
                  </button>
                  <button onClick={() => {}} className="text-white/80 hover:text-cyan-400 font-medium transition-colors flex items-center space-x-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>Support</span>
                  </button>
                </nav>

                {/* Search Bar */}
                <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search games..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  {!user ? (
                    <>
                      <motion.button
                        onClick={() => setShowAuthModal(true)}
                        className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <LogIn className="w-4 h-4" />
                        <span className="hidden sm:inline">Login</span>
                      </motion.button>
                      <motion.button
                        onClick={() => setShowAuthModal(true)}
                        className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <User className="w-4 h-4" />
                        <span>Sign Up</span>
                      </motion.button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <motion.button
                        className="p-2 text-white/80 hover:text-cyan-400 transition-colors relative"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                      </motion.button>
                      <motion.button
                        className="p-2 text-white/80 hover:text-cyan-400 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Settings className="w-5 h-5" />
                      </motion.button>
                      <div className="relative">
                        <motion.button
                          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                          className="flex items-center space-x-2 p-2 text-white/80 hover:text-white transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          {user?.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.displayName}
                              className="w-8 h-8 rounded-full border-2 border-cyan-400/30"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <ChevronDown className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                  
                  <motion.button
                    onClick={onCreateGame}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Game</span>
                  </motion.button>

                  {/* Mobile Menu Button */}
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-white/80 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </motion.button>
                </div>
              </div>

              {/* Mobile Menu */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden border-t border-white/20 py-4"
                  >
                    <nav className="flex flex-col space-y-4">
                      <a href="#" className="text-white hover:text-cyan-400 font-medium transition-colors flex items-center space-x-2">
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                      </a>
                      <a href="#" className="text-white/80 hover:text-cyan-400 font-medium transition-colors flex items-center space-x-2">
                        <Gamepad2 className="w-4 h-4" />
                        <span>Games</span>
                      </a>
                      <a href="#" className="text-white/80 hover:text-cyan-400 font-medium transition-colors flex items-center space-x-2">
                        <Trophy className="w-4 h-4" />
                        <span>Leaderboard</span>
                      </a>
                      <a href="#" className="text-white/80 hover:text-cyan-400 font-medium transition-colors flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Community</span>
                      </a>
                      <a href="#" className="text-white/80 hover:text-cyan-400 font-medium transition-colors flex items-center space-x-2">
                        <HelpCircle className="w-4 h-4" />
                        <span>Support</span>
                      </a>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.header>

          {/* Cinematic Hero Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
          >
            {/* Animated Background */}
            <div className="absolute inset-0">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
              
              {/* Animated Particles */}
              <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -100, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Floating Geometric Shapes */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute border border-cyan-400/20"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      width: `${20 + Math.random() * 60}px`,
                      height: `${20 + Math.random() * 60}px`,
                    }}
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 10 + Math.random() * 10,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium mb-8 backdrop-blur-sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>AI-Powered Gaming Revolution</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-6xl lg:text-8xl font-bold mb-8 leading-tight"
                >
                  <span className="bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    MiniRo
                  </span>
                  <br />
                  <span className="text-4xl lg:text-6xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Gaming Platform
                  </span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                  Create, play, and share incredible games powered by AI. 
                  Join thousands of developers and gamers in the future of interactive entertainment.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                  <motion.button
                    onClick={onCreateGame}
                    className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your Game
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </motion.button>

                  <motion.button
                    onClick={onShowViralGames}
                    className="group relative px-8 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      Explore Games
                    </span>
                  </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-2">10K+</div>
                    <div className="text-gray-400">Active Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
                    <div className="text-gray-400">Games Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-2">99%</div>
                    <div className="text-gray-400">Uptime</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-3 bg-white/60 rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Featured Games Section */}
          <motion.section 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="py-20 bg-gradient-to-b from-gray-900 to-black relative"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-400/30 rounded-full text-purple-300 text-sm font-medium mb-6 backdrop-blur-sm"
                >
                  <Star className="w-4 h-4 mr-2" />
                  <span>Featured Collection</span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-5xl lg:text-6xl font-bold mb-6"
                >
                  <span className="bg-gradient-to-r from-white via-purple-300 to-pink-400 bg-clip-text text-transparent">
                    Featured Games
                  </span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                >
                  Discover amazing games created by our community and powered by cutting-edge AI technology. 
                  Each game is a masterpiece of interactive entertainment.
                </motion.p>
              </div>

              {/* Featured Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockGames.filter(game => game.isFeatured).map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-500"
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    {/* Game Thumbnail */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={game.thumbnail} 
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <motion.button
                          onClick={() => onViewGameDetail(game.id)}
                          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-5 h-5 inline mr-2" />
                          View Details
                        </motion.button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex space-x-2">
                        {game.isTrending && (
                          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
                            🔥 Trending
                          </span>
                        )}
                        {game.isFeatured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
                            ⭐ Featured
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="absolute top-4 right-4 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{game.rating}</span>
                      </div>

                      {/* Price Tag */}
                      {game.price && (
                        <div className="absolute bottom-4 right-4">
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
                    </div>

                    {/* Game Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {game.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {game.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 text-xs rounded-full border border-gray-600/50">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{game.playCount.toLocaleString()} plays</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{game.createdAt}</span>
                        </div>
                      </div>

                      {/* Multiplayer & Achievements */}
                      <div className="flex items-center justify-between mb-4">
                        {game.multiplayer && (
                          <div className="flex items-center space-x-1 text-green-400">
                            <Users className="w-4 h-4" />
                            <span className="text-xs">Multiplayer</span>
                          </div>
                        )}
                        {game.achievements && (
                          <div className="flex items-center space-x-1 text-yellow-400">
                            <Trophy className="w-4 h-4" />
                            <span className="text-xs">{game.achievements} achievements</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                        <div className="flex items-center space-x-3">
                          <motion.button
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Share2 className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ThumbsUp className="w-5 h-5" />
                          </motion.button>
                        </div>
                        <span className="text-xs text-gray-400">by {game.creator}</span>
                      </div>
                    </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tabs Navigation */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="sticky top-16 z-40 bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-500'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
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
        </div>
      </motion.div>

      {/* Games Grid */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 capitalize flex items-center space-x-3">
            {activeTab === 'trending' ? (
              <>
                <TrendingUp className="w-8 h-8 text-red-500" />
                <span>🔥 Trending Now</span>
              </>
            ) : activeTab === 'featured' ? (
              <>
                <Star className="w-8 h-8 text-orange-500" />
                <span>⭐ Featured Games</span>
              </>
            ) : (
              <>
                {React.createElement(tabs.find(t => t.id === activeTab)?.icon || TrendingUp, { className: "w-8 h-8 text-orange-500" })}
                <span>{activeTab} Games</span>
              </>
            )}
          </h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-gray-500 text-sm">{filteredGames.length} games</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                {/* Game Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={game.thumbnail} 
                    alt={game.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.button
                      onClick={() => onPlayGame(game.id)}
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      Play Now
                    </motion.button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex space-x-2">
                    {game.isTrending && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        🔥 Trending
                      </span>
                    )}
                    {game.isFeatured && (
                      <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-gray-900 text-xs font-semibold">{game.rating}</span>
                  </div>
                </div>

                {/* Game Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {game.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {game.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{game.playCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{game.createdAt}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Share2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <span className="text-xs text-gray-400">by {game.creator}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Gamepad2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No games found</h3>
            <p className="text-gray-500">Try adjusting your search or browse different categories</p>
          </motion.div>
        )}
      </motion.section>

          {/* Professional Footer */}
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="bg-black border-t border-gray-800/50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Brand Section */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                      <Gamepad2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">MiniRo</h3>
                      <p className="text-gray-400 text-sm">AI-Powered Gaming Platform</p>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                    The future of gaming is here. Create, play, and share incredible games powered by cutting-edge AI technology. 
                    Join our community of developers and gamers shaping the next generation of interactive entertainment.
                  </p>
                  <div className="flex items-center space-x-4">
                    <motion.a
                      href="#"
                      className="p-3 bg-gray-800/50 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Twitter className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      href="#"
                      className="p-3 bg-gray-800/50 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Youtube className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      href="#"
                      className="p-3 bg-gray-800/50 rounded-lg text-gray-400 hover:text-pink-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Instagram className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      href="#"
                      className="p-3 bg-gray-800/50 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                        <MessageSquare className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      href="#"
                      className="p-3 bg-gray-800/50 rounded-lg text-gray-400 hover:text-gray-300 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Github className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                  <ul className="space-y-4">
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Games</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Leaderboard</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Community</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Support</a></li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="text-white font-semibold mb-6">Legal</h4>
                  <ul className="space-y-4">
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">DMCA</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a></li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-800/50 mt-12 pt-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <p className="text-gray-400 text-sm">
                    © 2024 MiniRo Gaming Platform. All rights reserved.
                  </p>
                  <p className="text-gray-400 text-sm mt-4 md:mt-0">
                    Made with ❤️ by the MiniRo Team
                  </p>
                </div>
              </div>
            </div>
          </motion.footer>

          {/* Back to Top Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      );
    };

    export default HomePage;
