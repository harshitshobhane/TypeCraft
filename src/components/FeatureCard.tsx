
import { ReactNode } from 'react';

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
