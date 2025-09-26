import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Settings, Mic, MicOff, X } from 'lucide-react';
import { useVoiceStore } from '../stores/voiceStore';
import { VoiceSettings as VoiceSettingsType } from '../types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002';

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
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/30"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        <Settings className="w-5 h-5 text-white" />
      </motion.button>

      {/* Voice Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-40 w-80 max-h-[70vh] overflow-y-auto rounded-3xl border border-slate-800/60 bg-slate-950/90 p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Mic className="w-5 h-5" />
                  Voice Settings
                </h3>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full bg-white/5 p-2 text-white/60 hover:text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Audio Enable/Disable */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">Audio narration</p>
                  <p className="text-xs text-white/50">Toggle the AI commentator during play</p>
                </div>
                <motion.button
                  onClick={toggleAudio}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
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
              <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Narration volume</span>
                  <div className="flex items-center gap-3 text-white/60">
                    <VolumeX className="h-4 w-4" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="h-2 w-24 cursor-pointer appearance-none rounded-full bg-white/20"
                    />
                    <Volume2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-right text-xs text-white/50">{Math.round(volume * 100)}%</div>
              </div>

              {/* Voice Selection */}
              <div className="space-y-3">
                <span className="text-sm font-medium text-white">Narration style</span>
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
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                          selectedVoice?.id === voice.id
                            ? 'border-blue-500/40 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                            : 'border-slate-800/70 bg-slate-900/50 hover:bg-slate-900/80'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-sm font-semibold text-white">{voice.name}</div>
                        <div className="mt-1 text-xs text-white/60">{voice.description}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
                          Style: {voice.style}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Selection */}
              {selectedVoice && (
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40">Selected voice</div>
                  <div className="text-sm font-semibold text-white">{selectedVoice.name}</div>
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
