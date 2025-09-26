import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gamepad2, Loader2, Mic, Users } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { useGameStore } from '../stores/gameStore';
import { useVoiceStore } from '../stores/voiceStore';

interface GamePromptProps {
  onShowRoomDiscovery?: () => void;
  onShowViralGames?: () => void;
  onGameCreated?: () => void;
}

const GamePrompt: React.FC<GamePromptProps> = ({ onShowRoomDiscovery, onShowViralGames, onGameCreated }) => {
  const [prompt, setPrompt] = useState('');
  const { generateGame } = useSocket();
  const { isGenerating, setGenerating, currentGame } = useGameStore();
  const { selectedVoice, isAudioEnabled } = useVoiceStore();

  // Handle game creation success
  useEffect(() => {
    if (currentGame && onGameCreated) {
      onGameCreated();
    }
  }, [currentGame, onGameCreated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    setGenerating(true);
    const voiceStyle = selectedVoice?.id || 'narrator-classic';
    generateGame(prompt.trim(), voiceStyle);
  };

  const examplePrompts = [
    "A space battle game with asteroids and power-ups",
    "A racing game through a neon city at night",
    "A puzzle game with floating platforms and gravity",
    "A multiplayer hide and seek game in a maze"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-8 max-w-4xl mx-auto w-full"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-white mb-2">
          Roam Game Super App
        </h1>
        <p className="text-white/80 text-lg">
          Describe your game idea and watch it come to life instantly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="game-prompt" className="block text-white font-medium mb-2">
            What kind of game do you want to create?
          </label>
          <textarea
            id="game-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your game idea... (e.g., 'A multiplayer racing game with power-ups and obstacles')"
            className="input w-full h-32 resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="space-y-3">
          <motion.button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 loading" />
                Generating Game...
              </>
            ) : (
              <>
                <Gamepad2 className="w-5 h-5" />
                Create Game
                {isAudioEnabled && selectedVoice && (
                  <Mic className="w-4 h-4 ml-1" />
                )}
              </>
            )}
          </motion.button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {onShowRoomDiscovery && (
              <motion.button
                type="button"
                onClick={onShowRoomDiscovery}
                className="btn btn-secondary flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-5 h-5" />
                Find Games
              </motion.button>
            )}
            {onShowViralGames && (
              <motion.button
                type="button"
                onClick={onShowViralGames}
                className="btn btn-secondary flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5" />
                Viral Games
              </motion.button>
            )}
          </div>
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-white font-medium mb-4">Example prompts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examplePrompts.map((example, index) => (
            <motion.button
              key={index}
              onClick={() => setPrompt(example)}
              className="text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isGenerating}
            >
              <p className="text-white/80 text-sm">{example}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GamePrompt;
