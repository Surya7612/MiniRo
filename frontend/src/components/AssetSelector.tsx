import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Sparkles, Loader2, X, Download, RefreshCw } from 'lucide-react';
import { GameAsset } from '../types';

interface AssetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  gameId: string;
  assets: GameAsset[];
  selectedAsset?: string;
  onSelectAsset: (assetId: string) => void;
  onGenerateAsset: (assetType: 'background' | 'sprite', style?: string, theme?: string) => void;
}

const AssetSelector: React.FC<AssetSelectorProps> = ({
  isOpen,
  onClose,
  gameId,
  assets,
  selectedAsset,
  onSelectAsset,
  onGenerateAsset
}) => {
  const [generating, setGenerating] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedTheme, setSelectedTheme] = useState('');

  const styles = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic textures' },
    { id: 'cartoon', name: 'Cartoon', description: 'Colorful animated style' },
    { id: 'pixel', name: 'Pixel Art', description: '16-bit retro gaming' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean and simple' },
    { id: 'fantasy', name: 'Fantasy', description: 'Magical and mystical' },
    { id: 'sci-fi', name: 'Sci-Fi', description: 'Futuristic technology' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Neon and futuristic' },
    { id: 'medieval', name: 'Medieval', description: 'Ancient and historical' }
  ];

  const themes = [
    'Sci-Fi', 'Fantasy', 'Medieval', 'Modern', 'Post-Apocalyptic',
    'Space', 'Underwater', 'Steampunk', 'Cyberpunk', 'Horror'
  ];

  const handleGenerateAsset = async (assetType: 'background' | 'sprite') => {
    setGenerating(true);
    try {
      await onGenerateAsset(assetType, selectedStyle, selectedTheme || undefined);
    } finally {
      setGenerating(false);
    }
  };

  const backgroundAssets = assets.filter(asset => asset.type === 'background');
  const spriteAssets = assets.filter(asset => asset.type === 'sprite');

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="glass p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Game Assets</h2>
                <p className="text-white/60 text-sm">Choose or generate custom assets for your game</p>
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

            {/* Generation Controls */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-medium mb-4">Generate New Assets</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Style</label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="input w-full"
                  >
                    {styles.map(style => (
                      <option key={style.id} value={style.id}>
                        {style.name} - {style.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Theme (Optional)</label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="input w-full"
                  >
                    <option value="">No specific theme</option>
                    {themes.map(theme => (
                      <option key={theme} value={theme}>{theme}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <motion.button
                    onClick={() => handleGenerateAsset('background')}
                    disabled={generating}
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {generating ? (
                      <Loader2 className="w-4 h-4 loading" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Background
                  </motion.button>
                  <motion.button
                    onClick={() => handleGenerateAsset('sprite')}
                    disabled={generating}
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {generating ? (
                      <Loader2 className="w-4 h-4 loading" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Sprite
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Background Assets */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-4">Background Assets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {backgroundAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    className={`relative p-2 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedAsset === asset.id
                        ? 'border-primary bg-primary/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    onClick={() => onSelectAsset(asset.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2">
                      <img
                        src={asset.url}
                        alt={asset.prompt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/placeholder-background.jpg';
                        }}
                      />
                    </div>
                    <div className="text-xs text-white/80 truncate" title={asset.prompt}>
                      {asset.prompt}
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {asset.model} • {new Date(asset.createdAt).toLocaleDateString()}
                    </div>
                    {selectedAsset === asset.id && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sprite Assets */}
            <div className="mb-6">
              <h3 className="text-white font-medium mb-4">Sprite Assets</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {spriteAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    className={`relative p-2 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedAsset === asset.id
                        ? 'border-primary bg-primary/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                    onClick={() => onSelectAsset(asset.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2">
                      <img
                        src={asset.url}
                        alt={asset.prompt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/placeholder-sprite.png';
                        }}
                      />
                    </div>
                    <div className="text-xs text-white/80 truncate" title={asset.prompt}>
                      {asset.prompt}
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {asset.model} • {new Date(asset.createdAt).toLocaleDateString()}
                    </div>
                    {selectedAsset === asset.id && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                onClick={onClose}
                className="btn btn-primary flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssetSelector;
