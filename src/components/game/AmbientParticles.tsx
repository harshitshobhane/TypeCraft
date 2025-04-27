
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface AmbientParticlesProps {
  count?: number;
  era: 'ancient' | 'medieval' | 'future';
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({ 
  count = 50,
  era
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const [dimensions, setDimensions] = React.useState({ width: 1, height: 1 });

  const getParticleColor = () => {
    switch (era) {
      case 'ancient':
        return 'rgba(126, 213, 111, 0.8)';
      case 'medieval':
        return 'rgba(180, 90, 211, 0.8)';
      case 'future':
        return 'rgba(56, 182, 255, 0.8)';
    }
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width <= 1 || dimensions.height <= 1) return;
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 15 + 15,
        delay: Math.random() * 10
      });
    }
    
    setParticles(newParticles);
  }, [count, dimensions]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: getParticleColor(),
            boxShadow: `0 0 ${particle.size * 3}px ${getParticleColor()}`,
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity
          }}
          animate={{
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * 40 - 20, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
