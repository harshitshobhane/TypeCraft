
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface GrowingVineProps {
  startPosition: { x: number; y: number };
  era: 'ancient' | 'medieval' | 'future';
  thickness?: number;
  length?: number;
  delay?: number;
  progress?: number;
}

export const GrowingVine: React.FC<GrowingVineProps> = ({ 
  startPosition, 
  era, 
  thickness = 3,
  length = 400,
  delay = 0,
  progress = 100
}) => {
  const curveRandomness = React.useMemo(() => ({
    x1: (Math.random() - 0.5) * 100, // Reduced randomness for smoother curves
    x2: (Math.random() - 0.5) * 100,
    y1: length * 0.33, // Adjusted control points for smoother curves
    y2: length * 0.66
  }), [length]);

  const getParticleColor = () => {
    switch (era) {
      case 'ancient':
        return 'rgba(126, 213, 111, 0.8)';
      case 'medieval':
        return 'rgba(180, 90, 211, 0.8)';
      case 'future':
        return 'rgba(56, 182, 255, 0.8)';
    }
  };

  const getFlowerEmoji = () => {
    switch (era) {
      case 'ancient':
        return '🌿';
      case 'medieval':
        return '🌹';
      case 'future':
        return '✨';
    }
  };

  const getGlowColor = () => {
    switch (era) {
      case 'ancient':
        return '0 0 8px rgba(126, 213, 111, 0.8)';
      case 'medieval':
        return '0 0 8px rgba(180, 90, 211, 0.8)';
      case 'future':
        return '0 0 8px rgba(56, 182, 255, 0.8)';
    }
  };

  const getVinePath = () => {
    const adjustedLength = (length * (progress / 100));
    return `M ${startPosition.x} ${startPosition.y} 
            C ${startPosition.x + curveRandomness.x1} ${startPosition.y - adjustedLength * 0.33}, 
              ${startPosition.x + curveRandomness.x2} ${startPosition.y - adjustedLength * 0.66}, 
              ${startPosition.x} ${startPosition.y - adjustedLength}`;
  };

  return (
    <motion.div
      className="absolute w-full h-full pointer-events-none overflow-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }} // Faster fade-in
    >
      <svg className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`vineGradient-${startPosition.x}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.9)" />
            <stop offset="90%" stopColor="rgba(0,0,0,0.7)" />
            <stop offset="100%" stopColor={getParticleColor()} />
          </linearGradient>
          <filter id={`glow-${startPosition.x}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id={`softGlow-${startPosition.x}`}>
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <motion.path
          d={getVinePath()}
          stroke="rgba(0,0,0,0.4)"
          strokeWidth={thickness + 4}
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: progress / 100, 
            opacity: 0.4,
            transition: { duration: 2.5, delay: delay, ease: "easeOut" } // Faster growth
          }}
        />
        
        <motion.path
          d={getVinePath()}
          stroke={`url(#vineGradient-${startPosition.x})`}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          filter={`url(#softGlow-${startPosition.x})`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: progress / 100, 
            opacity: 1,
            transition: { duration: 2, delay: delay, ease: "easeOut" } // Faster and smoother growth
          }}
        />

        {progress >= 95 && (
          <motion.circle
            cx={startPosition.x}
            cy={startPosition.y - (length * (progress / 100))}
            r={thickness * 1.5}
            fill={getParticleColor()}
            filter={`url(#glow-${startPosition.x})`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0.8, 1], 
              opacity: [0, 1, 0.8, 1],
              transition: { 
                duration: 1, // Faster flower animation
                delay: delay + 1.5, 
                ease: "easeOut"
              }
            }}
          />
        )}

        {[...Array(3)].map((_, i) => (
          <motion.circle
            key={i}
            cx={startPosition.x}
            cy={startPosition.y - (i * length/3)}
            r={thickness * 0.8}
            fill={getParticleColor()}
            filter={`url(#glow-${startPosition.x})`}
            initial={{ 
              opacity: 0,
              x: startPosition.x 
            }}
            animate={{ 
              opacity: [0, 0.8, 0],
              x: [
                startPosition.x,
                startPosition.x + (Math.random() - 0.5) * 20, // Reduced particle movement
                startPosition.x + (Math.random() - 0.5) * 10
              ],
              y: [
                startPosition.y - (i * length/3),
                startPosition.y - (i * length/3) - 20,
                startPosition.y - (i * length/3) - 40
              ]
            }}
            transition={{ 
              duration: 2 + i * 0.4, // Faster particle animation
              delay: delay + 1 + i * 0.3,
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: Math.random()
            }}
          />
        ))}

        {progress >= 95 && (
          <foreignObject
            x={startPosition.x - 15}
            y={startPosition.y - (length * (progress / 100)) - 20}
            width="30"
            height="30"
            style={{ overflow: 'visible' }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                transition: { delay: delay + 2, duration: 0.4 } // Faster emoji appearance
              }}
              className="text-center text-xl"
              style={{ textShadow: getGlowColor() }}
            >
              {getFlowerEmoji()}
            </motion.div>
          </foreignObject>
        )}
      </svg>
    </motion.div>
  );
};
