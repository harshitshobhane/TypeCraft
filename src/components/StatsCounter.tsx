import { useEffect, useState } from 'react';
import { Trophy, Star, Shield, Gamepad } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface Stat {
  value: number;
  label: string;
  icon: JSX.Element;
  suffix: string;
  about: string;
}

export const StatsCounter = () => {
  const [animatedStats, setAnimatedStats] = useState<Stat[]>([
    {
      value: 0,
      label: 'Unique Game Modes',
      icon: <Gamepad className="w-6 h-6" />, 
      suffix: '',
      about: 'Three Ways to Play'
    },
    {
      value: 0,
      label: 'Epic Boss Battles',
      icon: <Trophy className="w-6 h-6" />, 
      suffix: '',
      about: 'Fierce Boss Fights'
    },
    {
      value: 0,
      label: 'Global Leaderboards',
      icon: <Star className="w-6 h-6" />, 
      suffix: '',
      about: 'Compete Globally'
    }
  ]);

  useEffect(() => {
    const targetStats = [3, 5, 1];
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
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {animatedStats.map((stat, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div className="glass-effect p-6 rounded-xl border border-primary/20 hover:border-primary/40 transition-all cursor-help">
                <div className="flex items-center justify-center mb-4 text-primary">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-center mb-2 text-primary">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-center text-foreground/70">{stat.label}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{stat.about}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
