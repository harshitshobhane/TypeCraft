import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CyberParticles } from '@/components/CyberParticles';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Zap, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TimeAttackProps {
  onScoreChange: (score: number) => void;
  onWpmChange: (wpm: number) => void;
  onGameOver: () => void;
}

export const TimeAttackMode = ({ onScoreChange, onWpmChange, onGameOver }: TimeAttackProps) => {
  const [currentSentence, setCurrentSentence] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [sentenceHistory, setSentenceHistory] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const { toast } = useToast();

  // Track Tab key state
  const [isTabPressed, setIsTabPressed] = useState(false);

  const sentences = [
    "The ancient scrolls reveal forgotten magic spells.",
    "Dragons soar through stormy skies with grace.",
    "Mystic runes glow with ethereal power.",
    "Warriors train in the sacred temple grounds.",
    "Enchanted swords clash in epic battles.",
    "Dark forces gather in the shadow realm.",
    "Heroes emerge from the trials of destiny.",
    "Magic crystals pulse with arcane energy.",
    "Legends speak of powerful ancient artifacts.",
    "Battle cries echo across the mystical plains.",
    "Wizards study in towers of ivory and gold.",
    "Knights defend the realm with honor and steel.",
    "Prophecies foretell of great adventures ahead.",
    "Magical beasts roam the enchanted forests.",
    "Ancient wisdom guides the path of heroes."
  ];

  const getNewSentence = useCallback(() => {
    let newSentence;
    do {
      newSentence = sentences[Math.floor(Math.random() * sentences.length)];
    } while (newSentence === currentSentence && sentences.length > 1);
    
    setCurrentSentence(newSentence);
    setSentenceHistory(prev => [...prev, newSentence]);
    setUserInput("");
    setIsCorrect(false);
    
    if (!startTime) setStartTime(Date.now());
  }, [sentences, currentSentence, startTime]);

  // Function to start the game with selected time
  const startGame = (duration: number) => {
    setSelectedTime(duration);
    setTimeLeft(duration);
    setGameStarted(true);
    setStartTime(Date.now());
    getNewSentence();
  };

  useEffect(() => {
    if (startTime && timeLeft > 0 && gameStarted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onGameOver();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTime, timeLeft, onGameOver, gameStarted]);

  // Handle key down events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault(); // Prevent tab from changing focus
        setIsTabPressed(true);
      } else if (e.key === 'Enter' && isTabPressed && gameStarted) {
        e.preventDefault();
        window.location.reload(); // Restart the game
      }
    };

    // Handle key up events
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsTabPressed(false);
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isTabPressed, gameStarted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (currentSentence.startsWith(input)) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setTimeLeft(prev => Math.max(0, prev - 1)); // Penalty for mistakes
    }

    if (input === currentSentence) {
      setTotalCharacters(prev => prev + currentSentence.length);
      
      // Calculate score - simplified without combo
      const baseScore = currentSentence.length * 10;
      
      setScore(prev => prev + baseScore);
      onScoreChange(score + baseScore);
      
      const elapsedMinutes = (Date.now() - (startTime || Date.now())) / 60000;
      const wpm = Math.round(totalCharacters / 5 / elapsedMinutes);
      onWpmChange(wpm);
      
      // Visual feedback
      setIsCorrect(true);
      
      // Show score toast - simplified without combo
      toast({
        title: "Perfect!",
        description: `+${baseScore} points!`,
        duration: 1500,
        className: "bg-gradient-to-r from-primary/20 to-secondary/20 border-primary"
      });

      // Add time bonus for completion
      setTimeLeft(prev => Math.min(selectedTime || 60, prev + 2)); // +2 seconds per completion

      setTimeout(() => {
        getNewSentence();
      }, 300);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (userInput.length / currentSentence.length) * 100;
  
  // Time-based classes
  const getTimeClass = () => {
    if (timeLeft > 40) return "text-green-400";
    if (timeLeft > 20) return "text-yellow-400";
    return "text-red-400 animate-pulse";
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-background">
      {/* Add keyboard shortcut hint */}
      {gameStarted && (
        <div className="absolute top-4 left-4 text-sm text-primary/60 bg-black/40 px-3 py-1 rounded-md border border-primary/20">
          Press Tab + Enter to restart
        </div>
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
                  <p className="text-sm text-primary/60">High Score: {score}</p>
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
                    <p className="text-xl font-bold text-primary">{score}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/20 border border-primary/10">
                    <p className="text-sm text-primary/60">Time Left</p>
                    <p className="text-xl font-bold text-primary">{timeLeft}s</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-gradient opacity-80"></div>
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-20"></div>
      
      {/* Animated particles */}
      <CyberParticles />

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8 z-10"
        >
          <h2 className="text-4xl font-bold text-primary mb-8">Select Time Duration</h2>
          <div className="grid grid-cols-2 gap-4">
            {[15, 30, 60, 120].map((duration) => (
              <motion.button
                key={duration}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame(duration)}
                className="px-8 py-6 bg-primary/10 border-2 border-primary/30 rounded-xl hover:bg-primary/20 transition-all duration-300"
              >
                <div className="text-3xl font-bold text-primary mb-2">{duration}</div>
                <div className="text-sm text-primary/70">seconds</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : (
        <>
          {/* Timer with visual enhancements */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative mb-14"
          >
            <div className="absolute -inset-6 bg-primary/20 rounded-full blur-xl animate-pulse-glow"></div>
            <div className={`relative z-10 text-7xl font-bold orbitron bg-gradient-to-b from-white to-primary/60 bg-clip-text text-transparent ${getTimeClass()}`}>
              {timeLeft}
              <span className="text-2xl ml-1 font-light">s</span>
            </div>
          </motion.div>
          
          <div className="max-w-3xl w-full space-y-8 relative z-10">
            {/* Current Sentence with enhanced design */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSentence}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 12 }}
                className="glass-effect p-8 rounded-xl border border-primary/30 shadow-lg relative overflow-hidden"
              >
                {/* Animated background gradient */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
                  animate={{ 
                    backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] 
                  }}
                  transition={{ 
                    duration: 10, 
                    ease: "linear", 
                    repeat: Infinity 
                  }}
                ></motion.div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-2xl font-medium flex flex-wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentSentence.split('').map((char, i) => {
                      const isTyped = i < userInput.length;
                      const isCorrect = userInput[i] === char;
                      return (
                        <motion.span
                          key={i}
                          className={`${
                            isTyped 
                              ? isCorrect 
                                ? 'text-primary' 
                                : 'text-destructive'
                              : 'text-foreground/90'
                          } ${isTyped && isCorrect ? 'text-glow' : ''}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.01 }}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      );
                    })}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Input Field with enhanced design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-primary/10 rounded-xl blur-lg"></div>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full glass-effect text-xl p-6 rounded-xl border border-primary/50 focus:border-primary/80 focus:outline-none transition-all shadow-[0_0_15px_rgba(var(--primary),0.2)] backdrop-blur-xl placeholder:text-white/30 relative z-10 typing-cursor"
                placeholder="Type the sentence here..."
                autoFocus
              />
              
              {/* Progress bar with animation */}
              <div className="mt-4 relative z-10">
                <Progress 
                  value={progressPercentage} 
                  className="h-2 bg-primary/20" 
                />
                
                {/* Animated indicator on progress bar */}
                {progressPercentage > 5 && (
                  <motion.div 
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${progressPercentage}%` }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-primary -ml-2" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 right-8 flex items-center gap-2 bg-black/60 p-3 rounded-xl border border-primary/40"
          >
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xl font-orbitron text-primary">Score:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={score}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-xl font-orbitron text-white"
              >
                {score}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
};
