
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Lock, Zap, Trophy, BookOpen, Target, Code, Swords } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CyberBackButton } from "@/components/ui/CyberBackButton";
import { GameModel3D } from "@/components/GameModel3D";
import { useResponsive } from "@/hooks/use-responsive";
import { useIsMobile } from "@/hooks/use-mobile";

interface GameModeProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  features: string[];
  isLocked: boolean;
  unlockRequirement?: string;
  icon: React.ReactNode;
}

// Function to determine the badge color based on difficulty
const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'hard':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};

const GameModeSelection = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { isPortrait } = useResponsive();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const gameModes: GameModeProps[] = [
    {
      id: 'combat',
      title: 'Combat Mode',
      description: 'Battle enemies by typing words. Each correct word deals damage to the enemy. Survive as long as possible!',
      difficulty: 'medium',
      features: ['Enemy health system', 'Combo multiplier', 'Power-ups', 'Progressive difficulty'],
      isLocked: false,
      icon: <Swords className="w-6 h-6 text-primary" />
    },
    {
      id: 'timeattack',
      title: 'Time Attack',
      description: 'Complete typing challenges against the clock. Test your speed and accuracy in this fast-paced mode!',
      difficulty: 'easy',
      features: ['Timer countdown', 'WPM tracking', 'Accuracy rating', 'Progressive difficulty'],
      isLocked: false,
      icon: <Target className="w-6 h-6 text-primary" />
    },
    {
      id: 'code',
      title: 'Code Typing',
      description: 'Practice typing code snippets in various programming languages. Perfect for developers!',
      difficulty: 'hard',
      features: ['Syntax highlighting', 'Multiple languages', 'Error detection', 'Code completion'],
      isLocked: true,
      unlockRequirement: 'Complete Combat Mode level 10',
      icon: <Code className="w-6 h-6 text-primary" />
    },
    {
      id: 'story',
      title: 'Story Mode',
      description: 'Embark on an epic journey through time, mastering the art of typing while uncovering an engaging narrative.',
      difficulty: 'medium',
      features: ['Rich storyline', 'Character development', 'Multiple endings', 'Special abilities'],
      isLocked: true,
      unlockRequirement: 'Complete Time Attack mode 5 times',
      icon: <BookOpen className="w-6 h-6 text-primary" />
    },
    {
      id: 'challenge',
      title: 'Challenge Mode',
      description: 'Face unique daily challenges and compete with players worldwide on the leaderboard!',
      difficulty: 'hard',
      features: ['Daily challenges', 'Global rankings', 'Special rewards', 'Achievement system'],
      isLocked: true,
      unlockRequirement: 'Reach level 15 in any mode',
      icon: <Trophy className="w-6 h-6 text-primary" />
    },
    {
      id: 'zen',
      title: 'Zen Mode',
      description: 'Practice typing in a relaxed environment with no pressure. Perfect for beginners!',
      difficulty: 'easy',
      features: ['No time limit', 'Peaceful atmosphere', 'Custom text input', 'Progress tracking'],
      isLocked: false,
      icon: <Zap className="w-6 h-6 text-primary" />
    }
  ];

  const handleModeSelect = (mode: string) => {
    if (gameModes.find(m => m.id === mode)?.isLocked) {
      return;
    }
    
    setSelectedMode(mode);
    setIsLoading(true);
    localStorage.setItem('selectedGameMode', mode);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/game');
    }, 1500);
  };

  return (
    <div className={`min-h-screen w-full bg-background transition-opacity duration-1000 flex flex-col items-center justify-start ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-20"></div>
      <div className="tech-scanline"></div>

      <div className={`container relative z-10 px-4 py-8 md:py-16 max-w-7xl ${isPortrait && isMobile ? 'mt-4' : ''}`}>
        <CyberBackButton onClick={() => navigate('/')} />
        
        <div className="text-center mb-8 md:mb-12 relative">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <h1 className={`orbitron ${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'} font-bold mb-4 md:mb-6 text-glow-intense relative z-10`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                Select Your Battle Mode
              </span>
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-xl -z-10" />
          </motion.div>
          <p className={`exo text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto ${isMobile ? 'px-4' : ''}`}>
            Choose your combat arena and test your typing skills against various challenges
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">{selectedMode === 'combat' ? '⚔️' : '⌨️'}</span>
              </div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="orbitron text-2xl font-bold text-primary">Preparing your battle arena...</h3>
              <div className="flex justify-center space-x-2">
                <span className="animate-pulse">⋯</span>
                <span className="animate-pulse delay-100">⋯</span>
                <span className="animate-pulse delay-200">⋯</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
            {gameModes.map((mode, index) => (
              <motion.div 
                key={mode.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <Card className={`relative h-full border border-primary/30 backdrop-blur-sm bg-background/50 overflow-hidden transition-all duration-300 group-hover:border-primary/60 group-hover:transform group-hover:scale-[1.02] ${isMobile ? 'p-4' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <h3 className="orbitron text-xl md:text-2xl font-bold text-primary flex items-center gap-2 group-hover:text-glow">
                        {mode.icon} {mode.title}
                        {mode.isLocked && (
                          <Lock className="inline ml-2 w-5 h-5 text-accent animate-pulse" />
                        )}
                      </h3>
                      <Badge className={`${getDifficultyColor(mode.difficulty)} text-white`}>
                        {mode.difficulty.charAt(0).toUpperCase() + mode.difficulty.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground/80 mt-2">{mode.description}</p>
                  </CardHeader>
                  <CardContent className="py-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ul className="space-y-2">
                      {mode.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Star className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="relative z-10">
                    {mode.isLocked ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button disabled className="w-full bg-primary/50 hover:bg-primary/50 cursor-not-allowed">
                            Locked
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="glass-effect text-center p-3">
                          <p className="text-sm">{mode.unlockRequirement}</p>
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <Button 
                        onClick={() => handleModeSelect(mode.id)}
                        className="w-full orbitron bg-primary/80 hover:bg-primary hover:scale-105 transition-all duration-300 relative overflow-hidden group"
                      >
                        <span className="relative z-10">Play Now</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-30 transition-opacity" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-0 left-0 w-full h-48 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </motion.div>
    </div>
  );
};

export default GameModeSelection;
