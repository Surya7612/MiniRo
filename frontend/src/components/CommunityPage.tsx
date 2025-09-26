import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Star,
  Award,
  Clock,
  Eye,
  ThumbsUp,
  Reply,
  Flag,
  User,
  Calendar,
  Tag,
  ChevronRight,
  Trophy,
  Zap,
  Target,
  ArrowLeft,
  Megaphone
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    badges: string[];
  };
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  createdAt: string;
  isPinned?: boolean;
  isHot?: boolean;
  image?: string;
}

interface CommunityPageProps {
  onBack: () => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock community data
  const posts: Post[] = [
    {
      id: '1',
      title: '🚀 MiniRo Game Jam 2024 - Winners Announced!',
      content: 'After an incredible week of creativity and innovation, we\'re excited to announce the winners of our first annual MiniRo Game Jam! The competition was fierce, with over 500 participants creating amazing games using our AI-powered platform...',
      author: {
        name: 'MiniRo Team',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        level: 50,
        badges: ['Official', 'Developer']
      },
      category: 'announcements',
      tags: ['game-jam', 'winners', 'competition'],
      likes: 342,
      replies: 89,
      views: 1250,
      createdAt: '2 hours ago',
      isPinned: true,
      isHot: true,
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=225&fit=crop&crop=center'
    },
    {
      id: '2',
      title: '🎮 My Cyber Racing 2077 Experience - Tips & Tricks',
      content: 'After spending 50+ hours in Cyber Racing 2077, I wanted to share some advanced tips that I discovered. The game has incredible depth that isn\'t immediately obvious...',
      author: {
        name: 'SpeedDemon',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        level: 25,
        badges: ['Racing Expert', 'Content Creator']
      },
      category: 'guides',
      tags: ['racing', 'tips', 'cyber-racing-2077'],
      likes: 156,
      replies: 34,
      views: 890,
      createdAt: '5 hours ago',
      isHot: true
    },
    {
      id: '3',
      title: '🤖 AI-Generated Game Ideas - Share Yours!',
      content: 'I\'ve been experimenting with different prompts for AI game generation and found some really interesting results. Here are my favorites: "A puzzle game where gravity changes direction" and "A racing game on the surface of a giant tree"...',
      author: {
        name: 'GameDesigner_AI',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        level: 18,
        badges: ['AI Explorer', 'Creative']
      },
      category: 'discussion',
      tags: ['ai', 'game-ideas', 'creativity'],
      likes: 89,
      replies: 67,
      views: 456,
      createdAt: '8 hours ago'
    },
    {
      id: '4',
      title: '🔥 Best Multiplayer Games Created This Week',
      content: 'Here\'s my curated list of the most impressive multiplayer games created by our community this week. Each one showcases the incredible potential of AI-assisted game development...',
      author: {
        name: 'CommunityCurator',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        level: 32,
        badges: ['Curator', 'Multiplayer Expert']
      },
      category: 'showcase',
      tags: ['multiplayer', 'showcase', 'weekly-picks'],
      likes: 203,
      replies: 45,
      views: 1200,
      createdAt: '1 day ago'
    },
    {
      id: '5',
      title: '💡 Tutorial: Creating Your First 3D Game in MiniRo',
      content: 'New to MiniRo? This comprehensive tutorial will walk you through creating your first 3D game from start to finish. Perfect for beginners who want to dive into game development...',
      author: {
        name: 'TutorialMaster',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        level: 28,
        badges: ['Educator', 'Tutorial Creator']
      },
      category: 'tutorials',
      tags: ['tutorial', 'beginner', '3d-games'],
      likes: 178,
      replies: 23,
      views: 2100,
      createdAt: '2 days ago'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Posts', icon: MessageSquare, count: posts.length },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, count: 1 },
    { id: 'guides', label: 'Guides & Tips', icon: Target, count: 1 },
    { id: 'discussion', label: 'Discussion', icon: Users, count: 1 },
    { id: 'showcase', label: 'Showcase', icon: Star, count: 1 },
    { id: 'tutorials', label: 'Tutorials', icon: Award, count: 1 }
  ];

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'hot', label: 'Hot', icon: Zap }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
                Community
              </h1>
            </div>

            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Search Posts</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search community posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{category.label}</span>
                      </div>
                      <span className="text-sm bg-gray-700/50 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Members</span>
                  <span className="text-cyan-400 font-semibold">12,547</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Active Today</span>
                  <span className="text-green-400 font-semibold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Games Created</span>
                  <span className="text-purple-400 font-semibold">8,923</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Posts This Week</span>
                  <span className="text-yellow-400 font-semibold">456</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
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

            {/* Posts */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Author Avatar */}
                      <div className="relative">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full border-2 border-cyan-400/30"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{post.author.level}</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-white font-medium">{post.author.name}</span>
                            <div className="flex space-x-1">
                              {post.author.badges.map((badge, badgeIndex) => (
                                <span key={badgeIndex} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
                                  {badge}
                                </span>
                              ))}
                            </div>
                            <span className="text-gray-400 text-sm">•</span>
                            <span className="text-gray-400 text-sm">{post.createdAt}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {post.isPinned && (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                                📌 Pinned
                              </span>
                            )}
                            {post.isHot && (
                              <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">
                                🔥 Hot
                              </span>
                            )}
                            <button className="p-1 text-gray-400 hover:text-white transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Post Title */}
                        <h2 className="text-xl font-bold text-white mb-3 hover:text-cyan-400 transition-colors cursor-pointer">
                          {post.title}
                        </h2>

                        {/* Post Content */}
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {post.content}
                        </p>

                        {/* Post Image */}
                        {post.image && (
                          <img 
                            src={post.image} 
                            alt="Post image"
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <motion.button
                              className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </motion.button>
                            
                            <motion.button
                              className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Reply className="w-4 h-4" />
                              <span>{post.replies}</span>
                            </motion.button>
                            
                            <motion.button
                              className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </motion.button>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                            <button className="hover:text-red-400 transition-colors">
                              <Flag className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {/* Load More */}
            <motion.button
              className="w-full py-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white hover:border-cyan-500/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Load More Posts
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
