import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, Share2, Play, UserPlus, Gamepad2 } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { useSocket } from '../hooks/useSocket';

interface GameLobbyProps {
  onStartGame: () => void;
  onShowShare?: () => void;
  onShowRemix?: () => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onStartGame, onShowShare, onShowRemix }) => {
  const { currentGame } = useGameStore();
  const { joinGame } = useSocket();
  const [playerName, setPlayerName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if current user is the host (first player)
    if (currentGame?.players.length === 1) {
      setIsHost(true);
    }
  }, [currentGame]);

  const handleJoinGame = () => {
    if (!playerName.trim()) return;
    
    if (currentGame) {
      joinGame(currentGame.id, playerName.trim());
      setShowJoinForm(false);
    }
  };

  const handleJoinWithCode = () => {
    if (!playerName.trim() || !joinCode.trim()) return;
    
    joinGame(joinCode.trim(), playerName.trim());
    setShowJoinForm(false);
  };

  const copyGameLink = async () => {
    const gameUrl = `${window.location.origin}${window.location.pathname}?game=${currentGame?.id}`;
    try {
      await navigator.clipboard.writeText(gameUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const copyGameCode = async () => {
    if (currentGame?.id) {
      try {
        await navigator.clipboard.writeText(currentGame.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
  };

  if (!currentGame) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center p-4"
    >
      <div className="glass p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4"
          >
            <Gamepad2 className="w-8 h-8 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2">{currentGame.name}</h1>
          <p className="text-white/80 text-lg mb-4">{currentGame.description}</p>
          
          <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{currentGame.players.length} player{currentGame.players.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Room: {currentGame.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="mb-8 p-4 bg-white/5 rounded-lg">
          <h3 className="text-white font-medium mb-2">Game Objective</h3>
          <p className="text-white/80 text-sm mb-3">{currentGame.gameLogic.objective}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-white/60 font-medium mb-1">Controls</h4>
              <ul className="text-white/60 space-y-1">
                {currentGame.gameLogic.controls.map((control, index) => (
                  <li key={index}>• {control}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white/60 font-medium mb-1">Mechanics</h4>
              <ul className="text-white/60 space-y-1">
                {currentGame.gameLogic.mechanics.map((mechanic, index) => (
                  <li key={index}>• {mechanic}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Players List */}
        <div className="mb-8">
          <h3 className="text-white font-medium mb-4">Players in Room</h3>
          <div className="space-y-2">
            {currentGame.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: player.color }}
                />
                <span className="text-white font-medium">{player.name}</span>
                {player.isHost && (
                  <span className="text-yellow-400 text-xs bg-yellow-400/20 px-2 py-1 rounded">
                    Host
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Share Game */}
        <div className="mb-8">
          <h3 className="text-white font-medium mb-4">Share Game</h3>
          <div className="flex gap-3">
            <motion.button
              onClick={copyGameLink}
              className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Share2 className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </motion.button>
            <motion.button
              onClick={copyGameCode}
              className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Code'}
            </motion.button>
          </div>
          <p className="text-white/60 text-xs mt-2">
            Share the link or code with friends to invite them to play!
          </p>
        </div>

        {/* Join Game Form */}
        <AnimatePresence>
          {showJoinForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-white/5 rounded-lg"
            >
              <h3 className="text-white font-medium mb-4">Join Game</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Your Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    className="input w-full"
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Game Code (if joining existing game)</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter game code"
                    className="input w-full"
                  />
                </div>
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleJoinGame}
                    disabled={!playerName.trim()}
                    className="btn btn-primary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join This Game
                  </motion.button>
                  <motion.button
                    onClick={handleJoinWithCode}
                    disabled={!playerName.trim() || !joinCode.trim()}
                    className="btn btn-secondary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join With Code
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex gap-4">
            {!showJoinForm && (
              <motion.button
                onClick={() => setShowJoinForm(true)}
                className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <UserPlus className="w-4 h-4" />
                Join Game
              </motion.button>
            )}
            
            {isHost && currentGame.players.length > 0 && (
              <motion.button
                onClick={onStartGame}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-4 h-4" />
                Start Game
              </motion.button>
            )}
          </div>

          {/* Share and Remix Buttons */}
          <div className="flex gap-3">
            {onShowShare && (
              <motion.button
                onClick={onShowShare}
                className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4" />
                Share Game
              </motion.button>
            )}
            {onShowRemix && (
              <motion.button
                onClick={onShowRemix}
                className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Gamepad2 className="w-4 h-4" />
                Remix Game
              </motion.button>
            )}
          </div>
        </div>

        {!isHost && currentGame.players.length > 0 && (
          <p className="text-white/60 text-sm mt-4 text-center">
            Waiting for host to start the game...
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default GameLobby;
