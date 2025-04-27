import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useGameSound } from '@/hooks/use-game-sound';
import { useNavigate } from 'react-router-dom';
import { CyberBackButton } from '@/components/ui/CyberBackButton';
import { GrowingVine } from './GrowingVine';
import { AmbientParticles } from './AmbientParticles';

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
  // Game state
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
  
  // Word lists for different eras
  const wordLists = {
    ancient: ['nature', 'root', 'seed', 'grow', 'river', 'rock', 'tree', 'leaf', 'soil', 'flora'],
    medieval: ['garden', 'bloom', 'flower', 'sunlight', 'water', 'plant', 'harvest', 'breeze', 'rose', 'vine'],
    future: ['quantum', 'blossom', 'nebula', 'stellar', 'cosmic', 'aurora', 'prism', 'energy', 'photon', 'flux']
  };

  // Messages for different eras
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

  // Background colors for different eras
  const eraBgColors = {
    ancient: 'from-[#0A1F15] to-[#0A2A18]',
    medieval: 'from-[#150C29] to-[#251643]',
    future: 'from-[#040E26] to-[#051838]'
  };

  // Functions
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
    
    if (era === 'ancient') {
      setEra('medieval');
      setScoreMultiplier(prev => prev + 0.5);
      toast({
        title: "Time Shifted",
        description: "Your garden evolves into the Medieval Age",
        duration: 3000
      });
    } else if (era === 'medieval') {
      setEra('future');
      setScoreMultiplier(prev => prev + 0.5);
      toast({
        title: "Time Shifted",
        description: "Your garden reaches the Cosmic Future",
        duration: 3000
      });
    } else {
      setEra('ancient');
      setScoreMultiplier(prev => prev + 0.5);
      toast({
        title: "Time Cycle Complete",
        description: "Your garden returns to its origins",
        duration: 3000
      });
    }
    
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
    
    setTimeout(() => {
      setIsTransitioning(false);
      displayMessage();
    }, 1500);
    
    setFadeAnimation(true);
    setTimeout(() => setFadeAnimation(false), 1000);
    
    updateScore(500);
  };

  // Initialize the game
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
      {/* Ambient Particles Background */}
      <div className="absolute inset-0 z-0">
        <AmbientParticles count={60} era={era} />
      </div>
      
      {/* Growing Vines Layer */}
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

      {/* Enhanced Back Button */}
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

      {/* Enhanced Score Display */}
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

      {/* Main Game UI */}
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
      
      {/* Progress Bar */}
      {gameStarted && renderProgressBar()}
      
      {/* Floating Messages */}
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
      
      {/* Footer Text */}
      <motion.div 
        className="absolute bottom-6 text-center text-sm text-white/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
      >
        <p className="tracking-wide">Press ESC to exit Zen Mode</p>
      </motion.div>
    </div>
  );
};
