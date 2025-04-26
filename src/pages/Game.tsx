
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameUI } from '@/components/game/GameUI';
import { ComboDisplay } from '@/components/game/ComboDisplay';
import { GameOver } from '@/components/game/GameOver';
import { ModeIndicator } from '@/components/game/ModeIndicator';
import { AncientBackground } from '@/components/game/AncientBackground';
import { TimeAttackMode } from '@/components/game/TimeAttackMode';
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
    
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Welcome message
    toast({
      title: "Game Started!",
      description: `Welcome ${playerName} to ${selectedMode || 'classic'} mode`,
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

  return (
    <div className={`relative min-h-screen transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <AncientBackground />
      
      {!isGameOver ? (
        <>
          {gameMode === 'timeattack' ? (
            <TimeAttackMode
              onScoreChange={setScore}
              onWpmChange={setWpm}
              onGameOver={handleGameOver}
            />
          ) : (
            <>
              <GameCanvas 
                onScoreChange={setScore}
                onLevelChange={setLevel}
                onWpmChange={setWpm}
                onGameOver={handleGameOver}
                onComboChange={setCombo}
              />
              <GameUI score={score} level={level} wpm={wpm} />
              <ComboDisplay combo={combo} />
            </>
          )}
          <ModeIndicator mode={gameMode} />
        </>
      ) : (
        <GameOver 
          score={score}
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
