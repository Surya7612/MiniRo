import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { 
  Play, 
  Plus, 
  Sparkles, 
  Zap, 
  Gamepad2, 
  Users, 
  Trophy,
  ArrowRight,
  Star
} from 'lucide-react';

interface HeroSectionProps {
  onCreateGame: () => void;
  onExploreGames: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onCreateGame,
  onExploreGames
}) => {
  const stats = [
    { icon: Users, value: '12.5K', label: 'Active Players' },
    { icon: Gamepad2, value: '500+', label: 'Games Created' },
    { icon: Trophy, value: '99.9%', label: 'Uptime' },
    { icon: Star, value: '4.9', label: 'Rating' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gaming-primary/30 rounded-full"
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
              className="absolute border border-gaming-primary/20"
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
            className="inline-flex items-center px-6 py-3 bg-gaming-primary/20 border border-gaming-primary/30 rounded-full text-gaming-primary text-sm font-medium mb-8 backdrop-blur-sm"
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
            <span className="text-gradient font-display">
              MiniRo
            </span>
            <br />
            <span className="text-4xl lg:text-6xl bg-gradient-to-r from-gaming-accent to-pink-400 bg-clip-text text-transparent">
              Gaming Platform
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Create, play, and share incredible games powered by AI. 
            Join thousands of developers and gamers in the future of interactive entertainment.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="gaming"
                size="xl"
                onClick={onCreateGame}
                className="group relative px-8 py-4 text-lg font-semibold shadow-2xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your Game
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="xl"
                onClick={onExploreGames}
                className="group px-8 py-4 text-lg font-semibold bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                Explore Games
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, type: "spring" }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gaming-primary/20 rounded-full mb-3">
                    <Icon className="w-6 h-6 text-gaming-primary" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
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
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center cursor-pointer"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
