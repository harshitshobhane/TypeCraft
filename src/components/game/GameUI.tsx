
import React from 'react';
import { motion } from 'framer-motion';

interface GameUIProps {
  score: number;
  level: number;
  wpm: number;
}

export const GameUI = ({ score, level, wpm }: GameUIProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-8 left-5 p-4 rounded-lg z-50"
      style={{
        background: "url('/lovable-uploads/fec9c655-3395-472e-948b-3cb96e14fee5.png') no-repeat center/cover",
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
        border: "2px solid rgba(139, 92, 246, 0.5)"
      }}
    >
      <div className="space-y-3 font-['Cinzel_Decorative'] text-xl">
        <div className="flex items-center gap-2 text-amber-200">
          <span className="text-lg opacity-90">𓆣</span>
          Score: <span className="text-primary">{score}</span>
        </div>
        <div className="flex items-center gap-2 text-amber-200">
          <span className="text-lg opacity-90">𓃭</span>
          Level: <span className="text-secondary">{level}</span>
        </div>
        <div className="flex items-center gap-2 text-amber-200">
          <span className="text-lg opacity-90">𓃻</span>
          WPM: <span className="text-accent">{wpm}</span>
        </div>
      </div>
      <div className="absolute -inset-px bg-gradient-to-r from-amber-500/10 to-primary/10 rounded-lg pointer-events-none" />
    </motion.div>
  );
};
