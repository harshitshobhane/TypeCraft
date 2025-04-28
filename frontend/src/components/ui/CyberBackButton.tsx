import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { useIsMobile } from '@/hooks/use-mobile';

interface CyberBackButtonProps {
  onClick: () => void;
  label?: string;
}

export const CyberBackButton = ({ onClick }: CyberBackButtonProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <Button 
        variant="outline" 
        size="icon"
        onClick={onClick}
        className="relative w-12 h-12 rounded-full bg-black/50 border-2 border-primary/50 text-primary"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
    </motion.div>
  );
};
