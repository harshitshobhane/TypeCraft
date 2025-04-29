
import React, { useState, useEffect, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Shield, Award, Sparkles, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const gameScreenshots = [
  {
    id: 1,
    title: "Combat Mode Leaderboard",
    description: "Top warriors in the cybernetic arena",
    theme: {
      primary: "from-violet-500 to-purple-600",
      secondary: "from-indigo-400 to-violet-500",
      accent: "#8b5cf6"
    },
    leaderboard: [
      { rank: 1, name: "CYBER_WARRIOR", score: 12500, wpm: 98, level: 25, avatar: "https://i.pravatar.cc/100?img=1" },
      { rank: 2, name: "NEURAL_HUNTER", score: 11800, wpm: 95, level: 24, avatar: "https://i.pravatar.cc/100?img=2" },
      { rank: 3, name: "SYSTEM_OVERRIDE", score: 11200, wpm: 92, level: 23, avatar: "https://i.pravatar.cc/100?img=3" },
      { rank: 4, name: "BINARY_BLADE", score: 10800, wpm: 90, level: 22, avatar: "https://i.pravatar.cc/100?img=4" },
      { rank: 5, name: "QUANTUM_STRIKE", score: 10500, wpm: 88, level: 21, avatar: "https://i.pravatar.cc/100?img=5" }
    ]
  },
  {
    id: 2,
    title: "Time Attack Leaderboard",
    description: "Speed demons of the digital realm",
    theme: {
      primary: "from-red-500 to-rose-600",
      secondary: "from-orange-400 to-red-500",
      accent: "#ef4444"
    },
    leaderboard: [
      { rank: 1, name: "SPEED_DEMON", accuracy: 98, wpm: 120, time: "60s", avatar: "https://i.pravatar.cc/100?img=6" },
      { rank: 2, name: "TIME_BENDER", accuracy: 96, wpm: 118, time: "60s", avatar: "https://i.pravatar.cc/100?img=7" },
      { rank: 3, name: "CHRONO_MASTER", accuracy: 95, wpm: 115, time: "60s", avatar: "https://i.pravatar.cc/100?img=8" },
      { rank: 4, name: "TEMPORAL_RUSH", accuracy: 94, wpm: 112, time: "60s", avatar: "https://i.pravatar.cc/100?img=9" },
      { rank: 5, name: "QUANTUM_SPEED", accuracy: 93, wpm: 110, time: "60s", avatar: "https://i.pravatar.cc/100?img=10" }
    ]
  },
  {
    id: 3,
    title: "Zen Mode Leaderboard",
    description: "Masters of neural harmony",
    theme: {
      primary: "from-cyan-500 to-blue-600",
      secondary: "from-blue-400 to-cyan-500",
      accent: "#0ea5e9"
    },
    leaderboard: [
      { rank: 1, name: "ZEN_MASTER", score: 20000, wpm: 85, streak: 150, avatar: "https://i.pravatar.cc/100?img=11" },
      { rank: 2, name: "MEDITATION_X", score: 19500, wpm: 82, streak: 145, avatar: "https://i.pravatar.cc/100?img=12" },
      { rank: 3, name: "PEACE_WARRIOR", score: 19000, wpm: 80, streak: 140, avatar: "https://i.pravatar.cc/100?img=13" },
      { rank: 4, name: "HARMONY_FLOW", score: 18500, wpm: 78, streak: 135, avatar: "https://i.pravatar.cc/100?img=14" },
      { rank: 5, name: "SERENITY_NOW", score: 18000, wpm: 75, streak: 130, avatar: "https://i.pravatar.cc/100?img=15" }
    ]
  }
];

export const GameGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scanlinePosition, setScanlinePosition] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [hoveredPlayer, setHoveredPlayer] = useState<number | null>(null);
  const [sortByWpm, setSortByWpm] = useState(false);

  useEffect(() => {
    // Scanline animation
    const scanlineInterval = setInterval(() => {
      setScanlinePosition((prev) => (prev + 1) % 100);
    }, 30);

    // Glow animation
    const glowInterval = setInterval(() => {
      setGlowIntensity(prev => {
        const newValue = prev + 0.015 * (Math.random() > 0.5 ? 1 : -1);
        return Math.max(0.3, Math.min(0.7, newValue));
      });
    }, 100);
    
    return () => {
      clearInterval(scanlineInterval);
      clearInterval(glowInterval);
    };
  }, []);

  const currentTheme = useMemo(() => {
    return gameScreenshots[activeIndex].theme;
  }, [activeIndex]);

  // Generate rank icon
  const getRankIcon = (rank: number) => {
    if (rank === 1) return (
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 blur-md bg-yellow-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="rank-badge rank-1 z-10">
          <Trophy className="w-5 h-5 text-yellow-900" />
        </div>
      </div>
    );
    
    if (rank === 2) return (
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 blur-sm bg-gray-300 rounded-full opacity-50"></div>
        <div className="rank-badge rank-2 z-10">
          <Trophy className="w-4 h-4 text-gray-700" />
        </div>
      </div>
    );
    
    if (rank === 3) return (
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 blur-sm bg-amber-700 rounded-full opacity-50"></div>
        <div className="rank-badge rank-3 z-10">
          <Trophy className="w-4 h-4 text-amber-900" />
        </div>
      </div>
    );
    
    return (
      <div className="flex items-center justify-center w-10 h-10 border border-white/20 rounded-full bg-black/40 backdrop-blur-sm">
        <span className="font-audiowide text-white/80 text-sm">#{rank}</span>
      </div>
    );
  };
  
  const getSortedLeaderboard = (leaderboardData) => {
    if (sortByWpm) {
      return [...leaderboardData].sort((a, b) => b.wpm - a.wpm);
    }
    return leaderboardData;
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      <Carousel
        opts={{
          loop: true,
          align: "center",
        }}
        className="w-full"
        setApi={(api) => {
          api?.on("select", () => {
            setActiveIndex(api.selectedScrollSnap());
          });
        }}
      >
        <CarouselContent>
          {gameScreenshots.map((screenshot, index) => (
            <CarouselItem key={screenshot.id} className="md:basis-3/4">
              <div 
                className={`relative h-[450px] md:h-[550px] rounded-xl overflow-hidden transition-all duration-500 ${
                  activeIndex === index ? 'scale-100 opacity-100' : 'scale-90 opacity-70'
                }`}
              >
                {/* Cybernetic Background Effects */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${currentTheme.primary} animate-pulse`}
                  style={{ opacity: 0.1 }}
                  animate={{ 
                    opacity: [0.05, 0.15, 0.05],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Enhanced Grid Background - Different for each mode */}
                {screenshot.id === 1 && (
                  <div className="absolute inset-0 hex-grid opacity-10"></div>
                )}
                {screenshot.id === 2 && (
                  <div className="absolute inset-0 bg-grid opacity-10"></div>
                )}
                {screenshot.id === 3 && (
                  <div className="absolute inset-0 neural-grid opacity-10"></div>
                )}
                
                {/* Pulse Glow Effect */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-b ${currentTheme.secondary}`}
                  style={{ opacity: 0.05 * glowIntensity }}
                />
                
                {/* Multiple Scanline Effect */}
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent"
                    style={{
                      top: `${(scanlinePosition + i * 20) % 100}%`,
                      opacity: 0.15,
                    }}
                  />
                ))}
                
                {/* Content Container */}
                <div className="absolute inset-0 flex flex-col items-center justify-start p-8 z-10">
                  <div className="w-full max-w-3xl relative">
                    {/* Enhanced Header with 3D effect */}
                    <div className="mb-8 relative">
                      {/* Title with shadow layers for 3D effect */}
                      <div className="relative w-fit mx-auto">
                        {[...Array(6)].map((_, i) => (
                          <motion.h3 
                            key={i}
                            className={`font-audiowide text-4xl md:text-5xl font-bold text-center absolute top-0 left-0 right-0 text-transparent`}
                            style={{ 
                              textShadow: `0 ${i}px 0 rgba(${i % 2 ? '138, 92, 246' : '255, 255, 255'}, ${0.2 - i * 0.03})`,
                              transform: `translateY(${-i * 0.5}px)`,
                              opacity: 1 - i * 0.15
                            }}
                          >
                            {screenshot.title}
                          </motion.h3>
                        ))}
                        
                        {/* Visible title */}
                        <motion.h3 
                          className="font-audiowide text-4xl md:text-5xl font-bold text-center relative z-10"
                          style={{
                            WebkitTextStroke: '1px rgba(255,255,255,0.2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            backgroundImage: `linear-gradient(180deg, white, rgba(255,255,255,0.7))`
                          }}
                          animate={{
                            textShadow: [
                              `0 0 10px rgba(${currentTheme.accent.replace('#', '')}, 0.7)`,
                              `0 0 20px rgba(${currentTheme.accent.replace('#', '')}, 0.9)`,
                              `0 0 10px rgba(${currentTheme.accent.replace('#', '')}, 0.7)`,
                            ]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          {screenshot.title}
                        </motion.h3>
                      </div>
                      
                      <motion.p 
                        className="text-white/60 mt-3 mb-6 text-center font-rajdhani text-lg relative z-10 tracking-wide"
                        animate={{
                          opacity: [0.6, 0.8, 0.6]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {screenshot.description}
                      </motion.p>
                    </div>
                    
                    {/* Enhanced Futuristic 3D Leaderboard Table */}
                    <div className="relative backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden shadow-2xl">
                      {/* Glow effects behind table */}
                      <motion.div 
                        className="absolute -inset-1 blur-lg opacity-30"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${currentTheme.accent}, transparent 70%)`
                        }}
                        animate={{
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Enhanced Header */}
                      <div className="grid grid-cols-12 gap-2 p-4 bg-black/80 border-b border-white/20 font-syncopate text-xs uppercase tracking-widest relative backdrop-blur-md">
                        {/* Header illumination */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
                          animate={{
                            opacity: [0, 0.1, 0]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        
                        {/* Enhanced Header titles */}
                        <div className="col-span-1 text-primary flex items-center justify-center">
                          <Award className="w-4 h-4 mr-1" />
                          <span>Rank</span>
                        </div>
                        <div className="col-span-4 text-primary flex items-center pl-1">
                          <Shield className="w-4 h-4 mr-1" />
                          <span>Player</span>
                        </div>
                        <div className="col-span-3 text-primary flex items-center justify-center">
                          {screenshot.id === 2 ? (
                            <>
                              <Sparkles className="w-4 h-4 mr-1" />
                              <span>Accuracy</span>
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4 mr-1" />
                              <span>Score</span>
                            </>
                          )}
                        </div>
                        <div 
                          className="col-span-2 text-primary flex items-center justify-center cursor-pointer group"
                          onClick={() => setSortByWpm(!sortByWpm)}
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          <span>WPM</span>
                          {sortByWpm ? 
                            <ChevronDown className="w-3 h-3 ml-1 opacity-70 group-hover:opacity-100" /> : 
                            <ChevronUp className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-70" />
                          }
                        </div>
                        <div className="col-span-2 text-primary flex items-center justify-center">
                          <Sparkles className="w-4 h-4 mr-1" />
                          <span>
                            {screenshot.id === 1 ? "Level" : 
                            screenshot.id === 2 ? "Time" : 
                            "Streak"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Enhanced Rows */}
                      <div className="space-y-0 custom-scrollbar-hide" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {getSortedLeaderboard(screenshot.leaderboard).map((player, idx) => (
                          <motion.div 
                            key={player.rank}
                            className="grid grid-cols-12 gap-2 items-center relative backdrop-blur-sm animate-subtle-float"
                            style={{ 
                              animationDelay: `${idx * 0.2}s`,
                              borderBottom: "1px solid rgba(255,255,255,0.08)"
                            }}
                            onMouseEnter={() => setHoveredPlayer(player.rank)}
                            onMouseLeave={() => setHoveredPlayer(null)}
                            initial={{ backgroundColor: "rgba(0,0,0,0.4)" }}
                            whileHover={{
                              backgroundColor: `rgba(${currentTheme.accent.replace('#', '')}, 0.15)`,
                              transition: { duration: 0.2 } 
                            }}
                          >
                            {/* Background highlight effect */}
                            <AnimatePresence>
                              {hoveredPlayer === player.rank && (
                                <motion.div 
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                  initial={{ opacity: 0, x: -100 }}
                                  animate={{ 
                                    opacity: 1, 
                                    x: 400,
                                    transition: { duration: 1 }
                                  }}
                                  exit={{ opacity: 0 }}
                                />
                              )}
                            </AnimatePresence>
                            
                            {/* Player is #1 - special treatment */}
                            {player.rank === 1 && (
                              <motion.div 
                                className="absolute inset-0 animate-highlight pointer-events-none"
                                style={{ 
                                  background: `linear-gradient(90deg, transparent, rgba(${currentTheme.accent.replace('#', '')}, 0.1), transparent)`,
                                  borderLeft: '3px solid rgba(255, 215, 0, 0.8)'
                                }}
                              />
                            )}
                            
                            {/* Animated selection border for top 3 */}
                            {player.rank <= 3 && player.rank > 1 && (
                              <motion.div 
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  borderLeft: player.rank === 2 ? `2px solid rgba(192, 192, 192, 0.6)` :
                                            `2px solid rgba(205, 127, 50, 0.6)`
                                }}
                                animate={{
                                  opacity: [0.4, 1, 0.4]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            )}
                            
                            {/* Rank */}
                            <div className="col-span-1 px-2 py-4 text-white/90 flex justify-center">
                              {getRankIcon(player.rank)}
                            </div>
                            
                            {/* Enhanced Player Name */}
                            <div className="col-span-4 py-4">
                              <div className="flex items-center gap-3">
                                {/* Avatar with animated border */}
                                <div className="relative h-10 w-10 rounded-xl overflow-hidden flex-shrink-0">
                                  <motion.div 
                                    className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-80 z-10"
                                    style={{ mixBlendMode: 'overlay' }}
                                    animate={{
                                      background: [
                                        `linear-gradient(45deg, ${currentTheme.accent}80, transparent)`,
                                        `linear-gradient(225deg, ${currentTheme.accent}80, transparent)`,
                                        `linear-gradient(45deg, ${currentTheme.accent}80, transparent)`
                                      ]
                                    }}
                                    transition={{
                                      duration: 3,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                  <motion.div 
                                    className="absolute inset-0 border-2 border-white/30 z-20 rounded-xl"
                                    animate={{
                                      boxShadow: [
                                        `0 0 0px ${currentTheme.accent}40`,
                                        `0 0 5px ${currentTheme.accent}80`,
                                        `0 0 0px ${currentTheme.accent}40`,
                                      ]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                  <img 
                                    src={player.avatar} 
                                    alt={player.name} 
                                    className="object-cover h-full w-full"
                                  />
                                </div>
                                
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    <h4 
                                      className="font-rajdhani font-semibold tracking-wider text-base"
                                      style={{
                                        color: player.rank <= 3 ? `${currentTheme.accent}` : 'white'
                                      }}
                                    >
                                      {player.name.split('_')[0]}
                                      <span className="opacity-70 font-normal">_{player.name.split('_')[1]}</span>
                                    </h4>
                                    
                                    {/* First place badge */}
                                    {player.rank === 1 && (
                                      <motion.div 
                                        className="ml-2 rounded-md px-1 py-0.5 bg-yellow-500/20 border border-yellow-500/30"
                                        animate={{
                                          boxShadow: [
                                            '0 0 0px rgba(234, 179, 8, 0)',
                                            '0 0 10px rgba(234, 179, 8, 0.5)',
                                            '0 0 0px rgba(234, 179, 8, 0)'
                                          ]
                                        }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                          ease: "easeInOut"
                                        }}
                                      >
                                        <span className="text-[10px] font-syncopate text-yellow-400">
                                          TOP
                                        </span>
                                      </motion.div>
                                    )}
                                  </div>
                                  
                                  {/* Dynamic tag based on player rank */}
                                  <div className="flex items-center mt-0.5">
                                    <span 
                                      className="text-[10px] opacity-50 font-syncopate"
                                      style={{ color: player.rank <= 3 ? `${currentTheme.accent}` : 'white' }}
                                    >
                                      {player.rank === 1 ? 'LEGENDARY' : 
                                       player.rank === 2 ? 'ELITE' : 
                                       player.rank === 3 ? 'VETERAN' : 
                                       player.rank === 4 ? 'ADVANCED' : 'SKILLED'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Score/Accuracy Column */}
                            <div className="col-span-3 py-4">
                              <motion.div 
                                className="flex items-center justify-center font-audiowide"
                                animate={player.rank <= 3 ? {
                                  textShadow: [
                                    `0 0 8px rgba(${currentTheme.accent.replace('#', '')}, 0.4)`,
                                    `0 0 12px rgba(${currentTheme.accent.replace('#', '')}, 0.7)`,
                                    `0 0 8px rgba(${currentTheme.accent.replace('#', '')}, 0.4)`
                                  ]
                                } : {}}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                <div className="relative">
                                  {screenshot.id === 2 ? (
                                    // Display accuracy for Time Attack
                                    <span className="text-xl font-bold" style={{ color: player.rank <= 3 ? `${currentTheme.accent}` : 'white' }}>
                                      {player.accuracy}%
                                    </span>
                                  ) : (
                                    // Display score for other modes
                                    <>
                                      <span className="text-xl font-bold" style={{ color: player.rank <= 3 ? `${currentTheme.accent}` : 'white' }}>
                                        {Math.floor(player.score / 1000)}
                                      </span>
                                      <span className="text-white/80">,</span>
                                      <span className="text-white/90">{String(player.score % 1000).padStart(3, '0')}</span>
                                    </>
                                  )}
                                  
                                  {/* Progress bar indicator */}
                                  <motion.div 
                                    className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full"
                                    style={{ 
                                      backgroundColor: currentTheme.accent, 
                                      width: screenshot.id === 2 ? 
                                        `${(player.accuracy / 100) * 100}%` : 
                                        `${(player.score / gameScreenshots[activeIndex].leaderboard[0].score) * 100}%` 
                                    }}
                                    animate={{
                                      opacity: [0.3, 0.7, 0.3]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                  />
                                </div>
                              </motion.div>
                            </div>
                            
                            {/* WPM with enhanced animated effect */}
                            <div className="col-span-2 py-4">
                              <motion.div 
                                className="flex flex-col items-center justify-center"
                                animate={player.wpm > 90 ? {
                                  color: [
                                    'rgba(255,255,255,0.9)',
                                    currentTheme.accent,
                                    'rgba(255,255,255,0.9)'
                                  ]
                                } : {}}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              >
                                <div className="relative">
                                  <span 
                                    className={`text-2xl font-bold ${
                                      player.wpm > 100 ? 'text-glitch' : ''
                                    }`}
                                    style={{
                                      color: player.rank <= 3 ? `${currentTheme.accent}` : 'white'
                                    }}
                                  >
                                    {player.wpm}
                                  </span>
                                  
                                  {/* Speed indicator dots */}
                                  <div className="flex space-x-0.5 justify-center mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <motion.div 
                                        key={i}
                                        className="h-1 w-1 rounded-full"
                                        style={{ 
                                          backgroundColor: i < Math.ceil(player.wpm / 25) ? currentTheme.accent : 'rgba(255,255,255,0.2)',
                                        }}
                                        animate={i < Math.ceil(player.wpm / 25) ? {
                                          opacity: [0.6, 1, 0.6]
                                        } : {}}
                                        transition={{
                                          duration: 1 + i * 0.2,
                                          repeat: Infinity,
                                          ease: "easeInOut",
                                          delay: i * 0.1
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                            
                            {/* Level/Time/Streak with custom styling */}
                            <div className="col-span-2 py-4 text-secondary flex items-center justify-center">
                              {screenshot.id === 1 && (
                                <div className="relative">
                                  <div className="absolute -inset-1 rounded-md blur-sm opacity-50" 
                                    style={{backgroundColor: currentTheme.accent}}></div>
                                  <div className="font-syncopate bg-black/50 backdrop-blur-sm border border-white/20 px-3 py-1 rounded font-bold text-white relative z-10">
                                    LV{player.level}
                                  </div>
                                </div>
                              )}
                              
                              {screenshot.id === 2 && (
                                <div className="font-audiowide text-white bg-black/30 px-3 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                                  {player.time}
                                </div>
                              )}
                              
                              {screenshot.id === 3 && (
                                <div className="flex items-center">
                                  <motion.div
                                    animate={{
                                      scale: [1, 1.05, 1],
                                      opacity: [0.8, 1, 0.8]
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut"
                                    }}
                                    className="font-audiowide text-white/90 bg-black/30 px-3 py-1 rounded-md border border-white/10 backdrop-blur-sm"
                                  >
                                    <span className="text-blue-400 mr-1">×</span>
                                    {player.streak}
                                  </motion.div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Border effects */}
                <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none"></div>
                
                {/* Corner accents */}
                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
                  <div 
                    key={corner}
                    className={`absolute w-8 h-8 border-t-2 border-l-2 ${
                      corner === 'top-left' ? 'top-2 left-2' :
                      corner === 'top-right' ? 'top-2 right-2 rotate-90' :
                      corner === 'bottom-left' ? 'bottom-2 left-2 -rotate-90' :
                      'bottom-2 right-2 rotate-180'
                    } rounded-tl-lg opacity-70`}
                    style={{ borderColor: currentTheme.accent }}
                  ></div>
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-background/40 backdrop-blur-lg hover:bg-background/60 border-primary text-primary" />
        <CarouselNext className="right-2 bg-background/40 backdrop-blur-lg hover:bg-background/60 border-primary text-primary" />
      </Carousel>
      
      {/* Enhanced indicators */}
      <div className="flex justify-center mt-6 gap-2">
        {gameScreenshots.map((_, index) => {
          const isActive = activeIndex === index;
          return (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="relative flex items-center justify-center"
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ 
                    backgroundColor: gameScreenshots[index].theme.accent,
                    opacity: 0.4,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
              <motion.div
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive ? 'w-8 bg-primary' : 'bg-white/30'
                }`}
                animate={
                  isActive 
                    ? { 
                        boxShadow: [
                          `0 0 0px rgba(var(--primary), 0)`,
                          `0 0 8px rgba(var(--primary), 0.6)`,
                          `0 0 0px rgba(var(--primary), 0)`
                        ]
                      } 
                    : {}
                }
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
