import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './stores/gameStore';
import { useSocket } from './hooks/useSocket';
import HomePage from './components/HomePage';
import ModernHomePage from './components/ModernHomePage';
import SimpleModernHomePage from './components/SimpleModernHomePage';
import GamePrompt from './components/GamePrompt';
import PlayableGame from './components/PlayableGame';
import GameLobby from './components/GameLobby';
import GameDetailPage from './components/GameDetailPage';
import CommunityPage from './components/CommunityPage';
import ProfilePage from './components/ProfilePage';
import AuthModal from './components/AuthModal';
import RoomDiscovery from './components/RoomDiscovery';
import ShareModal from './components/ShareModal';
import RemixModal from './components/RemixModal';
import ViralGamesList from './components/ViralGamesList';
import VoiceSettings from './components/VoiceSettings';
import { Wifi, WifiOff, AlertCircle, ArrowLeft, Home } from 'lucide-react';

const App: React.FC = () => {
  const { currentGame, isConnected, error, setError, updateGame, resetGame } = useGameStore();
  const { joinGame } = useSocket();
  const [showRoomDiscovery, setShowRoomDiscovery] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [showViralGames, setShowViralGames] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'prompt' | 'lobby' | 'game' | 'game-detail' | 'community' | 'profile'>('home');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Reset gameStarted when currentGame changes (new game generated)
  useEffect(() => {
    if (currentGame) {
      setGameStarted(false); // Reset to show lobby for new games
    }
  }, [currentGame?.id]); // Only trigger when game ID changes

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentView('game');
    updateGame({ status: 'playing' });
  };

  const handleJoinRoom = (roomId: string) => {
    // This will be handled by the socket hook
    setShowRoomDiscovery(false);
  };

  const handleRemixGame = (game: any) => {
    setShowRemixModal(true);
  };

  const handleShareGame = (game: any) => {
    setShowShareModal(true);
  };

  const handlePlayGame = (gameId: string) => {
    // Join the game
    joinGame(gameId, 'Player');
    setShowViralGames(false);
    setCurrentView('lobby'); // Go to lobby after joining a viral game
  };

  const handleCreateGame = () => {
    setCurrentView('prompt');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    resetGame();
    setGameStarted(false);
  };

  const handleBackToLobby = () => {
    setCurrentView('lobby');
    setGameStarted(false);
  };

  const handleViewGameDetail = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentView('game-detail');
  };

  const handleViewCommunity = () => {
    setCurrentView('community');
  };

  const handleViewProfile = () => {
    if (user) {
      setCurrentView('profile');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleSignup = (userData: any) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  // Handle URL parameters for joining games
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    
    if (gameId && !currentGame) {
      // Auto-join game if game ID is in URL
      // This would typically fetch the game and join it
      console.log('Auto-joining game:', gameId);
    }
  }, [currentGame]);

  return (
    <div className="min-h-screen w-full bg-slate-900" role="application" aria-label="MiniRo Gaming Platform">
      {/* Voice Settings */}
      <VoiceSettings />
      
      {/* Connection Status */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {isConnected ? (
          <div className="flex items-center gap-2 text-green-400">
            <Wifi className="w-4 h-4" />
            <span className="text-sm">Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-400">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">Disconnected</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-16 right-4 z-20 glass p-4 max-w-sm"
          >
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-white/60 hover:text-white"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar (when not on home) */}
      {currentView !== 'home' && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50"
            >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleBackToHome}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Home</span>
                </motion.button>
                
                {currentView === 'game' && (
                  <motion.button
                    onClick={handleBackToLobby}
                    className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Home className="w-4 h-4" />
                    <span>Lobby</span>
                  </motion.button>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-white font-semibold">MiniRo</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
                <SimpleModernHomePage
                  onCreateGame={handleCreateGame}
                  onShowViralGames={() => setShowViralGames(true)}
                  onPlayGame={handlePlayGame}
                  onViewGameDetail={handleViewGameDetail}
                />
          </motion.div>
        )}
        
        {currentView === 'prompt' && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex items-center justify-center p-4"
          >
            <GamePrompt 
              onShowRoomDiscovery={() => setShowRoomDiscovery(true)}
              onShowViralGames={() => setShowViralGames(true)}
              onGameCreated={() => setCurrentView('lobby')}
            />
          </motion.div>
        )}
        
        {currentView === 'lobby' && currentGame && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <GameLobby 
              onStartGame={handleStartGame}
              onShowShare={() => setShowShareModal(true)}
              onShowRemix={() => setShowRemixModal(true)}
            />
          </motion.div>
        )}
        
            {currentView === 'game' && currentGame && gameStarted && (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <PlayableGame />
              </motion.div>
            )}
            
            {currentView === 'game-detail' && selectedGameId && (
              <motion.div
                key="game-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <GameDetailPage
                  gameId={selectedGameId}
                  onBack={handleBackToHome}
                  onPlay={handlePlayGame}
                />
              </motion.div>
            )}
            
            {currentView === 'community' && (
              <motion.div
                key="community"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <CommunityPage onBack={handleBackToHome} />
              </motion.div>
            )}
            
            {currentView === 'profile' && user && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <ProfilePage
                  onBack={handleBackToHome}
                  onLogout={handleLogout}
                />
              </motion.div>
            )}
      </AnimatePresence>

      {/* Room Discovery Modal */}
      <AnimatePresence>
        {showRoomDiscovery && (
          <RoomDiscovery
            onJoinRoom={handleJoinRoom}
            onClose={() => setShowRoomDiscovery(false)}
          />
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            onRemix={() => {
              setShowShareModal(false);
              setShowRemixModal(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Remix Modal */}
      <AnimatePresence>
        {showRemixModal && (
          <RemixModal
            isOpen={showRemixModal}
            onClose={() => setShowRemixModal(false)}
            originalGame={currentGame}
          />
        )}
      </AnimatePresence>

          {/* Viral Games Modal */}
          <AnimatePresence>
            {showViralGames && (
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
                  className="glass p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Viral Games & Remixes</h2>
                    <motion.button
                      onClick={() => setShowViralGames(false)}
                      className="text-white/60 hover:text-white text-2xl"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ×
                    </motion.button>
                  </div>
                  <ViralGamesList
                    onPlayGame={handlePlayGame}
                    onRemixGame={handleRemixGame}
                    onShareGame={handleShareGame}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Authentication Modal */}
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            onSignup={handleSignup}
          />

    </div>
  );
};

export default App;
