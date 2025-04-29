
import { Command, Code, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const TechStack = () => {
  const technologies = [
    { name: 'TypeScript', category: 'Language' },
    { name: 'React', category: 'Framework' },
    { name: 'Tailwind', category: 'Styling' },
    { name: 'Three.js', category: 'Graphics' },
    { name: 'WebGL', category: '3D' },
    { name: 'Shadcn/ui', category: 'Components' }
  ];

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-effect p-6 rounded-xl border border-primary/20 group hover:border-primary/40 transition-all">
          <Command className="w-8 h-8 text-primary mb-4" />
          <h3 className="orbitron text-xl font-bold mb-2 text-primary">Modern Tech Stack</h3>
          <p className="text-foreground/70 mb-4">Built with cutting-edge technologies for optimal performance</p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge key={tech.name} variant="secondary" className="animate-fade-in">
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="glass-effect p-6 rounded-xl border border-primary/20 group hover:border-primary/40 transition-all">
          <Code className="w-8 h-8 text-primary mb-4" />
          <h3 className="orbitron text-xl font-bold mb-2 text-primary">Clean Code</h3>
          <p className="text-foreground/70">
            Optimized codebase ensuring smooth gameplay and responsive controls
          </p>
        </div>

        <div className="glass-effect p-6 rounded-xl border border-primary/20 group hover:border-primary/40 transition-all">
          <Shield className="w-8 h-8 text-primary mb-4" />
          <h3 className="orbitron text-xl font-bold mb-2 text-primary">Secure & Fast</h3>
          <p className="text-foreground/70">
            Built with security and performance in mind for the best gaming experience
          </p>
        </div>
      </div>
    </div>
  );
};
