
import { useState, useEffect } from 'react';
import useSound from 'use-sound';
import { Howl } from 'howler';

// Initialize background music with better management
const createBgMusic = () => {
  return new Howl({
    src: ['/sounds/background.mp3'],
    loop: true,
    volume: 0.3,
    autoplay: false,
  });
};

// Singleton instance to prevent multiple playback
let bgMusicInstance: Howl | null = null;

export const useGameSound = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  // Sound effects with useSound
  const [playCorrect] = useSound('/sounds/correct.mp3', { volume: volume * 0.8, soundEnabled: !isMuted });
  const [playWrong] = useSound('/sounds/wrong.mp3', { volume: volume * 0.6, soundEnabled: !isMuted });
  const [playCombo] = useSound('/sounds/combo.mp3', { volume: volume, soundEnabled: !isMuted });
  const [playGameOver] = useSound('/sounds/game-over.mp3', { volume: volume, soundEnabled: !isMuted });

  // Initialize background music lazily
  useEffect(() => {
    if (!bgMusicInstance) {
      bgMusicInstance = createBgMusic();
    }
    
    return () => {
      if (bgMusicInstance) {
        bgMusicInstance.stop();
      }
    };
  }, []);

  // Update volume changes
  useEffect(() => {
    if (bgMusicInstance) {
      bgMusicInstance.volume(isMuted ? 0 : volume * 0.6);
    }
  }, [volume, isMuted]);

  const startBgMusic = () => {
    if (!bgMusicInstance) {
      bgMusicInstance = createBgMusic();
    }
    
    if (!isMuted && !bgMusicInstance.playing()) {
      bgMusicInstance.play();
    }
  };

  const stopBgMusic = () => {
    if (bgMusicInstance) {
      bgMusicInstance.stop();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (bgMusicInstance) {
      if (!isMuted) {
        bgMusicInstance.volume(0);
      } else {
        bgMusicInstance.volume(volume * 0.6);
      }
    }
  };

  const adjustVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (bgMusicInstance && !isMuted) {
      bgMusicInstance.volume(clampedVolume * 0.6);
    }
  };

  return {
    playCorrect,
    playWrong,
    playCombo,
    playGameOver,
    startBgMusic,
    stopBgMusic,
    toggleMute,
    adjustVolume,
    isMuted,
    volume
  };
};
