import React, { useEffect, useRef, useState } from 'react';
import { useResponsive } from '@/hooks/use-responsive';
import { Progress } from '@/components/ui/progress';
import { PowerUpInfo } from '@/components/game/PowerUpInfo';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getRandomWords as getSimpleWords } from '@/data/SimpleWords';
import { getRandomWords as getHardWords } from '@/data/wordList';
import DesertModal from './DesertModal';
import { CombatSidebar } from './CombatSidebar';

export interface GameCanvasProps {
  onScoreChange: (score: number) => void;
  onLevelChange: (level: number) => void;
  onWpmChange: (wpm: number) => void;
  onGameOver: () => void;
  onComboChange: (combo: number) => void;
  difficulty?: 'easy' | 'mid' | 'crazy';
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onScoreChange,
  onLevelChange,
  onWpmChange,
  onGameOver,
  onComboChange,
  difficulty = 'mid',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPortrait } = useResponsive();
  
  const gameStateRef = useRef({
    activeWords: [] as any[],
    projectiles: [] as any[],
    currentWord: null as any,
    typedIndex: 0,
    score: 0,
    level: 1,
    playerHP: 100,
    enemyHP: 100,
    wordSpeedBase: 2,
    combo: 0,
    wordsTyped: 0,
    charactersTyped: 0,
    startTime: Date.now(),
    lastWpmUpdate: 0,
    enemyFlashTimer: 0,
    isTyping: false,
    frameId: 0,
    lastScoreUpdate: 0,
    lastComboUpdate: 0,
    enemyHurtFrames: 0,
    enemyHurtOffset: 0,
    playerHurtFrames: 0,
    playerHurtOffset: 0,
    playerHitParticles: [] as { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[],
    floatingNumbers: [] as { x: number; y: number; vy: number; value: number; alpha: number; scale: number }[],
    comboEffect: { scale: 1, alpha: 0, value: 0 },
    backgroundImage: null as HTMLImageElement | null,
    difficultySpeedMultiplier: 2,
  });

  useEffect(() => {
    const speedMultipliers = {
      easy: 2,
      mid: 3,
      crazy: 4
    };
    
    gameStateRef.current.difficultySpeedMultiplier = speedMultipliers[difficulty] || 2;
    console.log(`Difficulty set to ${difficulty}: Speed multiplier ${gameStateRef.current.difficultySpeedMultiplier}x`);
  }, [difficulty]);

  const callbacksRef = useRef({
    onScoreChange,
    onLevelChange,
    onWpmChange,
    onGameOver,
    onComboChange,
  });

  useEffect(() => {
    callbacksRef.current = {
      onScoreChange,
      onLevelChange,
      onWpmChange,
      onGameOver,
      onComboChange,
    };
  }, [onScoreChange, onLevelChange, onWpmChange, onGameOver, onComboChange]);

  const [useHardWords, setUseHardWords] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [playerAcceptedChallenge, setPlayerAcceptedChallenge] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [bestKillStreak, setBestKillStreak] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gameState = gameStateRef.current;
    const callbacks = callbacksRef.current;

    gameState.enemyHurtFrames = 0;
    gameState.enemyHurtOffset = 0;
    
    gameState.playerHurtFrames = 0;
    gameState.playerHurtOffset = 0;
    gameState.playerHitParticles = [];

    const characterImg = new Image(); characterImg.src = '/character.png';
    const enemyImg = new Image(); enemyImg.src = '/character2.png';
    const slashImg = new Image(); slashImg.src = '/slash.png';
    const backgroundImg = new Image(); backgroundImg.src = '/background.png';
    gameState.backgroundImage = backgroundImg;

    class Word {
      text: string;
      x: number;
      y: number;
      speed: number;
      isHealing: boolean;
      constructor(text: string, x: number, y: number, speed: number, isHealing = false) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.isHealing = isHealing;
      }
      draw() {
        ctx.textAlign = 'left';
        ctx.font = '26px MedievalSharp';
        ctx.fillStyle = this.isHealing ? '#FFD700' : '#E2E8F0';
        ctx.fillText(this.text, this.x, this.y);
        
        if (gameState.currentWord === this) {
          ctx.fillStyle = this.isHealing ? '#FFA500' : '#00CED1';
          ctx.shadowColor = this.isHealing ? '#FFA500' : '#00CED1';
          ctx.shadowBlur = 15;
          ctx.fillText(this.text.substring(0, gameState.typedIndex), this.x, this.y);
          ctx.shadowBlur = 0;
        }
      }
      update() {
        this.x -= this.speed;
        if (this.x <= 80) {
          const hitX = this.x;
          const hitY = this.y;
          
          gameState.activeWords = gameState.activeWords.filter(w => w !== this);
          gameState.playerHP -= 10 + gameState.level;
          gameState.combo = 0;
          callbacks.onComboChange(gameState.combo);
          
          gameState.playerHurtFrames = 15;
          gameState.playerHurtOffset = 10;
          
          for (let i = 0; i < 30; i++) {
            gameState.playerHitParticles.push({
              x: hitX + Math.random() * 50,
              y: hitY + Math.random() * 30 - 15,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5 - 2,
              alpha: 1,
              size: Math.random() * 8 + 3
            });
          }
          
          if (gameState.playerHP <= 0) endGame();
        }
      }
    }

    class Projectile {
      x: number;
      y: number;
      img: HTMLImageElement;
      w: number;
      h: number;
      speed = 30;
      damage: number;
      hit = false;
      hitFrames = 0;
      particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = [];
    
      constructor(x: number, y: number, img: HTMLImageElement, w: number, h: number, damage: number) {
        this.x = x;
        this.y = y;
        this.img = img;
        this.w = w;
        this.h = h;
        this.damage = damage;
      }
    
      update() {
        if (!this.hit) {
          this.x += this.speed;
          if (this.x >= canvas.width - 300) {
            this.hit = true;
            this.hitFrames = 0;
            gameState.enemyFlashTimer = 10;
            gameState.enemyHP -= this.damage;
            
            gameState.floatingNumbers.push({
              x: canvas.width - 250,
              y: canvas.height - 319 + Math.random() * 50,
              vy: -2,
              value: this.damage,
              alpha: 1,
              scale: 1
            });

            gameState.enemyHurtFrames = 15;
            gameState.enemyHurtOffset = 10;
            
            if (gameState.enemyHP <= 0) levelUp();
            
            for (let i = 0; i < 30; i++) {
              this.particles.push({
                x: canvas.width - 250 + Math.random() * 100,
                y: canvas.height - 319 + Math.random() * 200,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5 - 2,
                alpha: 1,
                size: Math.random() * 8 + 3
              });
            }
          }
        } else {
          for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.03;
            p.size *= 0.97;
            
            if (p.alpha <= 0) {
              this.particles.splice(i, 1);
            }
          }
        }
      }
    
      draw() {
        if (!this.hit) {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
        }
        
        for (const p of this.particles) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          
          const gradient = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, p.size
          );
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
          gradient.addColorStop(0.5, 'rgba(255, 50, 50, 0.6)');
          gradient.addColorStop(1, 'rgba(200, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }
    
    const getWord = () => {
      return useHardWords ? getHardWords(1)[0] : getSimpleWords(1)[0];
    };

    const spawnWord = () => {
      if (gamePaused) return;
      const text = getWord();
      const y = canvas.height - 120;
      const x = canvas.width - 80;
      
      const baseSpeed = gameState.wordSpeedBase;
      const speedMultiplier = Math.random() * 0.5 + 1; // Random variation
      const finalSpeed = baseSpeed * speedMultiplier; 
      
      const isHealing = Math.random() < 0.2;
      gameState.activeWords.push(new Word(text, x, y, finalSpeed, isHealing));
    };

    const drawHealthBar = (x: number, y: number, w: number, h: number, val: number, col: string, label: string) => {
      const barHeight = 12;
      const cornerRadius = 6;
      
      ctx.font = '14px MedievalSharp';
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + w/2, y - 8);

      ctx.beginPath();
      ctx.roundRect(x, y, w, barHeight, cornerRadius);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fill();
      
      const gradient = ctx.createLinearGradient(x, y, x + w, y);
      if (col === 'lime') {
        gradient.addColorStop(0, '#48BB78');
        gradient.addColorStop(1, '#68D391');
      } else {
        gradient.addColorStop(0, '#F56565');
        gradient.addColorStop(1, '#FC8181');
      }
      
      ctx.beginPath();
      ctx.roundRect(x, y, (w * val/100), barHeight, cornerRadius);
      ctx.fillStyle = gradient;
      ctx.fill();

      const shine = ctx.createLinearGradient(x, y, x, y + barHeight);
      shine.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      shine.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shine;
      ctx.fill();
    };

    const startTime = Date.now();
    gameState.startTime = startTime;

    const updateWPM = () => {
      const elapsed = (Date.now() - gameState.startTime) / 60000;
      const wpm = elapsed > 0 ? Math.round((gameState.charactersTyped / 5) / elapsed) : 0;
      
      const now = Date.now();
      if (now - gameState.lastWpmUpdate > 200) {
        gameState.lastWpmUpdate = now;
        callbacks.onWpmChange(wpm);
      }
    };

    const levelUp = () => {
      if (!playerAcceptedChallenge && gameState.level >= 1) {
        setShowLevelUpModal(true);
        setGamePaused(true);
      } else {
        gameState.level++;
        gameState.wordSpeedBase += 0.5 * gameState.difficultySpeedMultiplier;
        gameState.enemyHP = 100 + gameState.level * 5;
        onLevelChange(gameState.level);
      }
    };

    const endGame = () => {
      cancelAnimationFrame(gameState.frameId);
      clearInterval(spawnInterval);
      callbacks.onGameOver();
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const groundHeight = 0;
      const groundY = canvas.height - groundHeight - 0;
      
      ctx.fillStyle = '#1A0F0A';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      
      const tileWidth = 40;
      const tileCount = Math.ceil(canvas.width / tileWidth) + 1;
      
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < tileCount; i++) {
          const x = i * tileWidth;
          const y = groundY + (row * groundHeight);
          
          ctx.fillStyle = '#333'; 
          ctx.fillRect(x, y, tileWidth, groundHeight);
          
          if (row === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(x, y, tileWidth, 2);
          }
        }
      }

      if (gameState.enemyHurtFrames > 0) {
        gameState.enemyHurtFrames--;
        gameState.enemyHurtOffset = Math.sin(gameState.enemyHurtFrames * 0.5) * 5;
      } else {
        gameState.enemyHurtOffset = 0;
      }
      
      if (gameState.playerHurtFrames > 0) {
        gameState.playerHurtFrames--;
        gameState.playerHurtOffset = Math.sin(gameState.playerHurtFrames * 0.5) * 5;
      } else {
        gameState.playerHurtOffset = 0;
      }
      
      for (let i = gameState.playerHitParticles.length - 1; i >= 0; i--) {
        const p = gameState.playerHitParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        p.size *= 0.97;
        
        if (p.alpha <= 0) {
          gameState.playerHitParticles.splice(i, 1);
        }
      }

      if (enemyImg.complete) {
        if (gameState.enemyFlashTimer > 0) {
          ctx.globalAlpha = 0.7;
          ctx.drawImage(enemyImg, canvas.width - 250 + gameState.enemyHurtOffset, canvas.height - 319, 265, 300);
          ctx.globalAlpha = 1;
          gameState.enemyFlashTimer--;
        } else {
          ctx.drawImage(enemyImg, canvas.width - 250 + gameState.enemyHurtOffset, canvas.height - 319, 265, 300);
        }
      }
      drawHealthBar(canvas.width - 140, canvas.height - 180, 100, 10, gameState.enemyHP, 'red', 'ENEMY');

      if (characterImg.complete) {
        ctx.drawImage(characterImg, 20 + gameState.playerHurtOffset, canvas.height - 319, 255, 300);
      }
      drawHealthBar(20, canvas.height - 180, 100, 10, gameState.playerHP, 'lime', 'YOU');

      for (const p of gameState.playerHitParticles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 50, 50, 0.6)');
        gradient.addColorStop(1, 'rgba(200, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      gameState.activeWords.forEach(w => { w.update(); w.draw(); });
      gameState.projectiles.forEach(p => { p.update(); p.draw(); });
      gameState.projectiles = gameState.projectiles.filter(p => !p.hit || p.particles.length > 0);

      ctx.font = 'bold 24px MedievalSharp';
      for (let i = gameState.floatingNumbers.length - 1; i >= 0; i--) {
        const num = gameState.floatingNumbers[i];
        num.y += num.vy;
        num.alpha -= 0.02;
        num.scale += 0.02;
        
        if (num.alpha <= 0) {
          gameState.floatingNumbers.splice(i, 1);
          continue;
        }
        
        ctx.save();
        ctx.globalAlpha = num.alpha;
        ctx.fillStyle = '#FF4444';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.translate(num.x, num.y);
        ctx.scale(num.scale, num.scale);
        ctx.strokeText(`${num.value}`, 0, 0);
        ctx.fillText(`${num.value}`, 0, 0);
        ctx.restore();
      }

      if (gameState.comboEffect.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = gameState.comboEffect.alpha;
        ctx.font = 'bold 48px MedievalSharp';
        const comboText = `${gameState.comboEffect.value}x COMBO!`;
        const textWidth = ctx.measureText(comboText).width;
        
        const x = (canvas.width - textWidth) / 2;
        const y = 100;
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(comboText, x, y);
        
        const gradient = ctx.createLinearGradient(x, y - 40, x, y);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        ctx.fillStyle = gradient;
        ctx.fillText(comboText, x, y);
        
        gameState.comboEffect.scale *= 0.95;
        gameState.comboEffect.alpha -= 0.02;
        ctx.restore();
      }

      updateWPM();
      gameState.frameId = requestAnimationFrame(gameLoop);
    };

    let spawnInterval: NodeJS.Timeout | null = null;
    if (!gamePaused) {
      spawnInterval = setInterval(spawnWord, 2000);
      gameLoop();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        gameState.isTyping = true;
      }
      
      if (!gameState.currentWord) {
        for (const word of gameState.activeWords) {
          if (word.text[0].toLowerCase() === key) { 
            gameState.currentWord = word;
            gameState.typedIndex = 1;
            gameState.charactersTyped++;
            break;
          }
        }
      } else if (gameState.currentWord.text[gameState.typedIndex].toLowerCase() === key) {
        gameState.typedIndex++;
        gameState.charactersTyped++;
        
        if (gameState.typedIndex >= gameState.currentWord.text.length) {
          gameState.activeWords = gameState.activeWords.filter(word => word !== gameState.currentWord);
          
          gameState.combo++;
          gameState.comboEffect = {
            scale: 1.5,
            alpha: 1,
            value: gameState.combo
          };
          
          gameState.wordsTyped++;
          gameState.score += gameState.combo;
          
          const now = Date.now();
          if (now - gameState.lastComboUpdate > 100) {
            gameState.lastComboUpdate = now;
            callbacks.onComboChange(gameState.combo);
          }
          
          if (now - gameState.lastScoreUpdate > 100) {
            gameState.lastScoreUpdate = now;
            callbacks.onScoreChange(gameState.score);
          }
          
          if (gameState.currentWord.isHealing) {
            gameState.playerHP = Math.min(100, gameState.playerHP + 20);
          } else {
            gameState.projectiles.push(new Projectile(80, canvas.height - 230, slashImg, 255, 160, 10 + gameState.level));
          }
          
          gameState.currentWord = null;
          gameState.typedIndex = 0;
          
          setTimeout(() => {
            gameState.isTyping = false;
          }, 500);
        }
      } else {
        gameState.combo = 0;
        gameState.comboEffect = {
          scale: 1,
          alpha: 0,
          value: 0
        };
        callbacks.onComboChange(gameState.combo);
        gameState.currentWord = null;
        gameState.typedIndex = 0;
        gameState.isTyping = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(gameState.frameId);
      if (spawnInterval) clearInterval(spawnInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [useHardWords, gamePaused, playerAcceptedChallenge, difficulty]);

  // Update best scores
  useEffect(() => {
    const gameState = gameStateRef.current;
    if (gameState.score > bestScore) {
      setBestScore(gameState.score);
    }
    if (gameState.combo > bestCombo) {
      setBestCombo(gameState.combo);
    }
    // Calculate accuracy
    const accuracy = gameState.wordsTyped > 0 
      ? Math.round((gameState.wordsTyped / (gameState.wordsTyped + gameState.activeWords.length)) * 100) 
      : 100;
    if (accuracy > bestAccuracy) {
      setBestAccuracy(accuracy);
    }
    // Kill streak is tracked by combo in this case
    if (gameState.combo > bestKillStreak) {
      setBestKillStreak(gameState.combo);
    }
  }, [gameStateRef.current.score, gameStateRef.current.combo, gameStateRef.current.wordsTyped]);

  return (
    <div className="relative w-full h-full">
      {showLevelUpModal && (
        <DesertModal
          onAccept={() => {
            setUseHardWords(true);
            setPlayerAcceptedChallenge(true);
            setShowLevelUpModal(false);
            setGamePaused(false);
            const gameState = gameStateRef.current;
            gameState.level++;
            gameState.wordSpeedBase += 0.5 * gameState.difficultySpeedMultiplier;
            gameState.enemyHP = 100 + gameState.level * 5;
            onLevelChange(gameState.level);
          }}
          onDecline={() => {
            setShowLevelUpModal(false);
            setGamePaused(false);
            const gameState = gameStateRef.current;
            gameState.level++;
            gameState.wordSpeedBase += 0.5 * gameState.difficultySpeedMultiplier;
            gameState.enemyHP = 100 + gameState.level * 5;
            onLevelChange(gameState.level);
          }}
        />
      )}

      {/* Menu Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          className="relative w-10 h-10 rounded-lg border border-primary/50 bg-background/50 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-4 h-4 text-primary" />
          <div className="absolute inset-0 bg-primary/20 rounded-lg blur animate-pulse"></div>
        </Button>
      </div>

      {/* Combat Sidebar */}
      <CombatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onRestart={() => window.location.reload()}
        onExit={onGameOver}
        currentScore={gameStateRef.current.score}
        bestScore={bestScore}
        bestKillStreak={bestKillStreak}
        bestAccuracy={bestAccuracy}
        bestCombo={bestCombo}
        playerName={localStorage.getItem('playerName') || 'Player'}
        playerAvatar="/default-avatar.png"
      />

      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
