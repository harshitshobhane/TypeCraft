import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CyberParticles } from '@/components/CyberParticles';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Zap, Menu, Type } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getRandomWords } from '@/data/wordList';
import { getRandomWords as getSimpleWords } from '@/data/SimpleWords';
import { GameSidebar } from './GameSidebar';

interface TimeAttackProps {
  onScoreChange: (score: number) => void;
  onWpmChange: (wpm: number) => void;
  onGameOver: () => void;
}

// Utility to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Shuffle words within each sentence
function shuffleSentenceWords(sentences: string[]): string[] {
  return sentences.map(sentence => shuffleArray(sentence.split(' ')).join(' '));
}

export const TimeAttackMode = ({ onScoreChange, onWpmChange, onGameOver }: TimeAttackProps) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number>(15);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>('font-orbitron');
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const { toast } = useToast();

  // Track Tab key state
  const [isTabPressed, setIsTabPressed] = useState(false);

  // Generate random sentences using both word lists
  const sentences = [
    // Mix: half from each, or alternate
    ((Math.random() > 0.5 ? getRandomWords : getSimpleWords)(30, true)) as string,
    ((Math.random() > 0.5 ? getRandomWords : getSimpleWords)(40, true)) as string,
    ((Math.random() > 0.5 ? getRandomWords : getSimpleWords)(50, true)) as string,
  ];

  // Remove separate 'press any key to start' logic. Start timer and typing together on first valid key.
  const [waitingForFirstKey, setWaitingForFirstKey] = useState(true);

  const [shuffledSentences, setShuffledSentences] = useState<string[]>(() => shuffleSentenceWords(shuffleArray(sentences)));

  useEffect(() => {
    if (waitingForFirstKey) {
      const handleFirstKey = (e: KeyboardEvent) => {
        if (
          document.visibilityState === 'visible' &&
          e.key.length === 1 &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.altKey
        ) {
          setGameStarted(true);
          setTimerStarted(true);
          setWaitingForFirstKey(false);
          setUserInput(e.key); // This ensures the first key is counted as input
          window.removeEventListener('keydown', handleFirstKey);
        }
      };
      window.addEventListener('keydown', handleFirstKey);
      return () => window.removeEventListener('keydown', handleFirstKey);
    }
  }, [waitingForFirstKey]);

  // Timer effect (only runs if timerStarted)
  useEffect(() => {
    if (timerStarted && timeLeft > 0) {
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
  }, [timerStarted, timeLeft, onGameOver]);

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

  // Remove wordList and word states, use sentences array and sentence states
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentSentence, setCurrentSentence] = useState(shuffledSentences[0]);
  const [typedSentence, setTypedSentence] = useState("");
  const [sentencesTyped, setSentencesTyped] = useState(0);
  const [correctSentences, setCorrectSentences] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);

  // When the timer starts or resets, reset sentence state and char counters
  useEffect(() => {
    setCurrentSentenceIndex(0);
    setCurrentSentence(shuffledSentences[0]);
    setTypedSentence("");
    setSentencesTyped(0);
    setCorrectSentences(0);
    setTotalTypedChars(0);
    setTotalCorrectChars(0);
  }, [selectedTime, gameStarted]);

  // --- Monkeytype-style state ---
  const [userInput, setUserInput] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const charBarRef = useRef<HTMLDivElement>(null);

  // Main keydown handler (only active after first key)
  useEffect(() => {
    if (!waitingForFirstKey) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setUserInput(prev => {
            if (prev.length < currentSentence.length) {
              // Update char counters
              setTotalTypedChars(chars => chars + 1);
              setTotalCorrectChars(chars =>
                e.key === currentSentence[prev.length] ? chars + 1 : chars
              );
              return prev + e.key;
            }
            return prev;
          });
        } else if (e.key === 'Backspace') {
          setUserInput(prev => prev.slice(0, -1));
          setTotalTypedChars(chars => (chars > 0 ? chars - 1 : 0));
          // Don't decrement totalCorrectChars (can't know if removed char was correct)
        } else if (e.key === 'Enter' && userInput.length === currentSentence.length) {
          const nextIndex = (currentSentenceIndex + 1) % shuffledSentences.length;
          setCurrentSentenceIndex(nextIndex);
          setCurrentSentence(shuffledSentences[nextIndex]);
          setUserInput("");
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [waitingForFirstKey, userInput, currentSentence, currentSentenceIndex, shuffledSentences]);

  // Scroll caret into view
  useEffect(() => {
    if (charBarRef.current) {
      const caret = charBarRef.current.querySelector('.caret');
      if (caret && caret instanceof HTMLElement) {
        caret.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [userInput]);

  // Calculate WPM and accuracy for characters
  const elapsedMinutes = selectedTime ? (selectedTime - timeLeft) / 60 : 1;
  const wpm = elapsedMinutes > 0 ? Math.round((totalCorrectChars / 5) / elapsedMinutes) : 0;
  const accuracy = totalTypedChars > 0 ? Math.round((totalCorrectChars / totalTypedChars) * 100) : 100;

  // When selecting a new time, shuffle the sentences and their words
  const startGame = (duration: number) => {
    const newShuffled = shuffleSentenceWords(shuffleArray(sentences));
    setShuffledSentences(newShuffled);
    setSelectedTime(duration);
    setTimeLeft(duration);
    setGameStarted(false);
    setTimerStarted(false);
    setUserInput("");
    setCurrentSentenceIndex(0);
    setCurrentSentence(newShuffled[0]);
    setWaitingForFirstKey(true);
  };

  // On initial mount, shuffle sentences and their words
  useEffect(() => {
    const newShuffled = shuffleSentenceWords(shuffleArray(sentences));
    setShuffledSentences(newShuffled);
    setCurrentSentenceIndex(0);
    setCurrentSentence(newShuffled[0]);
  }, []);

  // Determine timer color based on time left
  let timerColor = 'from-white to-primary/60';
  let timerText = 'text-primary';
  if (timeLeft <= 9) {
    timerColor = 'from-white to-red-500';
    timerText = 'text-red-400';
  } else if (timeLeft <= 19) {
    timerColor = 'from-white to-orange-400';
    timerText = 'text-orange-300';
  } else if (timeLeft <= 29) {
    timerColor = 'from-white to-yellow-300';
    timerText = 'text-yellow-400';
  }

  // Available fonts with display names and class values
  const fonts = [
    { name: 'Times New Roman', value: 'font-times' },
    { name: 'Roboto Mono', value: 'font-roboto-mono' },
    { name: 'Fira Code', value: 'font-fira-code' },
    { name: 'JetBrains Mono', value: 'font-jetbrains-mono' },
    { name: 'Source Code Pro', value: 'font-source-code-pro' },
    { name: 'Orbitron', value: 'font-orbitron' }
  ];

  // Handle font change through dropdown or scroll
  const handleFontChange = (newFont: string) => {
    setSelectedFont(newFont);
    const newIndex = fonts.findIndex(font => font.value === newFont);
    if (newIndex !== -1) {
      setCurrentFontIndex(newIndex);
    }
  };

  // Handle mouse wheel event for font switching
  const handleWheel = useCallback((event: WheelEvent) => {
    if (event.deltaY !== 0) {
      event.preventDefault();
      const direction = event.deltaY > 0 ? 1 : -1;
      const newIndex = (currentFontIndex + direction + fonts.length) % fonts.length;
      setCurrentFontIndex(newIndex);
      setSelectedFont(fonts[newIndex].value);
    }
  }, [currentFontIndex, fonts]);

  // Add wheel event listener
  useEffect(() => {
    const textContainer = document.querySelector('.typing-container');
    if (textContainer) {
      textContainer.addEventListener('wheel', handleWheel, { passive: false });
      return () => textContainer.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const [wordsFontIndex, setWordsFontIndex] = useState(0);
  
  // Available fonts for the typing words
  const typingFonts = [
    { name: 'Orbitron', class: 'font-orbitron' },
    { name: 'Roboto Mono', class: 'font-roboto' },
    { name: 'Fira Code', class: 'font-fira' },
    { name: 'JetBrains Mono', class: 'font-jetbrains' },
    { name: 'Source Code Pro', class: 'font-sourcecodepro' }
  ];

  // Function to cycle through fonts
  const cycleFont = () => {
    setWordsFontIndex((prev) => (prev + 1) % typingFonts.length);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Handle menu button click
  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setIsSidebarOpen(false);
  };

  // Handle game restart
  const handleRestart = () => {
    window.location.reload();
    setIsSidebarOpen(false);
  };

  // Handle exit to menu
  const handleExit = () => {
    onGameOver();
    setIsSidebarOpen(false);
  };

  const [bestScore, setBestScore] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);
  const [bestAccuracy, setBestAccuracy] = useState(0);
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || 'Player');

  // Update best scores
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
    if (wpm > bestWpm) {
      setBestWpm(wpm);
    }
    if (accuracy > bestAccuracy) {
      setBestAccuracy(accuracy);
    }
  }, [score, wpm, accuracy]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-background">
      {/* Enhanced Top Bar */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-3 backdrop-blur-xl border-b border-primary/20 z-50"
      >
        {/* Left Section: Time Selection */}
        <div className="flex items-center gap-3">
          <div className="flex gap-2 p-1 rounded-lg">
            {[15, 30, 60, 120].map((duration) => (
              <motion.button
                key={duration}
                onClick={() => startGame(duration)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-1.5 rounded-md transition-all duration-300 font-bold text-base
                  ${selectedTime === duration 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'text-primary/80 hover:text-primary hover:bg-primary/10'}`}
              >
                {duration}s
                {selectedTime === duration && (
                  <motion.div
                    layoutId="activeTime"
                    className="absolute inset-0 bg-primary rounded-md -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Center Section: Stats */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-12">
          {/* WPM */}
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-xl font-bold text-cyan-400">{wpm}</span>
            </div>
            <span className="text-xs text-cyan-400/60 uppercase tracking-wider">WPM</span>
          </motion.div>

          {/* Timer */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative"
          >
            <span className={`text-5xl md:text-6xl font-bold orbitron bg-gradient-to-b ${timerColor} bg-clip-text text-transparent drop-shadow-glow`}>
              {timeLeft}
              <span className="text-2xl ml-1 font-light">s</span>
            </span>
          </motion.div>

          {/* Accuracy */}
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-pink-400">{accuracy}%</span>
            </div>
            <span className="text-xs text-pink-400/60 uppercase tracking-wider">Accuracy</span>
          </motion.div>
        </div>

        {/* Right Section: Font Selection */}
        <div className="flex items-center gap-3">
          {/* Font Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={cycleFont}
            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center gap-2"
          >
            <Type className="w-4 h-4" />
            <span className="text-sm font-medium">{typingFonts[wordsFontIndex].name}</span>
          </motion.button>

          {/* Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMenuClick}
            className="p-2 rounded-lg text-primary/80 hover:text-primary hover:bg-primary/10 transition-all"
          >
            <Menu className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Game Sidebar */}
      <GameSidebar
        isOpen={isSidebarOpen}
        onClose={handleMenuClose}
        onRestart={handleRestart}
        onExit={handleExit}
        currentScore={score}
        bestScore={bestScore}
        bestWpm={bestWpm}
        bestAccuracy={bestAccuracy}
        timeLeft={timeLeft}
        playerName={playerName}
        playerAvatar="/default-avatar.png"
      />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-radial-gradient opacity-80"></div>
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-20"></div>
      
      {/* Animated particles */}
      <CyberParticles />

      <div className="max-w-3xl w-full space-y-8 relative z-10">
        {/* Character display */}
        <div
          className={`typing-container overflow-x-auto w-full custom-scrollbar-hide ${typingFonts[wordsFontIndex].class}`}
          style={{ maxHeight: '3.5rem' }}
          ref={charBarRef}
        >
          {currentSentence.split('').map((char, idx) => {
            let color = 'text-gray-400';
            if (idx < userInput.length) {
              color = userInput[idx] === char ? 'text-green-400' : 'text-red-400';
            } else if (idx === userInput.length) {
              color = 'text-primary underline';
            }
            const isSpace = char === ' ';
            return (
              <span
                key={idx}
                className={`text-2xl md:text-3xl transition-colors duration-200 ${color} ${idx === userInput.length ? 'caret' : ''} ${isSpace ? 'mx-1 md:mx-2' : ''}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>
      </div>
      {/* Tab+Enter Button */}
      <motion.div 
        className="absolute bottom-6 text-center text-sm text-white/50"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
      >
        <p className="tracking-wide">Press Tab + Enter to restart</p>
      </motion.div>
    </div>
  );
};
