
import React from 'react';

interface GameUIProps {
  score: number;
  level: number;
  wpm: number;
}

export const GameUI = ({ score, wpm }: GameUIProps) => {
  return (
    <div className="absolute top-8 left-5 bg-black/80 p-4 rounded-xl font-mono text-xl z-50 border border-primary/50 shadow-[0_0_12px_rgba(var(--primary))]">
      <div className="space-y-2">
        <div>🎯 Score: <span className="text-primary">{score}</span></div>
        <div>⚡ WPM: <span className="text-accent">{wpm}</span></div>
      </div>
    </div>
  );
};
