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

export interface GameCanvasProps {
  onScoreChange: (score: number) => void;
  onLevelChange: (level: number) => void;
  onWpmChange: (wpm: number) => void;
  onGameOver: () => void;
  onComboChange: (combo: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onScoreChange,
  onLevelChange,
  onWpmChange,
  onGameOver,
  onComboChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPortrait } = useResponsive();
  
  // Add refs to store mutable game state
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
  });

  // Create a stable reference to the callback functions
  const callbacksRef = useRef({
    onScoreChange,
    onLevelChange,
    onWpmChange,
    onGameOver,
    onComboChange,
  });

  // Update the callbacks ref when props change
  useEffect(() => {
    callbacksRef.current = {
      onScoreChange,
      onLevelChange,
      onWpmChange,
      onGameOver,
      onComboChange,
    };
  }, [onScoreChange, onLevelChange, onWpmChange, onGameOver, onComboChange]);

  // Add state to control which word list is used
  const [useHardWords, setUseHardWords] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [playerAcceptedChallenge, setPlayerAcceptedChallenge] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set initial size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Use gameState from ref
    const gameState = gameStateRef.current;
    const callbacks = callbacksRef.current;

    // Add enemy hurt animation state
    gameState.enemyHurtFrames = 0;
    gameState.enemyHurtOffset = 0;
    
    // Add player hurt animation state
    gameState.playerHurtFrames = 0;
    gameState.playerHurtOffset = 0;
    gameState.playerHitParticles = [];

    // Load assets
    const characterImg = new Image(); characterImg.src = '/character.png';
    const enemyImg = new Image(); enemyImg.src = '/character2.png';
    const slashImg = new Image(); slashImg.src = '/slash.png';
    const backgroundImg = new Image(); backgroundImg.src = '/background.png';
    gameState.backgroundImage = backgroundImg;

    // Define classes inside effect
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
          // Store the word's position for the hit effect
          const hitX = this.x;
          const hitY = this.y;
          
          gameState.activeWords = gameState.activeWords.filter(w => w !== this);
          gameState.playerHP -= 10 + gameState.level;
          gameState.combo = 0;
          callbacks.onComboChange(gameState.combo);
          
          // Trigger player hurt animation
          gameState.playerHurtFrames = 15;
          gameState.playerHurtOffset = 10; // Initial shake offset
          
          // Create red hit particles at the word's position
          for (let i = 0; i < 30; i++) {
            gameState.playerHitParticles.push({
              x: hitX + Math.random() * 50,
              y: hitY + Math.random() * 30 - 15,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5 - 2, // Slight upward bias
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
            
            // Add floating damage number
            gameState.floatingNumbers.push({
              x: canvas.width - 250,
              y: canvas.height - 319 + Math.random() * 50,
              vy: -2,
              value: this.damage,
              alpha: 1,
              scale: 1
            });

            // Trigger enemy hurt animation
            gameState.enemyHurtFrames = 15;
            gameState.enemyHurtOffset = 10;
            
            if (gameState.enemyHP <= 0) levelUp();
            
            // Create red hit particles
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
          // Update particles
          for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.03; // Slower fade
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
        
        // Draw red hit particles
        for (const p of this.particles) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          
          // Create a gradient for more dynamic particles
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
    
    // Helper to get a random word from the current word list
    const getWord = () => {
      return useHardWords ? getHardWords(1)[0] : getSimpleWords(1)[0];
    };

    const spawnWord = () => {
      if (gamePaused) return;
      const text = getWord();
      const y = canvas.height - 120;
      const x = canvas.width - 80;
      const speed = (gameState.wordSpeedBase + Math.random() * 0.5) * 1.5;
      const isHealing = Math.random() < 0.2;
      gameState.activeWords.push(new Word(text, x, y, speed, isHealing));
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
      const elapsed = (Date.now() - gameState.startTime) / 60000; // Convert to minutes
      
      // Calculate WPM based on characters typed (standard WPM calculation)
      // Standard WPM assumes 5 characters = 1 word
      const wpm = elapsed > 0 ? Math.round((gameState.charactersTyped / 5) / elapsed) : 0;
      
      // Only update WPM every 200ms for smoother updates
      const now = Date.now();
      if (now - gameState.lastWpmUpdate > 200) {
        gameState.lastWpmUpdate = now;
        callbacks.onWpmChange(wpm);
      }
    };

    const levelUp = () => {
      // Only show the modal if player hasn't accepted the challenge and level >= 2
      if (!playerAcceptedChallenge && gameState.level >= 1) {
        setShowLevelUpModal(true);
        setGamePaused(true);
      } else {
        // Normal level up
        gameState.level++;
        gameState.wordSpeedBase += 0.5;
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

      // Make canvas background transparent
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw ground with a more consistent pattern
      const groundHeight = 0;
      // Adjust groundY to align perfectly with bottom
      const groundY = canvas.height - groundHeight - 0; // Move ground up by 40 pixels
      
      // Draw darker base layer that extends to bottom
      ctx.fillStyle = '#1A0F0A';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      
      // Draw ground tiles with a more consistent pattern
      const tileWidth = 40;
      const tileCount = Math.ceil(canvas.width / tileWidth) + 1;
      
      // Draw two rows of tiles
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < tileCount; i++) {
          const x = i * tileWidth;
          const y = groundY + (row * groundHeight);
          
          // Draw main tile
        ctx.fillStyle = '#333'; 
          ctx.fillRect(x, y, tileWidth, groundHeight);
          
          // Add a subtle highlight to each tile
          if (row === 0) { // Only add highlight to top row
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(x, y, tileWidth, 2);
          }
        }
      }

      // Update enemy hurt animation
      if (gameState.enemyHurtFrames > 0) {
        gameState.enemyHurtFrames--;
        gameState.enemyHurtOffset = Math.sin(gameState.enemyHurtFrames * 0.5) * 5;
      } else {
        gameState.enemyHurtOffset = 0;
      }
      
      // Update player hurt animation
      if (gameState.playerHurtFrames > 0) {
        gameState.playerHurtFrames--;
        gameState.playerHurtOffset = Math.sin(gameState.playerHurtFrames * 0.5) * 5;
      } else {
        gameState.playerHurtOffset = 0;
      }
      
      // Update player hit particles
      for (let i = gameState.playerHitParticles.length - 1; i >= 0; i--) {
        const p = gameState.playerHitParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03; // Slower fade
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
        // Draw player with hurt animation
        ctx.drawImage(characterImg, 20 + gameState.playerHurtOffset, canvas.height - 319, 255, 300);
      }
      drawHealthBar(20, canvas.height - 180, 100, 10, gameState.playerHP, 'lime', 'YOU');

      // Draw player hit particles
      for (const p of gameState.playerHitParticles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        // Create a gradient for more dynamic particles
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

      // Update and draw floating damage numbers
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

      // Draw combo effect
      if (gameState.comboEffect.alpha > 0) {
        ctx.save();
        ctx.globalAlpha = gameState.comboEffect.alpha;
        ctx.font = 'bold 48px MedievalSharp';
        const comboText = `${gameState.comboEffect.value}x COMBO!`;
        const textWidth = ctx.measureText(comboText).width;
        
        // Position in center-top of screen
        const x = (canvas.width - textWidth) / 2;
        const y = 100;
        
        // Draw combo text with outline
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(comboText, x, y);
        
        // Create gradient for combo text
        const gradient = ctx.createLinearGradient(x, y - 40, x, y);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        ctx.fillStyle = gradient;
        ctx.fillText(comboText, x, y);
        
        // Update combo effect
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
          // Update combo effect
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
        // Reset combo effect
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
  }, [useHardWords, gamePaused, playerAcceptedChallenge]); // re-run effect if word list or pause state changes

  return (
    <div className="relative w-full h-full">
      {showLevelUpModal && (
        <DesertModal
          onAccept={() => {
            setUseHardWords(true);
            setPlayerAcceptedChallenge(true);
            setShowLevelUpModal(false);
            setGamePaused(false);
            // Actually increase the level and reset enemy HP, etc.
            const gameState = gameStateRef.current;
            gameState.level++;
            gameState.wordSpeedBase += 0.5;
            gameState.enemyHP = 100 + gameState.level * 5;
            onLevelChange(gameState.level);
          }}
          onDecline={() => {
            setShowLevelUpModal(false);
            setGamePaused(false);
            // Still increase the level, but keep showing modal next time
            const gameState = gameStateRef.current;
            gameState.level++;
            gameState.wordSpeedBase += 0.5;
            gameState.enemyHP = 100 + gameState.level * 5;
            onLevelChange(gameState.level);
          }}
        />
      )}
      {/* Menu Bar */}
      <div className="absolute top-4 right-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative w-10 h-10 rounded-lg border border-primary/50 bg-background/50 backdrop-blur-sm hover:bg-primary/20 transition-all duration-300">
              <Menu className="w-4 h-4 text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur animate-pulse"></div>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] bg-black/95 border-primary/50 backdrop-blur-xl p-0">
            <div className="h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_65%)] bg-[length:100%_100%] bg-center bg-no-repeat opacity-20 absolute inset-0"></div>
            <div className="relative h-full flex flex-col gap-8 p-6">
              {/* Player Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors duration-300">
                <Avatar className="w-16 h-16 border-2 border-primary/50 shadow-lg shadow-primary/20">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-primary/60 bg-clip-text text-transparent">
                    Player Name
                  </h2>
                  <p className="text-sm text-primary/60">High Score: {gameStateRef.current.score}</p>
                </div>
              </div>

              {/* Menu Options */}
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full h-12 bg-primary/5 border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 font-mono tracking-wider"
                  onClick={() => window.location.reload()}
                >
                  Restart Game
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 bg-primary/5 border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 font-mono tracking-wider"
                  onClick={onGameOver}
                >
                  Exit to Menu
                </Button>
              </div>

              {/* Stats Section */}
              <div className="mt-auto space-y-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h3 className="text-lg font-semibold text-primary/80">Current Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-black/20 border border-primary/10">
                    <p className="text-sm text-primary/60">Score</p>
                    <p className="text-xl font-bold text-primary">{gameStateRef.current.score}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/20 border border-primary/10">
                    <p className="text-sm text-primary/60">Level</p>
                    <p className="text-xl font-bold text-primary">{gameStateRef.current.level}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/20 border border-primary/10">
                    <p className="text-sm text-primary/60">Combo</p>
                    <p className="text-xl font-bold text-primary">{gameStateRef.current.combo}x</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/20 border border-primary/10">
                    <p className="text-sm text-primary/60">HP</p>
                    <p className="text-xl font-bold text-primary">{gameStateRef.current.playerHP}%</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};
