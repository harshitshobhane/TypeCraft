import React, { useEffect, useState } from 'react';
import Wave from 'react-wavify';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, RotateCcw, Home, Star } from 'lucide-react';

interface GameOverProps {
  onRestart: () => void;
  onExit: () => void;
  finalScore: number;
  wpm: number;
  level: number;
}

// Glitch animation keyframes
const glitchAnim = {
  "0%": {
    clipPath: "inset(40% 0 61% 0)",
    transform: "translate(-2px, 2px)",
  },
  "20%": {
    clipPath: "inset(92% 0 1% 0)",
    transform: "translate(1px, -3px)",
  },
  "40%": {
    clipPath: "inset(43% 0 1% 0)",
    transform: "translate(-1px, 3px)",
  },
  "60%": {
    clipPath: "inset(25% 0 58% 0)",
    transform: "translate(3px, 1px)",
  },
  "80%": {
    clipPath: "inset(54% 0 7% 0)",
    transform: "translate(-3px, -2px)",
  },
  "100%": {
    clipPath: "inset(58% 0 43% 0)",
    transform: "translate(2px, 2px)",
  },
};

export function GameOver({ onRestart, onExit, finalScore, wpm, level }: GameOverProps) {
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    // Show initial content for 5 seconds
    const timer = setTimeout(() => {
      setShowInitialContent(false);
      setShowLoading(true);
      
      // Start loading progress
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            onExit(); // Exit after loading completes
            return 100;
          }
          return prev + 1; // Reduced from 2 to 1 to make loading take longer
        });
      }, 30);

      return () => clearInterval(interval);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onExit]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-50"
    >
      {/* Cyber Grid Background with scan line effect */}
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-20">
        <div className="absolute inset-0 animate-scan-line" />
      </div>
      
      {/* Animated Waves with Glow */}
      <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden">
        <Wave 
          fill="url(#waveGradient1)"
          paused={false}
          style={{ 
            display: 'flex',
            transform: 'translateY(50%)',
            position: 'relative'
          }}
          options={{
            height: 40,
            amplitude: 25,
            speed: 0.15,
            points: 5
          }}
        />
        <Wave 
          fill="url(#waveGradient2)"
          paused={false}
          style={{ 
            display: 'flex',
            transform: 'translateY(20%)',
            marginTop: '-20px',
            position: 'relative'
          }}
          options={{
            height: 30,
            amplitude: 20,
            speed: 0.2,
            points: 4
          }}
        />
        <Wave 
          fill="url(#waveGradient3)"
          paused={false}
          style={{ 
            display: 'flex',
            transform: 'translateY(-10%)',
            marginTop: '-15px',
            position: 'relative'
          }}
          options={{
            height: 25,
            amplitude: 15,
            speed: 0.25,
            points: 3
          }}
        />
        
        {/* SVG Gradients */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.4)" />
              <stop offset="50%" stopColor="rgba(168, 85, 247, 0.4)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0.4)" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
              <stop offset="50%" stopColor="rgba(167, 139, 250, 0.3)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
            </linearGradient>
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(124, 58, 237, 0.2)" />
              <stop offset="50%" stopColor="rgba(139, 92, 246, 0.2)" />
              <stop offset="100%" stopColor="rgba(124, 58, 237, 0.2)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content with Score */}
      <AnimatePresence>
        {showInitialContent && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-xl mx-4 bg-background/20 p-8 rounded-3xl border border-primary/30 shadow-2xl backdrop-blur-md"
          >
            {/* Title with Glitch Effect */}
            <div className="text-center mb-10 relative">
              <motion.div
                className="relative inline-block"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 1 }}
              >
                <h2 className="text-5xl font-bold orbitron text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                  System Terminated
                </h2>
                <motion.div
                  className="absolute inset-0 text-primary"
                  style={{
                    animation: "glitch 1s infinite",
                    animationTimingFunction: "steps(2, end)",
                    clipPath: "inset(40% 0 61% 0)",
                  }}
                >
                  System Terminated
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-neutral-400 exo"
              >
                Combat Simulation Complete
              </motion.div>
            </div>

            {/* Stats Grid with Cyber Effects */}
            <AnimatePresence>
              {showStats && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-2 gap-6 mb-8"
                >
                  {/* Score Card with Glitch Effect */}
                  <motion.div 
                    className="col-span-2 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl border border-primary/20 glass-effect relative group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="absolute inset-0 bg-grid opacity-10" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-primary animate-pulse" />
                        <span className="text-lg text-neutral-300 orbitron">Final Score</span>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary orbitron"
                      >
                        {finalScore}
                      </motion.div>
                    </div>
                    <div className="absolute inset-0 border border-primary/30 rounded-2xl glow-effect" />
                  </motion.div>

                  {/* Stats Cards */}
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-background/10 p-4 rounded-xl border border-primary/20 glass-effect group hover:bg-primary/5 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-5 h-5 text-secondary group-hover:animate-pulse" />
                      <span className="text-neutral-400 orbitron">WPM</span>
                    </div>
                    <motion.div className="text-2xl font-bold text-white orbitron">
                      {wpm}
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-background/10 p-4 rounded-xl border border-primary/20 glass-effect group hover:bg-primary/5 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-5 h-5 text-accent group-hover:animate-pulse" />
                      <span className="text-neutral-400 orbitron">Level</span>
                    </div>
                    <motion.div className="text-2xl font-bold text-white orbitron">
                      {level}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Progress Bar (shown at the end) */}
      <AnimatePresence>
        {showLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-md mx-4"
          >
            <div className="text-center mb-8">
              <motion.div
                className="text-4xl font-bold mb-2 orbitron relative inline-block"
                style={{
                  textShadow: "2px 2px 20px rgba(147, 51, 234, 0.5)",
                  animation: "glitch 1s infinite",
                  animationTimingFunction: "steps(2, end)",
                }}
              >
                GAME OVER
              </motion.div>
              <div className="text-primary/60 mt-2">System Shutdown Sequence Initiated</div>
            </div>
            
            <div className="relative h-2 bg-background/20 rounded-full overflow-hidden border border-primary/20">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-grid opacity-20" />
            </div>
            
            <div className="mt-2 text-center text-sm text-primary/60 font-mono">
              System Shutdown: {loadingProgress}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add styles for animations */}
      <style>
        {`
        @keyframes glitch {
          ${Object.entries(glitchAnim).map(([key, value]) => `${key} { ${Object.entries(value).map(([k, v]) => `${k}:${v}`).join(';')} }`).join('\n')}
        }
        @keyframes scan-line {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }
        .animate-scan-line {
          position: absolute;
          width: 100%;
          height: 100px;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(147, 51, 234, 0.1) 50%,
            transparent
          );
          animation: scan-line 4s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .glow-effect {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.2);
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          from {
            box-shadow: 0 0 10px rgba(147, 51, 234, 0.2);
          }
          to {
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.4);
          }
        }
      `}
      </style>
    </motion.div>
  );
}
