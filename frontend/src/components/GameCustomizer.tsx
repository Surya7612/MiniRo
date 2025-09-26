import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, Volume2, Gamepad2, X } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';

interface GameCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameCustomizer: React.FC<GameCustomizerProps> = ({ isOpen, onClose }) => {
  const { currentGame, updateGame } = useGameStore();
  const [customizations, setCustomizations] = useState({
    difficulty: 'medium',
    timeLimit: 120,
    playerSpeed: 1.0,
    gravity: 1.0,
    theme: 'default'
  });

  // Initialize customizations from current game
  React.useEffect(() => {
    if (currentGame?.gameLogic) {
      setCustomizations({
        difficulty: currentGame.gameLogic.difficulty || 'medium',
        timeLimit: currentGame.gameLogic.timeLimit || 120,
        playerSpeed: currentGame.gameLogic.playerSpeed || 1.0,
        gravity: currentGame.gameLogic.gravity || 1.0,
        theme: currentGame.gameLogic.theme || 'default'
      });
    }
  }, [currentGame]);

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
    
    // Update game with new settings
    if (currentGame) {
      const updatedGameLogic = {
        ...currentGame.gameLogic,
        timeLimit: key === 'timeLimit' ? value : currentGame.gameLogic.timeLimit,
        playerSpeed: key === 'playerSpeed' ? value : currentGame.gameLogic.playerSpeed,
        gravity: key === 'gravity' ? value : currentGame.gameLogic.gravity,
        difficulty: key === 'difficulty' ? value : currentGame.gameLogic.difficulty,
        theme: key === 'theme' ? value : currentGame.gameLogic.theme
      };
      
      updateGame({
        gameLogic: updatedGameLogic
      });
      
      console.log('🎮 Game customized:', key, value, updatedGameLogic);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Game Customizer
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Difficulty */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Difficulty</label>
              <select
                value={customizations.difficulty}
                onChange={(e) => handleCustomizationChange('difficulty', e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Time Limit: {customizations.timeLimit}s
              </label>
              <input
                type="range"
                min="30"
                max="300"
                value={customizations.timeLimit}
                onChange={(e) => handleCustomizationChange('timeLimit', parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Player Speed */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Player Speed: {customizations.playerSpeed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={customizations.playerSpeed}
                onChange={(e) => handleCustomizationChange('playerSpeed', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Gravity */}
            <div>
              <label className="block text-white/80 text-sm mb-2">
                Gravity: {customizations.gravity}x
              </label>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.1"
                value={customizations.gravity}
                onChange={(e) => handleCustomizationChange('gravity', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Theme */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {['default', 'space', 'forest', 'neon'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleCustomizationChange('theme', theme)}
                    className={`p-2 rounded text-sm capitalize transition-colors ${
                      customizations.theme === theme
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={onClose}
              className="w-full btn btn-primary"
            >
              Apply Customizations
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameCustomizer;
