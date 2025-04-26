
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
        className="bg-black/80 px-6 py-3 rounded-xl font-mono text-lg border-2 border-primary/50 shadow-lg relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-primary/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-primary opacity-20 blur group-hover:opacity-30 transition-opacity duration-500" />
        <span className="relative z-10 text-primary flex items-center gap-2">
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
              className="relative group bg-black/80 border-2 border-primary/50 text-primary hover:bg-primary/20 hover:border-primary transition-all duration-300"
            >
              <div className="absolute inset-0 bg-primary/10 rounded-md filter blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span className="font-mono">Menu</span>
              <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </motion.div>
        </SheetTrigger>
        
        <SheetContent className="bg-gradient-to-b from-black/95 to-primary/20 border-l border-primary/30">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-center font-orbitron text-primary text-glow"
            >
              Game Menu
            </motion.div>
            
            <div className="glass-card p-4 rounded-xl border border-primary/30 bg-black/50 backdrop-blur-md">
              <h3 className="text-xl font-orbitron text-primary mb-3">Player Card</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-2xl">
                  {playerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-semibold">{playerName}</p>
                  <p className="text-sm text-primary/80">High Score: {highScore}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/mode-select')}
                variant="outline"
                className="w-full bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/50 hover:bg-primary/30"
              >
                Change Game Mode
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full bg-gradient-to-r from-secondary/20 to-secondary/5 border border-secondary/50 hover:bg-secondary/30"
              >
                Restart Game
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/50 hover:bg-accent/30"
              >
                Main Menu
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
