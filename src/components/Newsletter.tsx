
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about new features and launches.",
      });
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
        <div className="relative bg-background/80 backdrop-blur-sm rounded-lg border border-primary/20 p-6">
          <div className="absolute top-0 right-0 -mt-2 -mr-2">
            <Star className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="relative space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">Stay Updated</h3>
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email for updates"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-4 pr-12 py-6 bg-background/60 border-primary/20 focus:border-primary/40 transition-colors"
                required
              />
              <div className="absolute right-3 top-3">
                <Sparkles className="w-4 h-4 text-primary/40" />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary-foreground backdrop-blur-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="tech-scanline"></div>
              </div>
              <span className="relative z-10 flex items-center gap-2">
                Subscribe to Updates
                <Star className="w-4 h-4 animate-pulse" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
