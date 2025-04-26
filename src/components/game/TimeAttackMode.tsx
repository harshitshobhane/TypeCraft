
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CyberParticles } from '@/components/CyberParticles';
import { GameModel3D } from '@/components/GameModel3D';
import { Progress } from '@/components/ui/progress';
import { Hourglass, Sparkles, Zap } from 'lucide-react';

interface TimeAttackProps {
  onScoreChange: (score: number) => void;
  onWpmChange: (wpm: number) => void;
  onGameOver: () => void;
}

export const TimeAttackMode = ({ onScoreChange, onWpmChange, onGameOver }: TimeAttackProps) => {
  const [currentSentence, setCurrentSentence] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [sentenceHistory, setSentenceHistory] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "Actions speak louder than words.",
    "A journey of a thousand miles begins with a single step."
  ];

  const getNewSentence = useCallback(() => {
    // Get a random sentence that's different from the current one
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

  useEffect(() => {
    getNewSentence();
  }, []);

  useEffect(() => {
    if (startTime && timeLeft > 0) {
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
  }, [startTime, timeLeft, onGameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    // Check for partial match for highlighting
    if (currentSentence.startsWith(input)) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    if (input === currentSentence) {
      setTotalCharacters(prev => prev + currentSentence.length);
      
      // Calculate score
      const scoreToAdd = currentSentence.length * 10;
      setScore(prev => prev + scoreToAdd);
      onScoreChange(score + scoreToAdd);
      
      const elapsedMinutes = (Date.now() - (startTime || Date.now())) / 60000;
      const wpm = Math.round(totalCharacters / 5 / elapsedMinutes);
      onWpmChange(wpm);
      
      // Visual feedback
      setIsCorrect(true);
      
      // Show toast with animation
      toast({
        title: "Perfect!",
        description: `+${scoreToAdd} points!`,
        duration: 1000,
        className: "bg-gradient-to-r from-primary/20 to-secondary/20 border-primary"
      });

      // Add small delay before next sentence for visual feedback
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
      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-gradient opacity-80"></div>
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-20"></div>
      
      {/* Animated particles */}
      <CyberParticles />
      
      {/* 3D Models - positioned differently */}
      <div className="absolute right-4 bottom-4 w-64 h-64 opacity-60 pointer-events-none animate-float">
        <GameModel3D />
      </div>
      <div className="absolute left-4 top-4 w-48 h-48 opacity-40 pointer-events-none animate-float">
        <GameModel3D />
      </div>

      {/* Time Attack header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-primary/90 orbitron"
      >
        <div className="flex items-center gap-2">
          <Hourglass className="w-6 h-6 text-secondary animate-pulse" />
          <span className="text-glow-intense">TIME ATTACK</span>
          <Hourglass className="w-6 h-6 text-secondary animate-pulse" />
        </div>
      </motion.div>

      {/* Timer with visual enhancements */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="relative mb-14 mt-12"
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

      {/* Tech Scanline Effect */}
      <div className="tech-scanline"></div>
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute right-[10%] bottom-[20%] text-4xl text-primary/20 animate-float"
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        01010
      </motion.div>
      
      <motion.div 
        className="absolute left-[10%] top-[20%] text-3xl text-secondary/20 animate-float"
        animate={{ rotate: [0, -5, 0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      >
        VOID
      </motion.div>
    </div>
  );
};
