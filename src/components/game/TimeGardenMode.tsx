import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Star, Award, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useGameSound } from '@/hooks/use-game-sound';
import { useNavigate } from 'react-router-dom';
import { CyberBackButton } from '@/components/ui/CyberBackButton';
import { GrowingVine } from './GrowingVine';
import { AmbientParticles } from './AmbientParticles';

interface LevelUpModalProps {
  era: 'ancient' | 'medieval' | 'future';
  prevEra: 'ancient' | 'medieval' | 'future';
  scoreBonus: number;
  multiplierIncrease: number;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ 
  era, 
  prevEra,
  scoreBonus, 
  multiplierIncrease,
  onClose 
}) => {
  const [particlesCount, setParticlesCount] = useState(30);
  const { playCombo } = useGameSound();
  
  useEffect(() => {
    playCombo();
    
    setTimeout(() => {
      setParticlesCount(60);
    }, 300);
    
    const timer = setTimeout(() => {
      onClose();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, []);

  const eraThemes = {
    ancient: {
      primary: 'from-emerald-700 to-green-500',
      secondary: 'emerald-300',
      accent: 'from-green-400 to-emerald-600',
      particle: 'bg-green-500',
      icon: <Leaf className="w-12 h-12 text-emerald-300" />,
      title: "Ancient Era Mastered!",
      message: "Your garden's roots grow deeper, reaching into the wisdom of the ancient world."
    },
    medieval: {
      primary: 'from-purple-800 to-fuchsia-600',
      secondary: 'fuchsia-300',
      accent: 'from-purple-400 to-fuchsia-600',
      particle: 'bg-purple-500',
      icon: <Star className="w-12 h-12 text-fuchsia-300" />,
      title: "Medieval Age Achieved!",
      message: "Your garden blossoms with enchantment, embracing the mystical medieval era."
    },
    future: {
      primary: 'from-blue-800 to-cyan-600',
      secondary: 'cyan-300',
      accent: 'from-blue-400 to-cyan-500',
      particle: 'bg-blue-500',
      icon: <Trophy className="w-12 h-12 text-cyan-300" />,
      title: "Future Age Unlocked!",
      message: "Your garden transcends time, flowering with the brilliance of cosmic technology."
    }
  };

  const currentTheme = eraThemes[era];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      >
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: particlesCount }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${currentTheme.particle} opacity-60`}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight,
                scale: 0,
                opacity: 0.8
              }}
              animate={{ 
                y: -100 - Math.random() * window.innerHeight,
                scale: 0.5 + Math.random() * 2,
                opacity: 0,
                transition: { 
                  duration: 3 + Math.random() * 5,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }
              }}
              style={{
                width: 5 + Math.random() * 15 + "px",
                height: 5 + Math.random() * 15 + "px",
              }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
        className="relative z-10 max-w-lg w-full mx-4 rounded-2xl overflow-hidden"
      >
        <div className="absolute -inset-1">
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${currentTheme.accent} opacity-75 blur-lg animate-pulse-slow`}></div>
        </div>

        <div className={`relative rounded-2xl border border-${currentTheme.secondary}/30 bg-gradient-to-b ${currentTheme.primary} p-8 overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-30"></div>
          
          <motion.div 
            className="mx-auto w-24 h-24 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center mb-6"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, 0],
                transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
              }}
            >
              {currentTheme.icon}
            </motion.div>
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-center text-white orbitron mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ textShadow: "0 0 15px rgba(255, 255, 255, 0.5)" }}
          >
            {currentTheme.title}
          </motion.h2>
          
          <motion.p 
            className="text-white/90 text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {currentTheme.message}
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-2 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Score Bonus</p>
              <p className="text-2xl font-bold text-amber-300">+{scoreBonus}</p>
            </div>
            <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">Multiplier</p>
              <p className="text-2xl font-bold text-amber-300">+{multiplierIncrease.toFixed(1)}x</p>
            </div>
          </motion.div>
          
          <motion.button
            className={`w-full py-4 px-8 rounded-lg bg-gradient-to-r from-${currentTheme.secondary}/80 to-${currentTheme.secondary} text-black font-bold tracking-wider uppercase text-sm hover:shadow-lg hover:from-${currentTheme.secondary} hover:to-white transition-all duration-300`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            onClick={onClose}
          >
            Continue Your Journey
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

interface TimeGardenModeProps {
  onScoreChange: (score: number) => void;
  onWpmChange: (wpm: number) => void;
  onGameOver: () => void;
}

export const TimeGardenMode: React.FC<TimeGardenModeProps> = ({
  onScoreChange,
  onWpmChange,
  onGameOver
}) => {
  const [currentWord, setCurrentWord] = useState('');
  const [typedWord, setTypedWord] = useState('');
  const [gardenEnergy, setGardenEnergy] = useState(0);
  const [plants, setPlants] = useState<any[]>([]);
  const [era, setEra] = useState<'ancient' | 'medieval' | 'future'>('ancient');
  const [wordsTyped, setWordsTyped] = useState(0);
  const [wordsCorrect, setWordsCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [typingPulse, setTypingPulse] = useState(false);
  const [fadeAnimation, setFadeAnimation] = useState(false);
  const startTime = useRef(Date.now());
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [vines, setVines] = useState<Array<{ id: number; x: number; y: number; length: number; thickness: number; delay: number }>>([]);
  const [score, setScore] = useState(0);
  const [scoreMultiplier, setScoreMultiplier] = useState(1);
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [lastScoreIncrease, setLastScoreIncrease] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [prevEra, setPrevEra] = useState<'ancient' | 'medieval' | 'future'>('ancient');
  const [levelUpBonus, setLevelUpBonus] = useState(0);
  const [multiplierIncrease, setMultiplierIncrease] = useState(0);
  
  const wordLists = {
    ancient: ['nature', 'root', 'seed', 'grow', 'river', 'rock', 'tree', 'leaf', 'soil', 'flora'],
    medieval: ['garden', 'bloom', 'flower', 'sunlight', 'water', 'plant', 'harvest', 'breeze', 'rose', 'vine'],
    future: ['quantum', 'blossom', 'nebula', 'stellar', 'cosmic', 'aurora', 'prism', 'energy', 'photon', 'flux']
  };

  const eraMessages = {
    ancient: [
      "In the beginning, there was only seed and soil.",
      "Your words give life to ancient growth.",
      "The first gardens speak through your fingertips."
    ],
    medieval: [
      "Your garden flourishes through the ages.",
      "In every keystroke, life grows.",
      "The rhythm of words nurtures beauty."
    ],
    future: [
      "Your words shape worlds across time.",
      "Cosmic gardens bloom beyond the stars.",
      "Type the future into existence."
    ]
  };

  const eraBgColors = {
    ancient: 'from-[#0A1F15] to-[#0A2A18]',
    medieval: 'from-[#150C29] to-[#251643]',
    future: 'from-[#040E26] to-[#051838]'
  };

  const getRandomWord = () => {
    const words = wordLists[era];
    return words[Math.floor(Math.random() * words.length)];
  };

  const addVine = () => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = Math.random() * rect.width * 0.8 + rect.width * 0.1;
    
    const newVine = {
      id: Date.now() + Math.random(),
      x: x,
      y: rect.height,
      length: 250 + Math.random() * 150,
      thickness: 2 + Math.random() * 3,
      delay: Math.random() * 0.5
    };

    setVines(prev => [...prev.slice(-12), newVine]);
  };

  const updateWPM = () => {
    const elapsed = (Date.now() - startTime.current) / 60000;
    const wpm = Math.round(wordsTyped / Math.max(0.1, elapsed));
    onWpmChange(wpm);
  };

  const displayMessage = () => {
    const messages = eraMessages[era];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const updateScore = (points: number) => {
    const bonusPoints = points * scoreMultiplier;
    const newScore = score + bonusPoints;
    setScore(newScore);
    setLastScoreIncrease(bonusPoints);
    setScoreAnimation(true);
    setTimeout(() => setScoreAnimation(false), 1000);
    onScoreChange(newScore);
  };

  const changeEra = () => {
    setIsTransitioning(true);
    
    setVines([]);
    
    setPrevEra(era);

    const bonus = 500;
    const multiplierBoost = 0.5;
    setLevelUpBonus(bonus);
    setMultiplierIncrease(multiplierBoost);
    
    let nextEra: 'ancient' | 'medieval' | 'future' = 'medieval';
    
    if (era === 'ancient') {
      nextEra = 'medieval';
    } else if (era === 'medieval') {
      nextEra = 'future';
    } else {
      nextEra = 'ancient';
    }
    
    setEra(nextEra);
    setScoreMultiplier(prev => prev + multiplierBoost);
    
    setShowLevelUpModal(true);
    
    setTimeout(() => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const newVines = Array.from({ length: 5 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * rect.width,
          y: rect.height,
          length: 250 + Math.random() * 150,
          thickness: 1 + Math.random() * 2,
          delay: Math.random() * 0.5 + i * 0.2
        }));
        setVines(newVines);
      }
    }, 1000);
    
    setFadeAnimation(true);
    setTimeout(() => setFadeAnimation(false), 1000);
    
    updateScore(bonus);
  };

  const handleCloseLevelUpModal = () => {
    setShowLevelUpModal(false);
    setIsTransitioning(false);
    displayMessage();
  };

  useEffect(() => {
    setCurrentWord(getRandomWord());
    startTime.current = Date.now();
    
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        addVine();
      }
    }, 500);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        setGameStarted(true);
      }
      
      const key = e.key;
      
      if (key === 'Escape') {
        onGameOver();
        return;
      }
      
      if (key === 'Backspace') {
        setTypedWord(prev => prev.slice(0, -1));
        return;
      }
      
      if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
        setTypedWord(prev => prev + key);
        
        setTypingPulse(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const { 
    playCorrect, 
    playWrong, 
    playCombo, 
    playGameOver, 
    startBgMusic, 
    stopBgMusic 
  } = useGameSound();

  useEffect(() => {
    startBgMusic();
    return () => stopBgMusic();
  }, []);

  const handleBackToMenu = () => {
    navigate('/mode-select');
  };

  const handleGameOver = () => {
    playGameOver();
    onGameOver();
  };

  useEffect(() => {
    if (typedWord.toLowerCase() === currentWord.toLowerCase()) {
      playCorrect();
      
      setWordsTyped(prev => prev + 1);
      setWordsCorrect(prev => prev + 1);
      setCombo(prev => prev + 1);
      setGardenEnergy(prev => Math.min(100, prev + 5 + (combo * 0.5)));
      
      const basePoints = currentWord.length * 10;
      const comboBonus = combo > 1 ? combo * 5 : 0;
      updateScore(basePoints + comboBonus);
      
      addVine();
      
      if (combo > 5) {
        addVine();
        playCombo();
      }
      
      if (Math.random() < 0.2) {
        displayMessage();
      }
      
      if (gardenEnergy >= 100) {
        setGardenEnergy(0);
        changeEra();
      }
      
      setTypedWord('');
      setCurrentWord(getRandomWord());
    } else if (typedWord && !currentWord.toLowerCase().startsWith(typedWord.toLowerCase())) {
      playWrong();
      setCombo(0);
      setScoreMultiplier(Math.max(1, scoreMultiplier - 0.1));
    }
  }, [typedWord]);

  useEffect(() => {
    const interval = setInterval(updateWPM, 2000);
    return () => clearInterval(interval);
  }, [wordsTyped]);

  const renderProgressBar = () => (
    <motion.div 
      className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-96 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative h-3 overflow-hidden rounded-full shadow-inner bg-black/30 backdrop-blur-md border border-primary/20">
        <motion.div 
          className="absolute h-full rounded-full"
          style={{
            width: `${gardenEnergy}%`,
            background: `linear-gradient(90deg, 
              ${era === 'ancient' ? 'rgba(126, 213, 111, 0.3)' : 
                era === 'medieval' ? 'rgba(180, 90, 211, 0.3)' : 
                'rgba(56, 182, 255, 0.3)'} 0%, 
              ${era === 'ancient' ? 'rgba(126, 213, 111, 0.8)' : 
                era === 'medieval' ? 'rgba(180, 90, 211, 0.8)' : 
                'rgba(56, 182, 255, 0.8)'} 100%)`
          }}
          animate={{
            boxShadow: [
              `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.5)' : 
                era === 'medieval' ? 'rgba(180, 90, 211, 0.5)' : 
                'rgba(56, 182, 255, 0.5)'}`,
              `0 0 15px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.8)' : 
                era === 'medieval' ? 'rgba(180, 90, 211, 0.8)' : 
                'rgba(56, 182, 255, 0.8)'}`,
              `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.5)' : 
                era === 'medieval' ? 'rgba(180, 90, 211, 0.5)' : 
                'rgba(56, 182, 255, 0.5)'}`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute h-full w-full"
          style={{
            backgroundImage: `linear-gradient(90deg, 
              transparent 0%, 
              ${era === 'ancient' ? 'rgba(255, 255, 255, 0.2)' : 
                era === 'medieval' ? 'rgba(255, 255, 255, 0.2)' : 
                'rgba(255, 255, 255, 0.3)'} 50%, 
              transparent 100%)`,
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%']
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="mt-2 text-center font-light text-sm tracking-wider">
        <span className="text-primary/80 drop-shadow-md">Garden Energy: </span>
        <span className="text-white/90">{Math.round(gardenEnergy)}%</span>
      </div>
    </motion.div>
  );

  const renderCurrentWord = () => {
    const letters = currentWord.split('');
    
    return (
      <div className="flex justify-center mb-4">
        {letters.map((letter, i) => {
          let textColor = "text-gray-400";
          
          if (i < typedWord.length) {
            if (typedWord[i].toLowerCase() === letter.toLowerCase()) {
              textColor = era === 'ancient' ? "text-green-400" : 
                         era === 'medieval' ? "text-fuchsia-400" : 
                         "text-blue-400";
            } else {
              textColor = "text-red-400";
            }
          }
          
          return (
            <motion.span 
              key={i} 
              className={`text-4xl font-medium tracking-wider transition-all ${textColor}`}
              style={{ 
                fontFamily: "'Orbitron', sans-serif",
                textShadow: i < typedWord.length && typedWord[i].toLowerCase() === letter.toLowerCase() ? 
                  `0 0 10px ${
                    era === 'ancient' ? 'rgba(126, 213, 111, 0.8)' : 
                    era === 'medieval' ? 'rgba(180, 90, 211, 0.8)' : 
                    'rgba(56, 182, 255, 0.8)'
                  }` : 'none'
              }}
              initial={i >= typedWord.length ? { y: 0 } : {}}
              animate={
                i < typedWord.length && typedWord[i].toLowerCase() === letter.toLowerCase() ? 
                { 
                  y: [0, -5, 0],
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.3 } 
                } : {}
              }
            >
              {letter}
            </motion.span>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className={`relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b ${eraBgColors[era]} transition-colors duration-1000 overflow-hidden`}
      ref={gameAreaRef}
    >
      <div className="absolute inset-0 z-0">
        <AmbientParticles count={60} era={era} />
      </div>
      
      <div className="absolute inset-0 z-10">
        <AnimatePresence>
          {vines.map(vine => (
            <GrowingVine
              key={vine.id}
              startPosition={{ x: vine.x, y: vine.y }}
              era={era}
              thickness={vine.thickness}
              length={vine.length}
              delay={vine.delay}
              progress={gardenEnergy}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        className="absolute top-4 left-4 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-xl blur-lg transition-all duration-500 group-hover:blur-xl group-hover:opacity-70" />
          <CyberBackButton onClick={handleBackToMenu} label="Mode Select" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-xl blur-xl opacity-50 transition-all duration-500 group-hover:opacity-75 group-hover:blur-2xl" />
          <div className="relative bg-black/40 backdrop-blur-md rounded-xl p-4 border border-primary/30 shadow-lg">
            <div className="text-center">
              <motion.h3 
                className="text-primary font-light tracking-widest text-xl mb-1 orbitron"
                animate={{
                  textShadow: [
                    "0 0 4px rgba(var(--primary), 0.3)",
                    "0 0 8px rgba(var(--primary), 0.6)",
                    "0 0 4px rgba(var(--primary), 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Score
              </motion.h3>
              <motion.div 
                className="text-3xl font-bold text-amber-400 orbitron"
                style={{ textShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}
                animate={scoreAnimation ? { 
                  scale: [1, 1.2, 1],
                  filter: [
                    "drop-shadow(0 0 5px rgba(245, 158, 11, 0.5))",
                    "drop-shadow(0 0 15px rgba(245, 158, 11, 0.7))",
                    "drop-shadow(0 0 5px rgba(245, 158, 11, 0.5))"
                  ],
                  transition: { duration: 0.5 }
                } : {}}
              >
                {score}
              </motion.div>
              
              {lastScoreIncrease > 0 && scoreAnimation && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -20 }}
                  exit={{ opacity: 0 }}
                  className="text-green-400 text-sm font-medium"
                  style={{ textShadow: "0 0 5px rgba(74, 222, 128, 0.5)" }}
                >
                  +{lastScoreIncrease}
                </motion.div>
              )}
              
              <div className="text-sm text-white/70 mt-1 tracking-wide">
                Multiplier: <span className="text-primary/90">x{scoreMultiplier.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-20">
        <motion.div 
          className="relative z-20 bg-black/40 backdrop-blur-md rounded-xl p-8 border border-primary/30 shadow-xl max-w-xl w-full"
          animate={{ 
            y: [0, -5, 0], 
            boxShadow: [
              `0 10px 30px -5px rgba(0, 0, 0, 0.3)`, 
              `0 20px 40px -5px rgba(0, 0, 0, 0.4)`, 
              `0 10px 30px -5px rgba(0, 0, 0, 0.3)`
            ]
          }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          {gameStarted ? (
            <>
              <div className="text-center mb-8">
                <motion.h3 
                  className="text-3xl text-primary mb-2 tracking-wider"
                  style={{ 
                    fontFamily: "'Orbitron', sans-serif",
                    textShadow: `0 0 10px ${
                      era === 'ancient' ? 'rgba(126, 213, 111, 0.5)' : 
                      era === 'medieval' ? 'rgba(180, 90, 211, 0.5)' : 
                      'rgba(56, 182, 255, 0.5)'
                    }`
                  }}
                  animate={{
                    textShadow: [
                      `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.3)' : 
                        era === 'medieval' ? 'rgba(180, 90, 211, 0.3)' : 
                        'rgba(56, 182, 255, 0.3)'}`,
                      `0 0 15px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.6)' : 
                        era === 'medieval' ? 'rgba(180, 90, 211, 0.6)' : 
                        'rgba(56, 182, 255, 0.6)'}`,
                      `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.3)' : 
                        era === 'medieval' ? 'rgba(180, 90, 211, 0.3)' : 
                        'rgba(56, 182, 255, 0.3)'}`
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  Time Garden
                </motion.h3>
                <p className="text-white/80 italic tracking-wide font-light">Type the word to grow your garden...</p>
              </div>
              
              {renderCurrentWord()}
              
              <div className="mt-6 h-14 flex justify-center items-center">
                <div className="relative w-full max-w-xs">
                  <motion.div 
                    className="h-14 w-full bg-black/30 rounded-md border border-primary/30"
                    animate={{
                      boxShadow: [
                        `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.2)' : 
                          era === 'medieval' ? 'rgba(180, 90, 211, 0.2)' : 
                          'rgba(56, 182, 255, 0.2)'}`,
                        `0 0 15px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.3)' : 
                          era === 'medieval' ? 'rgba(180, 90, 211, 0.3)' : 
                          'rgba(56, 182, 255, 0.3)'}`,
                        `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.2)' : 
                          era === 'medieval' ? 'rgba(180, 90, 211, 0.2)' : 
                          'rgba(56, 182, 255, 0.2)'}`
                      ]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="text-lg typing-cursor"
                      style={{ 
                        fontFamily: "'Orbitron', sans-serif",
                        color: era === 'ancient' ? 'rgb(126, 213, 111)' : 
                                era === 'medieval' ? 'rgb(180, 90, 211)' : 
                                'rgb(56, 182, 255)'
                      }}
                      animate={{ 
                        textShadow: typedWord.length > 0 ? [
                          `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.5)' : 
                            era === 'medieval' ? 'rgba(180, 90, 211, 0.5)' : 
                            'rgba(56, 182, 255, 0.5)'}`,
                          `0 0 10px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.8)' : 
                            era === 'medieval' ? 'rgba(180, 90, 211, 0.8)' : 
                            'rgba(56, 182, 255, 0.8)'}`,
                          `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.5)' : 
                            era === 'medieval' ? 'rgba(180, 90, 211, 0.5)' : 
                            'rgba(56, 182, 255, 0.5)'}`
                        ] : 'none'
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      {typedWord}
                    </motion.div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <motion.div 
              className="text-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.h3 
                className="text-3xl text-primary mb-4 tracking-wider"
                style={{ 
                  fontFamily: "'Orbitron', sans-serif",
                  textShadow: `0 0 10px ${
                    era === 'ancient' ? 'rgba(126, 213, 111, 0.5)' : 
                    era === 'medieval' ? 'rgba(180, 90, 211, 0.5)' : 
                    'rgba(56, 182, 255, 0.5)'
                  }`
                }}
                animate={{
                  textShadow: [
                    `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.3)' : 
                      era === 'medieval' ? 'rgba(180, 90, 211, 0.3)' : 
                      'rgba(56, 182, 255, 0.3)'}`,
                    `0 0 15px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.6)' : 
                      era === 'medieval' ? 'rgba(180, 90, 211, 0.6)' : 
                      'rgba(56, 182, 255, 0.6)'}`,
                    `0 0 5px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.3)' : 
                      era === 'medieval' ? 'rgba(180, 90, 211, 0.3)' : 
                      'rgba(56, 182, 255, 0.3)'}`
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Welcome to Time Garden
              </motion.h3>
              <p className="text-white/80 mb-8 tracking-wide font-light">Press any key to begin your journey through time...</p>
              <motion.div 
                className="text-amber-400 text-sm italic tracking-wide"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ textShadow: "0 0 5px rgba(245, 158, 11, 0.5)" }}
              >
                Type to grow plants across time
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {gameStarted && renderProgressBar()}
      
      <AnimatePresence>
        {showMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-24 left-0 right-0 text-center z-30"
          >
            <motion.div 
              className="inline-block bg-black/60 backdrop-blur-md px-8 py-4 rounded-full border border-primary/30"
              animate={{
                boxShadow: [
                  `0 0 10px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.2)' : 
                    era === 'medieval' ? 'rgba(180, 90, 211, 0.2)' : 
                    'rgba(56, 182, 255, 0.2)'}`,
                  `0 0 20px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.3)' : 
                    era === 'medieval' ? 'rgba(180, 90, 211, 0.3)' : 
                    'rgba(56, 182, 255, 0.3)'}`,
                  `0 0 10px ${era === 'ancient' ? 'rgba(126, 213, 111, 0.2)' : 
                    era === 'medieval' ? 'rgba(180, 90, 211, 0.2)' : 
                    'rgba(56, 182, 255, 0.2)'}`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p 
                className="text-lg text-white/90 tracking-wide font-light italic"
                style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {message}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="absolute bottom-6 text-center text-sm text-white/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
      >
        <p className="tracking-wide">Press ESC to exit Zen Mode</p>
      </motion.div>

      <AnimatePresence>
        {showLevelUpModal && (
          <LevelUpModal 
            era={era} 
            prevEra={prevEra}
            scoreBonus={levelUpBonus}
            multiplierIncrease={multiplierIncrease}
            onClose={handleCloseLevelUpModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
