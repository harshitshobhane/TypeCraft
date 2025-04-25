
import React from 'react';
import { Button } from '@/components/ui/button';

interface GameOverProps {
  onRestart: () => void;
}

export const GameOver = ({ onRestart }: GameOverProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-destructive text-center z-50 backdrop-blur-sm p-8 rounded-xl border border-destructive/50">
      <div className="mb-6">💀 Game Over</div>
      <Button 
        size="lg"
        className="bg-primary hover:bg-primary/90 text-xl px-8 py-6"
        onClick={onRestart}
      >
        Restart
      </Button>
    </div>
  );
};
