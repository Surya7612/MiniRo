import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gamepad2, Loader2, X, RotateCcw, Settings, Palette } from 'lucide-react';
import { useGameStore } from '../stores/gameStore';
import { useSocket } from '../hooks/useSocket';
import { useVoiceStore } from '../stores/voiceStore';

interface RemixModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalGame: any;
}

const RemixModal: React.FC<RemixModalProps> = ({ isOpen, onClose, originalGame }) => {
  const { setGenerating } = useGameStore();
  const { generateGame } = useSocket();
  const { selectedVoice } = useVoiceStore();
  
  const [prompt, setPrompt] = useState(originalGame?.description || '');
  const [modifications, setModifications] = useState({
    theme: '',
    mechanics: [] as string[],
    difficulty: 'medium',
    style: 'realistic'
  });

  const availableMechanics = [
    'Racing', 'Platforming', 'Combat', 'Puzzle', 'Collection', 
    'Exploration', 'Stealth', 'Building', 'Strategy', 'Survival'
  ];

  const availableThemes = [
    'Sci-Fi', 'Fantasy', 'Medieval', 'Modern', 'Post-Apocalyptic',
    'Space', 'Underwater', 'Steampunk', 'Cyberpunk', 'Horror'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    
    // Create enhanced prompt with modifications
    let enhancedPrompt = prompt;
    
    if (modifications.theme) {
      enhancedPrompt += ` in a ${modifications.theme} theme`;
    }
    
    if (modifications.mechanics.length > 0) {
      enhancedPrompt += ` with ${modifications.mechanics.join(', ')} mechanics`;
    }
    
    enhancedPrompt += ` (${modifications.difficulty} difficulty, ${modifications.style} style)`;
    
    // Generate remix
    const voiceStyle = selectedVoice?.id || 'narrator-classic';
    generateGame(enhancedPrompt.trim(), voiceStyle);
    
    onClose();
  };

  const handleMechanicToggle = (mechanic: string) => {
    setModifications(prev => ({
      ...prev,
      mechanics: prev.mechanics.includes(mechanic)
        ? prev.mechanics.filter(m => m !== mechanic)
        : [...prev.mechanics, mechanic]
    }));
  };

  const resetToOriginal = () => {
    setPrompt(originalGame?.description || '');
    setModifications({
      theme: '',
      mechanics: [],
      difficulty: 'medium',
      style: 'realistic'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal-surface max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Remix Game</h2>
                <p className="text-white/60 text-sm">Create your own version of "{originalGame?.name}"</p>
              </div>
              <motion.button
                onClick={onClose}
                className="text-white/60 hover:text-white text-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Original Game Info */}
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Original game</h3>
                <p className="text-base font-semibold text-white mb-1">{originalGame?.name}</p>
                <p className="text-sm text-white/60">{originalGame?.description}</p>
              </div>

              {/* Prompt Modification */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Game Description (Modify as needed)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your remixed game idea..."
                  className="input w-full h-32 resize-none"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white/60 text-xs">
                    {prompt.length}/500 characters
                  </span>
                  <motion.button
                    type="button"
                    onClick={resetToOriginal}
                    className="text-primary text-xs flex items-center gap-1 hover:text-primary/80"
                    whileHover={{ scale: 1.05 }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Original
                  </motion.button>
                </div>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  <Palette className="w-4 h-4 inline mr-1" />
                  Theme (Optional)
                </label>
                <select
                  value={modifications.theme}
                  onChange={(e) => setModifications(prev => ({ ...prev, theme: e.target.value }))}
                  className="input w-full"
                >
                  <option value="">No specific theme</option>
                  {availableThemes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>

              {/* Mechanics Selection */}
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  <Settings className="w-4 h-4 inline mr-1" />
                  Game Mechanics (Select multiple)
                </label>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {availableMechanics.map(mechanic => (
                    <motion.button
                      key={mechanic}
                      type="button"
                      onClick={() => handleMechanicToggle(mechanic)}
                      className={`rounded-2xl border px-3 py-2 text-sm font-medium transition-colors ${
                        modifications.mechanics.includes(mechanic)
                          ? 'border-blue-500/40 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10'
                          : 'border-slate-800/70 bg-slate-900/50 text-white/80 hover:bg-slate-900/80'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {mechanic}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Difficulty and Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Difficulty</label>
                  <select
                    value={modifications.difficulty}
                    onChange={(e) => setModifications(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Visual Style</label>
                  <select
                    value={modifications.style}
                    onChange={(e) => setModifications(prev => ({ ...prev, style: e.target.value }))}
                    className="input w-full"
                  >
                    <option value="realistic">Realistic</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="pixel">Pixel Art</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="fantasy">Fantasy</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-white mb-2">Remix preview</h3>
                <p className="text-sm text-white/70">
                  {prompt}
                  {modifications.theme && ` in a ${modifications.theme} theme`}
                  {modifications.mechanics.length > 0 && ` with ${modifications.mechanics.join(', ')} mechanics`}
                  {` (${modifications.difficulty} difficulty, ${modifications.style} style)`}
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={!prompt.trim()}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-5 h-5" />
                Create Remix
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RemixModal;
