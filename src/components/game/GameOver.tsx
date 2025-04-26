
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameOverProps {
  onRestart: () => void;
  onExit?: () => void;
  score?: number;
  wpm?: number;
  level?: number;
}

export const GameOver = ({ onRestart, onExit, score = 0, wpm = 0, level = 1 }: GameOverProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-50 backdrop-blur-sm p-8 rounded-xl border border-destructive/50 max-w-md w-full">
      <div className="mb-6 text-4xl text-destructive">💀 Game Over</div>
      
      <div className="mb-8 grid gap-3 bg-black/80 p-4 rounded-lg border border-primary/30">
        <div className="text-xl">🎯 Final Score: <span className="text-primary font-bold">{score}</span></div>
        <div className="text-xl">⚡ WPM: <span className="text-accent font-bold">{wpm}</span></div>
        <div className="text-xl">🏆 Level: <span className="text-secondary font-bold">{level}</span></div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button 
          size="lg"
          className="bg-primary hover:bg-primary/90 text-xl px-8 py-6"
          onClick={onRestart}
        >
          Restart
        </Button>
        
        {onExit && (
          <Button 
            size="lg"
            variant="outline"
            className="text-xl px-8 py-6 border-primary/50 hover:bg-primary/20"
            onClick={onExit}
          >
            Main Menu
          </Button>
        )}
      </div>
    </div>
  );
};
