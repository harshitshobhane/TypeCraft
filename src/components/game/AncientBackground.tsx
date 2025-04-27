
import React from 'react';

export const AncientBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Desert background with subtle animation */}
      <div 
        className="absolute inset-0 bg-[#2A1810] opacity-90"
        style={{
          backgroundImage: `url('/background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          animation: 'subtlePulse 8s infinite'
        }}
      />
      
      {/* Animated sand particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-amber-300/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.2 + Math.random() * 0.3,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
      
      {/* Enhanced ambient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-amber-900/20 to-transparent animate-pulse-slow" />
      
      {/* Desert haze effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-transparent mix-blend-overlay"
        style={{
          animation: 'desertHaze 15s infinite'
        }}
      />
    </div>
  );
};
