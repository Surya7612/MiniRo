import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, QrCode, Download, X, ExternalLink, Heart, Users, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useGameStore } from '../stores/gameStore';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRemix?: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onRemix }) => {
  const { currentGame } = useGameStore();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'remix'>('share');

  if (!currentGame) return null;

  const gameUrl = `${window.location.origin}${window.location.pathname}?game=${currentGame.id}`;
  const shortCode = currentGame.id.slice(0, 8).toUpperCase();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('svg') as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = 200;
      canvas.height = 200;
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = `game-${shortCode}-qr.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out this amazing game: ${currentGame.name}! 🎮\n\n${currentGame.description}\n\nPlay it here: ${gameUrl}`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(gameUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(gameUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
    }
  };

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
            className="glass p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Share & Remix</h2>
              <motion.button
                onClick={onClose}
                className="text-white/60 hover:text-white text-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Game Info */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <h3 className="text-white font-medium text-lg mb-2">{currentGame.name}</h3>
              <p className="text-white/80 text-sm mb-3">{currentGame.description}</p>
              
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {currentGame.players.length} player{currentGame.players.length !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(currentGame.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  0 likes
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <motion.button
                onClick={() => setActiveTab('share')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'share'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-white/60 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-4 h-4 inline mr-2" />
                Share
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('remix')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'remix'
                    ? 'bg-primary text-white'
                    : 'bg-white/10 text-white/60 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <QrCode className="w-4 h-4 inline mr-2" />
                Remix
              </motion.button>
            </div>

            {/* Share Tab */}
            {activeTab === 'share' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* QR Code */}
                <div className="text-center">
                  <h3 className="text-white font-medium mb-4">Scan to Play</h3>
                  <div className="inline-block p-4 bg-white rounded-lg">
                    <QRCodeSVG
                      value={gameUrl}
                      size={200}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                  <div className="mt-4 flex justify-center gap-2">
                    <motion.button
                      onClick={downloadQRCode}
                      className="btn btn-secondary flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4" />
                      Download QR
                    </motion.button>
                  </div>
                </div>

                {/* Share Options */}
                <div>
                  <h3 className="text-white font-medium mb-4">Share Options</h3>
                  
                  {/* Direct Link */}
                  <div className="mb-4">
                    <label className="block text-white/80 text-sm mb-2">Game Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={gameUrl}
                        readOnly
                        className="input flex-1 text-sm"
                      />
                      <motion.button
                        onClick={() => copyToClipboard(gameUrl)}
                        className="btn btn-secondary flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Game Code */}
                  <div className="mb-6">
                    <label className="block text-white/80 text-sm mb-2">Game Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shortCode}
                        readOnly
                        className="input flex-1 text-center font-mono text-lg"
                      />
                      <motion.button
                        onClick={() => copyToClipboard(shortCode)}
                        className="btn btn-secondary flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </div>
                  </div>

                  {/* Social Sharing */}
                  <div>
                    <h4 className="text-white/80 font-medium mb-3">Share on Social Media</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: 'Twitter', color: 'bg-blue-500', icon: '𝕏' },
                        { name: 'Facebook', color: 'bg-blue-600', icon: 'f' },
                        { name: 'LinkedIn', color: 'bg-blue-700', icon: 'in' },
                        { name: 'WhatsApp', color: 'bg-green-500', icon: 'W' }
                      ].map((platform) => (
                        <motion.button
                          key={platform.name}
                          onClick={() => shareToSocial(platform.name.toLowerCase())}
                          className={`${platform.color} text-white p-3 rounded-lg flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-lg font-bold">{platform.icon}</span>
                          <span className="text-xs">{platform.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Remix Tab */}
            {activeTab === 'remix' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <QrCode className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-white font-medium text-lg mb-2">Remix This Game</h3>
                  <p className="text-white/80 text-sm mb-6">
                    Create your own version by modifying the game prompt, mechanics, or parameters.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Original Prompt</label>
                    <textarea
                      value={currentGame.description}
                      readOnly
                      className="input w-full h-20 resize-none bg-white/5"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Game Type</label>
                    <div className="flex gap-2 flex-wrap">
                      {['Racing', 'Platformer', 'Space', 'Puzzle', 'Adventure'].map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">Current Mechanics</label>
                    <div className="flex gap-2 flex-wrap">
                      {currentGame.gameLogic.mechanics.map((mechanic, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full"
                        >
                          {mechanic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={onRemix}
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <QrCode className="w-4 h-4" />
                    Create Remix
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="btn btn-secondary flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Original
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
