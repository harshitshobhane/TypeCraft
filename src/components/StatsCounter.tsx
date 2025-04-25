
import { useEffect, useState } from 'react';
import { Trophy, Star, Shield } from 'lucide-react';

interface Stat {
  value: number;
  label: string;
  icon: JSX.Element;
  suffix: string;
}

export const StatsCounter = () => {
  const [animatedStats, setAnimatedStats] = useState<Stat[]>([
    { value: 0, label: 'Launch Rewards', icon: <Trophy className="w-6 h-6" />, suffix: '+' },
    { value: 0, label: 'Achievement Goals', icon: <Star className="w-6 h-6" />, suffix: '' },
    { value: 0, label: 'Difficulty Levels', icon: <Shield className="w-6 h-6" />, suffix: '' }
  ]);

  useEffect(() => {
    const targetStats = [10, 24, 3];
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timers = targetStats.map((target, index) => {
      return setInterval(() => {
        setAnimatedStats(prev => prev.map((stat, i) => {
          if (i === index && stat.value < target) {
            return { ...stat, value: Math.min(stat.value + Math.ceil(target / steps), target) };
          }
          return stat;
        }));
      }, interval);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {animatedStats.map((stat, index) => (
        <div key={index} className="glass-effect p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all">
          <div className="flex items-center justify-center mb-4 text-primary">
            {stat.icon}
          </div>
          <div className="text-4xl font-bold text-center mb-2 text-primary">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-center text-foreground/70">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
