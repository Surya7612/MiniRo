import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Heart, 
  Share2, 
  Download, 
  Star, 
  Users, 
  Clock, 
  Trophy, 
  Settings,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal,
  ChevronRight,
  Gamepad2,
  Zap,
  Target,
  Award,
  Eye,
  Calendar,
  Tag,
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react';

interface GameDetail {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  genre: string;
  rating: number;
  playCount: number;
  thumbnail: string;
  screenshots: string[];
  trailer?: string;
  tags: string[];
  creator: string;
  createdAt: string;
  price?: string;
  discount?: number;
  requirements: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  achievements: number;
  multiplayer: boolean;
  releaseDate: string;
  developer: string;
  publisher: string;
  features: string[];
  reviews: {
    id: string;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
  }[];
}

interface GameDetailPageProps {
  gameId: string;
  onBack: () => void;
  onPlay: (gameId: string) => void;
}

const GameDetailPage: React.FC<GameDetailPageProps> = ({ gameId, onBack, onPlay }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Mock game data - in real app, this would come from API
  const game: GameDetail = {
    id: gameId,
    name: 'Cyber Racing 2077',
    description: 'High-speed racing through neon-lit cyberpunk cities with stunning visuals and intense gameplay.',
    longDescription: `Cyber Racing 2077 is a revolutionary racing experience that transports you to a neon-soaked cyberpunk future. Race through sprawling megacities, navigate through towering skyscrapers, and compete in high-stakes tournaments that will test your skills to the limit.

    Features:
    • Stunning cyberpunk visuals with ray-traced lighting
    • 50+ unique tracks across 5 different districts
    • Advanced vehicle customization system
    • Online multiplayer with up to 16 players
    • Dynamic weather and day/night cycles
    • Original soundtrack by renowned electronic artists
    
    Experience the future of racing where technology meets adrenaline. Customize your vehicle with cutting-edge modifications, upgrade your engines with quantum processors, and compete against AI opponents that learn from your driving style.`,
    genre: 'Racing',
    rating: 4.8,
    playCount: 15420,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&crop=center',
    screenshots: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=450&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=450&fit=crop&crop=center'
    ],
    tags: ['racing', 'cyberpunk', 'multiplayer', 'open-world', 'futuristic'],
    creator: 'CyberGames Studio',
    createdAt: '2 hours ago',
    price: '$29.99',
    discount: 20,
    requirements: {
      os: 'Windows 10/11',
      processor: 'Intel i5-8400 / AMD Ryzen 5 2600',
      memory: '8 GB RAM',
      graphics: 'GTX 1060 / RX 580',
      storage: '50 GB available space'
    },
    achievements: 45,
    multiplayer: true,
    releaseDate: '2024-01-15',
    developer: 'CyberGames Studio',
    publisher: 'MiniRo Games',
    features: [
      'Single Player',
      'Multiplayer',
      'Cross-Platform',
      'Cloud Saves',
      'Achievements',
      'VR Support'
    ],
    reviews: [
      {
        id: '1',
        user: 'GamerPro2024',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        rating: 5,
        comment: 'Absolutely incredible racing game! The cyberpunk aesthetic is perfect and the gameplay is smooth as butter. Highly recommend!',
        date: '2 days ago',
        helpful: 23
      },
      {
        id: '2',
        user: 'SpeedDemon',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        rating: 4,
        comment: 'Great game overall, love the customization options. The multiplayer could use some improvements though.',
        date: '1 week ago',
        helpful: 15
      },
      {
        id: '3',
        user: 'NeonRacer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        rating: 5,
        comment: 'The graphics are mind-blowing! This is exactly what I was looking for in a futuristic racing game.',
        date: '3 days ago',
        helpful: 31
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'screenshots', label: 'Screenshots', icon: Gamepad2 },
    { id: 'requirements', label: 'Requirements', icon: Settings },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'achievements', label: 'Achievements', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              onClick={onBack}
              className="flex items-center space-x-2 text-white/80 hover:text-cyan-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </motion.button>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-gray-800/50 text-gray-400 hover:text-red-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                onClick={() => setShowShareModal(true)}
                className="p-2 bg-gray-800/50 text-gray-400 hover:text-cyan-400 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={() => onPlay(gameId)}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
                <span>Play Now</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Game Image */}
            <div className="lg:col-span-2">
              <div className="relative">
                <img 
                  src={game.screenshots[selectedScreenshot]} 
                  alt={game.name}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                
                {/* Screenshot Navigation */}
                {game.screenshots.length > 1 && (
                  <div className="flex space-x-2 mt-4">
                    {game.screenshots.map((screenshot, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setSelectedScreenshot(index)}
                        className={`relative overflow-hidden rounded-lg transition-all duration-200 ${
                          selectedScreenshot === index 
                            ? 'ring-2 ring-cyan-400' 
                            : 'hover:ring-2 hover:ring-white/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img 
                          src={screenshot} 
                          alt={`Screenshot ${index + 1}`}
                          className="w-20 h-12 object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Game Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-400/30 rounded-full text-purple-300 text-sm font-medium">
                    {game.genre}
                  </span>
                  {game.multiplayer && (
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-400/30 rounded-full text-green-300 text-sm font-medium flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>Multiplayer</span>
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-4">{game.name}</h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{game.rating}</span>
                    <span className="text-gray-400 text-sm">({game.playCount.toLocaleString()} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-400 mb-6">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{game.playCount.toLocaleString()} plays</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{game.releaseDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>{game.achievements} achievements</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                {game.price ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-white">{game.price}</div>
                      {game.discount && (
                        <div className="text-sm text-green-400">
                          {game.discount}% off - Save ${(parseFloat(game.price.replace('$', '')) * game.discount / 100).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <motion.button
                      onClick={() => onPlay(gameId)}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download className="w-4 h-4 inline mr-2" />
                      Get Game
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => onPlay(gameId)}
                    className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-5 h-5 inline mr-2" />
                    Play Free
                  </motion.button>
                )}
              </div>

              {/* Features */}
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {game.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tabs */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 border-b border-gray-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-cyan-500 text-cyan-400'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Tab Content */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="pb-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{game.longDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Developer</h3>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">{game.developer.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-white font-medium">{game.developer}</div>
                        <div className="text-gray-400 text-sm">{game.publisher}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {game.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'requirements' && (
              <motion.div
                key="requirements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">System Requirements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(game.requirements).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-gray-700/50">
                      <span className="text-gray-300 capitalize">{key}:</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Write Review */}
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Write a Review</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder="Share your thoughts about this game..."
                      className="w-full h-32 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                    />
                    <motion.button
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Submit Review
                    </motion.button>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Reviews ({game.reviews.length})</h3>
                  {game.reviews.map((review) => (
                    <div key={review.id} className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <img 
                          src={review.avatar} 
                          alt={review.user}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">{review.user}</span>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-gray-400 text-sm">{review.date}</span>
                          </div>
                          <p className="text-gray-300 mb-3">{review.comment}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <button className="flex items-center space-x-1 hover:text-cyan-400 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.helpful}</span>
                            </button>
                            <button className="hover:text-red-400 transition-colors">
                              <Flag className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
};

export default GameDetailPage;
