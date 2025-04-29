
import { useCallback, useEffect, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  color: string;
}

export const CyberParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  const initParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    const colors = ['rgba(155, 135, 245, 0.6)', 'rgba(212, 70, 239, 0.5)', 'rgba(14, 165, 233, 0.4)'];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setParticles(newParticles);
  }, []);
  
  useEffect(() => {
    initParticles();
    
    const handleResize = () => {
      initParticles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initParticles]);
  
  useEffect(() => {
    const animateParticles = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y + p.speed,
        x: p.x + Math.sin(p.y * 0.05) * 0.2,
        ...(p.y > window.innerHeight ? { y: -10, x: Math.random() * window.innerWidth } : {})
      })));
    };
    
    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            opacity: Math.min(1, particle.size / 2)
          }}
        />
      ))}
    </div>
  );
};
