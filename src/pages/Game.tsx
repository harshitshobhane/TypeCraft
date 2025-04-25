import React, { useEffect, useRef, useState } from 'react';
import { GameUI } from '@/components/game/GameUI';
import { PowerUpInfo } from '@/components/game/PowerUpInfo';
import { ComboDisplay } from '@/components/game/ComboDisplay';
import { GameOver } from '@/components/game/GameOver';

const Game: React.FC = () => {
  // ---- React State for UI ----
  const [score, setScore]       = useState(0);
  const [level, setLevel]       = useState(1);
  const [wpm, setWpm]           = useState(0);
  const [combo, setCombo]       = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // ---- Persistent mutable refs ----
  const playerHP   = useRef(100);
  const enemyHP    = useRef(100);
  const wordsTyped = useRef(0);
  const levelRef   = useRef(1);

  // ---- Canvas Ref ----
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // ---- Load Assets ----
    const bgImage  = new Image(); bgImage.src   = '/background.png';
    const charImg  = new Image(); charImg.src   = '/character.png';
    const enemyImg = new Image(); enemyImg.src  = '/character2.png';
    const slashImg = new Image(); slashImg.src  = '/slash.png';

    // ---- Game State ----
    const wordList      = ['fire','ice','storm','rune','portal','spell','magic','dark','light','burn','time','zap','chaos','nova'];
    let activeWords: any[]   = [];
    let projectiles: any[]   = [];
    let currentWord: any     = null;
    let typedIndex          = 0;
    let wordSpeedBase       = 2;
    let bgOffset            = 0;
    let enemyFlashTimer     = 0;
    const startTime         = Date.now();
    let frameId: number;

    // ---- Classes ----
    class Word {
      constructor(
        public text: string,
        public x: number,
        public y: number,
        public speed: number,
        public isHealing = false
      ) {}
      draw() {
        ctx.fillStyle = this.isHealing ? 'yellow' : 'white';
        ctx.font = '26px monospace';
        ctx.fillText(this.text, this.x, this.y);
        if (currentWord === this) {
          ctx.fillStyle = this.isHealing ? '#ffff66' : 'cyan';
          ctx.shadowColor = this.isHealing ? '#ffff66' : 'cyan';
          ctx.shadowBlur = 10;
          ctx.fillText(this.text.substring(0, typedIndex), this.x, this.y);
          ctx.shadowBlur = 0;
        }
      }
      update() {
        this.x -= this.speed;
        if (this.x <= 80) {
          activeWords = activeWords.filter(w => w !== this);
          playerHP.current -= 10 + levelRef.current;
          setCombo(0);
          if (playerHP.current <= 0) endGame();
        }
      }
    }

    class Projectile {
      public hit = false;
      constructor(
        public x: number,
        public y: number,
        public img: HTMLImageElement,
        public w: number,
        public h: number,
        public damage: number
      ) {}
      update() {
        this.x += 25;
        if (!this.hit && this.x >= canvas.width - 80) {
          this.hit = true;
          enemyFlashTimer = 5;
          enemyHP.current -= this.damage;
          if (enemyHP.current <= 0) levelUp();
        }
      }
      draw() {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
      }
    }

    // ---- Helpers ----
    const spawnWord = () => {
      const text = wordList[Math.floor(Math.random() * wordList.length)];
      activeWords.push(new Word(
        text,
        canvas.width - 80,
        canvas.height - 120,
        wordSpeedBase + Math.random() * 0.5,
        Math.random() < 0.2
      ));
    };

    const drawHealthBar = (x: number, y: number, w: number, h: number, val: number, col: string, label: string) => {
      ctx.fillStyle = 'gray';
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = col;
      ctx.fillRect(x, y, Math.max(0, val), h);
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.fillText(label, x, y - 4);
    };

    const updateWPM = () => {
      const elapsed = (Date.now() - startTime) / 60000;
      setWpm(Math.round(wordsTyped.current / elapsed));
    };

    const levelUp = () => {
      setLevel(old => {
        const next = old + 1;
        levelRef.current = next;
        enemyHP.current = 100 + next * 5;
        return next;
      });
      wordSpeedBase += 0.5;
    };

    const endGame = () => {
      cancelAnimationFrame(frameId);
      clearInterval(spawnInterval);
      setGameOver(true);
    };

    // ---- Main Game Loop ----
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      if (bgImage.complete) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#0f0f2f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Ground tiles
      bgOffset = bgOffset - 4 <= -40 ? 0 : bgOffset - 4;
      for (let i = 0; i < canvas.width / 40 + 2; i++) {
        ctx.fillStyle = '#333';
        ctx.fillRect(bgOffset + i * 40, canvas.height - 0, 40, 40);
      }

      // Enemy
      if (enemyImg.complete) {
        if (enemyFlashTimer > 0) {
          ctx.globalAlpha = 0.7;
          enemyFlashTimer--;
        }
        ctx.drawImage(enemyImg, canvas.width - 250, canvas.height - 319, 265, 300);
        ctx.globalAlpha = 1;
      }
      

      // Player
      if (charImg.complete) {
        ctx.drawImage(charImg, 20, canvas.height - 319, 255, 300);
      }
      

      // Words & projectiles
      activeWords.forEach(w => { w.update(); w.draw(); });
      projectiles.forEach(p => { p.update(); p.draw(); });
      projectiles = projectiles.filter(p => !p.hit && p.x < canvas.width);

      // Update UI metrics
      updateWPM();

      frameId = requestAnimationFrame(gameLoop);
    };

    const spawnInterval = setInterval(spawnWord, 2000);
    gameLoop();

    // ---- Input & Resize ----
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      const key = e.key;
      if (!currentWord) {
        const next = activeWords.find(w => w.text[0] === key);
        if (next) {
          currentWord = next;
          typedIndex = 1;
        }
      } else if (currentWord.text[typedIndex] === key) {
        typedIndex++;
        if (typedIndex >= currentWord.text.length) {
          activeWords = activeWords.filter(w => w !== currentWord);
          setCombo(c => c + 1);
          wordsTyped.current++;
          setScore(s => s + 1 + combo);
          if (currentWord.isHealing) {
            playerHP.current = Math.min(100, playerHP.current + 20);
          } else {
            projectiles.push(new Projectile(
              80, canvas.height - 230,
              slashImg, 255, 160, 10 + levelRef.current
            ));
          }
          currentWord = null;
          typedIndex = 0;
        }
      } else {
        setCombo(0);
        currentWord = null;
        typedIndex = 0;
      }
    };
    window.addEventListener('keydown', handleKey);

    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // ---- Cleanup ----
    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(spawnInterval);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', onResize);
    };
  }, []); // run effect only once

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* 1. Full-screen environment art */}
      <img
        src="/background.png"
        alt="Battle background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 2. Transparent canvas on top */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 3. Overlaid UI panels */}
      <GameUI    score={score} level={level} wpm={wpm} />
      <PowerUpInfo />
      <ComboDisplay combo={combo} />

      {/* 4. Health bars at top corners */}
      <div className="absolute bottom-80 left-4 z-20 flex items-center space-x-2">
        <span className="text-white font-bold drop-shadow">YOU</span>
        <div className="h-4 w-48 bg-black bg-opacity-50 rounded overflow-hidden">
          <div
            className="h-full bg-green-400 transition-all"
            style={{ width: `${(playerHP.current)}%` }}
          />
        </div>
      </div>

      <div className="absolute bottom-80 right-4 z-20 flex items-center space-x-2">
        <div className="h-4 w-48 bg-black bg-opacity-50 rounded overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all"
            style={{ width: `${(enemyHP.current)}%` }}
          />
        </div>
        <span className="text-white font-bold drop-shadow">ENEMY</span>
      </div>

      {/* 5. Centered level indicator */}
      <div className="absolute inset-x-0 top-4 text-center text-2xl font-bold text-yellow-300 drop-shadow">
        LEVEL {level}
      </div>

      {/* 7. Game over overlay */}
      {gameOver && <GameOver onRestart={() => window.location.reload()} />}
    </div>
  );
};
export default Game;
