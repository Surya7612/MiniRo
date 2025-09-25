import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './stores/gameStore';
import { useSocket } from './hooks/useSocket';
import GamePrompt from './components/GamePrompt';
import GameViewer from './components/GameViewer';
import PlayableGame from './components/PlayableGame';
import GameLobby from './components/GameLobby';
import RoomDiscovery from './components/RoomDiscovery';
import ShareModal from './components/ShareModal';
import RemixModal from './components/RemixModal';
import ViralGamesList from './components/ViralGamesList';
import VoiceSettings from './components/VoiceSettings';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const { currentGame, isConnected, error, setError, updateGame } = useGameStore();
  const { joinGame } = useSocket();
  const [showRoomDiscovery, setShowRoomDiscovery] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRemixModal, setShowRemixModal] = useState(false);
  const [showViralGames, setShowViralGames] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
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
    <div className="h-screen w-screen relative overflow-hidden">
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

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!currentGame ? (
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
            />
          </motion.div>
        ) : currentGame && !gameStarted ? (
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
        ) : (
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

      {/* Background Animation */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
