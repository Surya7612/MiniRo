import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Settings, Mic, MicOff } from 'lucide-react';
import { useVoiceStore } from '../stores/voiceStore';
import { VoiceSettings as VoiceSettingsType } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const VoiceSettings: React.FC = () => {
  const {
    availableVoices,
    selectedVoice,
    isAudioEnabled,
    volume,
    isLoading,
    error,
    setAvailableVoices,
    setSelectedVoice,
    setAudioEnabled,
    setVolume,
    setLoading,
    setError
  } = useVoiceStore();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadAvailableVoices();
  }, []);

  const loadAvailableVoices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/voices`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableVoices(data.voices);
        // Set default voice if none selected
        if (!selectedVoice && data.voices.length > 0) {
          setSelectedVoice(data.voices[0]);
        }
      } else {
        setError(data.error || 'Failed to load voices');
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      setError('Failed to load voices');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSelect = (voice: VoiceSettingsType) => {
    setSelectedVoice(voice);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const toggleAudio = () => {
    setAudioEnabled(!isAudioEnabled);
  };

  return (
    <>
      {/* Voice Settings Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-30 glass p-3 rounded-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-5 h-5 text-white" />
      </motion.button>

      {/* Voice Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-4 left-20 z-30 glass p-6 w-80 max-h-96 overflow-y-auto"
          >
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Settings
              </h3>

              {/* Audio Enable/Disable */}
              <div className="flex items-center justify-between">
                <span className="text-white/80">Audio Narration</span>
                <motion.button
                  onClick={toggleAudio}
                  className={`p-2 rounded-lg transition-colors ${
                    isAudioEnabled 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </motion.button>
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Volume</span>
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4 text-white/60" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <Volume2 className="w-4 h-4 text-white/60" />
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  {Math.round(volume * 100)}%
                </div>
              </div>

              {/* Voice Selection */}
              <div className="space-y-2">
                <span className="text-white/80 text-sm">Narration Style</span>
                {isLoading ? (
                  <div className="text-white/60 text-sm">Loading voices...</div>
                ) : error ? (
                  <div className="text-red-400 text-sm">{error}</div>
                ) : (
                  <div className="space-y-2">
                    {availableVoices.map((voice) => (
                      <motion.button
                        key={voice.id}
                        onClick={() => handleVoiceSelect(voice)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedVoice?.id === voice.id
                            ? 'bg-blue-500/20 border border-blue-400/50'
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-white font-medium text-sm">{voice.name}</div>
                        <div className="text-white/60 text-xs mt-1">{voice.description}</div>
                        <div className="text-white/40 text-xs mt-1 capitalize">
                          Style: {voice.style}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Selection */}
              {selectedVoice && (
                <div className="pt-2 border-t border-white/10">
                  <div className="text-white/60 text-xs">Selected Voice:</div>
                  <div className="text-white font-medium text-sm">{selectedVoice.name}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceSettings;
