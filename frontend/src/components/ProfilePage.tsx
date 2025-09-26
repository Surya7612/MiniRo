import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Trophy, 
  Star, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Edit3, 
  Camera, 
  Award, 
  Target, 
  Zap, 
  Users, 
  Gamepad2, 
  Calendar, 
  Mail, 
  MapPin, 
  Globe,
  Twitter,
  Github,
  Linkedin,
  Plus,
  ChevronRight,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  Save,
  X
} from 'lucide-react';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  stats: {
    gamesCreated: number;
    gamesPlayed: number;
    totalPlayTime: number;
    achievements: number;
    friends: number;
  };
  achievements: {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedDate: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }[];
  recentGames: {
    id: string;
    name: string;
    thumbnail: string;
    playTime: number;
    lastPlayed: string;
  }[];
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Mock user profile data
  const profile: UserProfile = {
    id: '1',
    username: 'GameMaster_AI',
    displayName: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate game developer and AI enthusiast. Creating the future of interactive entertainment, one game at a time.',
    location: 'San Francisco, CA',
    website: 'https://alexchen.dev',
    joinDate: '2024-01-15',
    level: 25,
    xp: 8750,
    nextLevelXp: 10000,
    stats: {
      gamesCreated: 12,
      gamesPlayed: 156,
      totalPlayTime: 2840, // minutes
      achievements: 34,
      friends: 89
    },
    achievements: [
      {
        id: '1',
        name: 'Game Creator',
        description: 'Created your first game',
        icon: '🎮',
        earnedDate: '2024-01-20',
        rarity: 'common'
      },
      {
        id: '2',
        name: 'Speed Developer',
        description: 'Created 10 games in a week',
        icon: '⚡',
        earnedDate: '2024-02-15',
        rarity: 'rare'
      },
      {
        id: '3',
        name: 'Community Star',
        description: 'Received 100 likes on your games',
        icon: '⭐',
        earnedDate: '2024-03-10',
        rarity: 'epic'
      },
      {
        id: '4',
        name: 'AI Master',
        description: 'Mastered all AI game generation features',
        icon: '🤖',
        earnedDate: '2024-03-25',
        rarity: 'legendary'
      }
    ],
    recentGames: [
      {
        id: '1',
        name: 'Cyber Racing 2077',
        thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=60&fit=crop&crop=center',
        playTime: 450,
        lastPlayed: '2 hours ago'
      },
      {
        id: '2',
        name: 'Space Battle Arena',
        thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=100&h=60&fit=crop&crop=center',
        playTime: 320,
        lastPlayed: '1 day ago'
      },
      {
        id: '3',
        name: 'Puzzle Dimensions',
        thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=100&h=60&fit=crop&crop=center',
        playTime: 180,
        lastPlayed: '3 days ago'
      }
    ],
    socialLinks: {
      twitter: '@alexchen_dev',
      github: 'alexchen-dev',
      linkedin: 'alex-chen-dev'
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'games', label: 'My Games', icon: Gamepad2 },
    { id: 'activity', label: 'Activity', icon: Clock }
  ];

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  const xpPercentage = (profile.xp / profile.nextLevelXp) * 100;

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Profile
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setShowSettings(true)}
                className="p-2 text-white/80 hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
            >
              {/* Avatar */}
              <div className="relative mb-6">
                <img 
                  src={profile.avatar} 
                  alt={profile.displayName}
                  className="w-32 h-32 rounded-full mx-auto border-4 border-cyan-400/30"
                />
                <motion.button
                  className="absolute bottom-2 right-2 p-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
              </div>

              {/* User Info */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{profile.displayName}</h2>
                <p className="text-cyan-400 mb-2">@{profile.username}</p>
                <p className="text-gray-300 text-sm mb-4">{profile.bio}</p>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Level {profile.level}</span>
                  <span className="text-gray-400 text-sm">{profile.xp} / {profile.nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpPercentage}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{profile.stats.gamesCreated}</div>
                  <div className="text-gray-400 text-sm">Games Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{profile.stats.gamesPlayed}</div>
                  <div className="text-gray-400 text-sm">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{Math.floor(profile.stats.totalPlayTime / 60)}h</div>
                  <div className="text-gray-400 text-sm">Play Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{profile.stats.achievements}</div>
                  <div className="text-gray-400 text-sm">Achievements</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold">Social Links</h3>
                {profile.socialLinks.twitter && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Twitter className="w-4 h-4" />
                    <span>{profile.socialLinks.twitter}</span>
                  </div>
                )}
                {profile.socialLinks.github && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Github className="w-4 h-4" />
                    <span>{profile.socialLinks.github}</span>
                  </div>
                )}
                {profile.socialLinks.linkedin && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Linkedin className="w-4 h-4" />
                    <span>{profile.socialLinks.linkedin}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex space-x-8 border-b border-gray-700/50 mb-8"
            >
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
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Recent Activity */}
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white">Created new game "Cyber Racing 2077"</p>
                          <p className="text-gray-400 text-sm">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white">Earned achievement "AI Master"</p>
                          <p className="text-gray-400 text-sm">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white">Received 25 likes on "Space Battle Arena"</p>
                          <p className="text-gray-400 text-sm">3 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Games */}
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Recent Games</h3>
                    <div className="space-y-4">
                      {profile.recentGames.map((game) => (
                        <div key={game.id} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                          <img 
                            src={game.thumbnail} 
                            alt={game.name}
                            className="w-16 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{game.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{Math.floor(game.playTime / 60)}h {game.playTime % 60}m played</span>
                              <span>•</span>
                              <span>Last played {game.lastPlayed}</span>
                            </div>
                          </div>
                          <motion.button
                            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Play
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-xl border-2 ${
                          achievement.rarity === 'legendary' ? 'border-yellow-400/50 bg-yellow-500/10' :
                          achievement.rarity === 'epic' ? 'border-purple-400/50 bg-purple-500/10' :
                          achievement.rarity === 'rare' ? 'border-blue-400/50 bg-blue-500/10' :
                          'border-gray-400/50 bg-gray-500/10'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-4xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold mb-2">{achievement.name}</h3>
                            <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' :
                                achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                                achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                {achievement.rarity}
                              </span>
                              <span className="text-gray-400 text-sm">
                                {new Date(achievement.earnedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700/50 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <motion.button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      className="w-full flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">{tab.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
