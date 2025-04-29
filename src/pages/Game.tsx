
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameUI } from '@/components/game/GameUI';
import { GameOver } from '@/components/game/GameOver';
import { ModeIndicator } from '@/components/game/ModeIndicator';
import { AncientBackground } from '@/components/game/AncientBackground';
import { TimeAttackMode } from '@/components/game/TimeAttackMode';
import { TimeGardenMode } from '@/components/game/TimeGardenMode';
import { toast } from '@/hooks/use-toast';

const Game = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [wpm, setWpm] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameMode, setGameMode] = useState('classic');
  const [isVisible, setIsVisible] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'mid' | 'crazy'>('mid'); // Fix type here
  
  useEffect(() => {
    // Check if player name exists
    const playerName = localStorage.getItem('playerName');
    if (!playerName) {
      navigate('/');
      return;
    }
    
    // Get selected game mode from localStorage
    const selectedMode = localStorage.getItem('selectedGameMode');
    if (selectedMode) {
      setGameMode(selectedMode);
    }
    
    // Get selected difficulty from localStorage
    const selectedDifficulty = localStorage.getItem('selectedDifficulty') as 'easy' | 'mid' | 'crazy' | null;
    if (selectedDifficulty && (selectedDifficulty === 'easy' || selectedDifficulty === 'mid' || selectedDifficulty === 'crazy')) {
      setDifficulty(selectedDifficulty);
    }
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Welcome message
    toast({
      title: "Game Started!",
      description: `Welcome ${playerName} to ${selectedMode || 'classic'} mode${selectedDifficulty ? ` (${selectedDifficulty} difficulty)` : ''}`,
      duration: 3000
    });
    
  }, [navigate]);

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const handleRetry = () => {
    setIsGameOver(false);
    setScore(0);
    setLevel(1);
    setWpm(0);
    setCombo(0);
  };

  const handleBackToModes = () => {
    navigate('/mode-select');
  };

  // Render different game modes
  const renderGameMode = () => {
    switch (gameMode) {
      case 'timeattack':
        return (
          <TimeAttackMode
            onScoreChange={setScore}
            onWpmChange={setWpm}
            onGameOver={handleGameOver}
          />
        );
      case 'zen':
        return (
          <TimeGardenMode
            onScoreChange={setScore}
            onWpmChange={setWpm}
            onGameOver={handleGameOver}
          />
        );
      default: // combat mode and others
        return (
          <>
            <AncientBackground />
            <GameCanvas 
              onScoreChange={setScore}
              onLevelChange={setLevel}
              onWpmChange={setWpm}
              onGameOver={handleGameOver}
              onComboChange={setCombo}
              difficulty={difficulty}
            />
            <GameUI score={score} level={level} wpm={wpm} />
          </>
        );
    }
  };

  return (
    <div className={`relative min-h-screen transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {!isGameOver ? (
        renderGameMode()
      ) : (
        <GameOver 
          finalScore={score}
          wpm={wpm}
          level={level}
          onRestart={handleRetry}
          onExit={handleBackToModes}
        />
      )}
    </div>
  );
};

export default Game;
