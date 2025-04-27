import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface ModeIndicatorProps {
  mode: string;
}

const modeDisplayNames: Record<string, string> = {
  'classic': 'Classic Battle',
  'timeattack': 'Time Attack',
  'survival': 'Survival Mode',
  'cyberhack': 'Cyber Hack'
};

export const ModeIndicator = ({ mode }: ModeIndicatorProps) => {
  const navigate = useNavigate();
  const [showScoreCard, setShowScoreCard] = React.useState(false);
  
  const displayName = modeDisplayNames[mode] || 'Standard Mode';
  
  // Get player data from localStorage
  const playerName = localStorage.getItem('playerName') || 'Player';
  const highScore = localStorage.getItem(`${mode}_highScore`) || '0';
  
  return (
    <div className="absolute top-8 right-5 flex gap-4 items-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-black/30 px-6 py-3 rounded-xl font-mono text-lg border-2 border-primary/30 shadow-lg relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-primary opacity-10 blur group-hover:opacity-20 transition-opacity duration-500" />
        <span className="relative z-10 text-primary/90 flex items-center gap-2">
          ⚔️ {displayName}
          <span className="text-xs text-amber-400/70 animate-pulse">Active</span>
        </span>
      </motion.div>
      
      <Sheet>
        <SheetTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="relative group bg-black/30 border-2 border-primary/30 text-primary/90 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-md filter blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span className="font-mono">Menu</span>
              <div className="absolute -inset-px bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </motion.div>
        </SheetTrigger>
        
        <SheetContent className="bg-gradient-to-br from-black/95 via-black/90 to-primary/10 border-l-2 border-primary/20 backdrop-blur-xl">
          <div className="space-y-8 relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-center font-orbitron bg-gradient-to-r from-primary/90 via-amber-500/90 to-primary/90 text-transparent bg-clip-text"
            >
              Game Menu
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-2xl border border-primary/20 bg-black/40 backdrop-blur-md relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <h3 className="text-xl font-orbitron bg-gradient-to-r from-primary to-amber-500 text-transparent bg-clip-text mb-4">Player Card</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-secondary/60 flex items-center justify-center text-2xl shadow-lg shadow-primary/20">
                  {playerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold text-primary/90">{playerName}</p>
                  <p className="text-sm text-primary/70">High Score: {highScore}</p>
                </div>
              </div>
            </motion.div>
            
            <div className="space-y-4 relative">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  onClick={() => navigate('/mode-select')}
                  variant="outline"
                  className="w-full h-12 bg-black/30 border border-primary/30 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <span className="relative z-10 font-mono">Change Game Mode</span>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full h-12 bg-black/30 border border-secondary/30 hover:bg-secondary/20 hover:border-secondary/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <span className="relative z-10 font-mono">Restart Game</span>
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full h-12 bg-black/30 border border-accent/30 hover:bg-accent/20 hover:border-accent/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <span className="relative z-10 font-mono">Main Menu</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
