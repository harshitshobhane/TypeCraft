import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface GameSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onExit: () => void;
  currentScore: number;
  bestScore: number;
  bestWpm: number;
  bestAccuracy: number;
  timeLeft: number;
  playerName: string;
  playerAvatar?: string;
}

export const GameSidebar = ({
  isOpen,
  onClose,
  onRestart,
  onExit,
  currentScore,
  bestScore,
  bestWpm,
  bestAccuracy,
  timeLeft,
  playerName,
  playerAvatar = "/default-avatar.png"
}: GameSidebarProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed top-0 right-0 h-full w-[400px] bg-background/95 backdrop-blur-xl border-l border-primary/20 shadow-xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-primary/10">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-primary/60 bg-clip-text text-transparent">
                Game Menu
              </h2>
              <p className="text-sm text-primary/60">
                View your best stats and game settings
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-primary/10"
            >
              <X className="w-5 h-5 text-primary/60" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Player Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border border-primary/10 hover:border-primary/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20 group-hover:border-primary/40 transition-colors duration-300 shadow-lg shadow-primary/10">
                  <AvatarImage src={playerAvatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {playerName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-primary/60 bg-clip-text text-transparent">
                    {playerName}
                  </h3>
                  <p className="text-sm text-primary/60">Best Score: {bestScore}</p>
                </div>
              </div>
            </motion.div>

            {/* Game Actions */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 font-medium tracking-wide text-primary/80 hover:text-primary"
                onClick={onRestart}
              >
                Restart Game
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 font-medium tracking-wide text-red-500/80 hover:text-red-500"
                onClick={onExit}
              >
                Exit to Menu
              </Button>
            </div>

            {/* Best Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary/80">
                Personal Bests
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-primary/60">Best WPM</p>
                      <p className="text-2xl font-bold text-primary">{bestWpm}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary/60">Best Accuracy</p>
                      <p className="text-2xl font-bold text-primary">{bestAccuracy}%</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10 hover:border-primary/20 transition-all duration-300"
                >
                  <p className="text-sm text-primary/60">Best Score</p>
                  <p className="text-2xl font-bold text-primary">{bestScore}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10 hover:border-primary/20 transition-all duration-300"
                >
                  <p className="text-sm text-primary/60">Current Score</p>
                  <p className="text-2xl font-bold text-primary">{currentScore}</p>
                </motion.div>
              </div>
            </div>

            {/* Game Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary/80">
                Game Info
              </h3>
              <div className="space-y-2 text-sm text-primary/60">
                <p>• Press Tab + Enter to quickly restart</p>
                <p>• Use mouse wheel to change fonts</p>
                <p>• Press Esc to pause the game</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-primary/10">
            <p className="text-xs text-center text-primary/40">
              Made with ❤️ by Your Team
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 