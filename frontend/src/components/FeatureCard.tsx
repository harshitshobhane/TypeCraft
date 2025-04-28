import { ReactNode } from 'react';
import { Sword, Leaf, Clock } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="group relative p-6 rounded-lg border border-primary/30 bg-background/50 backdrop-blur-sm hover:border-primary/60 transition-colors neon-border">
      <div className="mb-4 text-primary text-2xl">
        {icon}
      </div>
      <h3 className="orbitron text-xl font-bold mb-2 text-primary">{title}</h3>
      <p className="text-foreground/80">{description}</p>
    </div>
  );
};

// Example usage for your modes (to be used where FeatureCard is rendered):
// <FeatureCard
//   icon={<Sword size={32} />} 
//   title="Combat Mode"
//   description="Engage in fast-paced typing battles against AI opponents."
// />
// <FeatureCard
//   icon={<Leaf size={32} />} 
//   title="Zen Mode"
//   description="Relax and improve your typing in a peaceful, garden-themed environment."
// />
// <FeatureCard
//   icon={<Clock size={32} />} 
//   title="Time Attack Mode"
//   description="Race against the clock to achieve the highest score possible."
// />
