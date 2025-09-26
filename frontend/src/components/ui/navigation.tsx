import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { 
  Home, 
  Gamepad2, 
  Trophy, 
  MessageSquare, 
  HelpCircle, 
  Search, 
  Bell, 
  User, 
  Settings,
  Menu,
  X,
  LogIn,
  Plus,
  Sparkles
} from 'lucide-react';

interface NavigationProps {
  user?: any;
  onLogin: () => void;
  onSignup: () => void;
  onCreateGame: () => void;
  onNavigate: (path: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  user,
  onLogin,
  onSignup,
  onCreateGame,
  onNavigate
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'games', label: 'Games', icon: Gamepad2, href: '/games' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
    { id: 'community', label: 'Community', icon: MessageSquare, href: '/community' },
    { id: 'support', label: 'Support', icon: HelpCircle, href: '/support' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-gaming-primary to-gaming-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gaming-accent rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient font-display">MiniRo</h1>
              <p className="text-xs text-slate-400">AI Gaming Platform</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.href)}
                  className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors group relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4 group-hover:text-gaming-primary transition-colors" />
                  <span className="font-medium">{item.label}</span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gaming-primary group-hover:w-full transition-all duration-300" />
                </motion.button>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search games, players..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gaming-primary/50 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogin}
                  className="hidden sm:flex items-center space-x-2 text-slate-300 hover:text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={onSignup}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign Up</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-white relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gaming-accent rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-300 hover:text-white"
                >
                  <Settings className="w-5 h-5" />
                </Button>
                
                <div className="relative">
                  <img 
                    src={user.avatar} 
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border-2 border-gaming-primary/30 cursor-pointer hover:border-gaming-primary transition-colors"
                  />
                </div>
              </div>
            )}

            <Button
              variant="gaming"
              size="sm"
              onClick={onCreateGame}
              className="hidden sm:flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-800/50 py-4"
            >
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-slate-800/50"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
                
                {!user && (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-slate-800/50">
                    <Button
                      variant="outline"
                      onClick={onLogin}
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button
                      variant="gradient"
                      onClick={onSignup}
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navigation;
