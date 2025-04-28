import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { Timer, Gamepad, Clock, Diamond, Trophy, Star, Sword, Leaf, Brain, Shuffle, Zap, Palette } from "lucide-react";
import { GameModel3D } from "@/components/GameModel3D";
import { CyberParticles } from "@/components/CyberParticles";
import { GameGallery } from "@/components/GameGallery";
import { StatsCounter } from "@/components/StatsCounter";
import { TechStack } from "@/components/TechStack";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { RegisterModal } from "@/components/RegisterModal";
import { Newsletter } from "@/components/Newsletter";
import { SocialShare } from "@/components/SocialShare";
import { AchievementBadges } from "@/components/AchievementBadges";
import { LanguageSelector } from "@/components/LanguageSelector";

const Index = () => {
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Simulate loading
    const timer = setTimeout(() => setIsLoaded(true), 500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  const parallaxStyle = {
    transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
  };

  return (
    <div className={`min-h-screen w-full bg-background overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <LanguageSelector />
      
      <div className="absolute inset-0 bg-radial-gradient"></div>
      <div className="absolute inset-0 bg-cyber-grid bg-grid"></div>
      
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-20 pb-20 md:pb-32 text-center">
        <div className="relative z-10" style={parallaxStyle}>
          <h1 className="orbitron text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-glow-intense bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Typing Craft
          </h1>
          <div className="exo text-xl md:text-2xl mb-8 text-foreground/80 max-w-2xl mx-auto typing-cursor">
            Master the art of combat through typing in this thrilling time-travel shooter
          </div>
          <Button 
            size="lg" 
            className="orbitron text-lg px-10 py-7 bg-primary hover:bg-primary/90 text-primary-foreground animate-float neon-border-intense"
            onClick={() => setShowRegisterModal(true)}
          >
            <Trophy className="w-5 h-5 mr-2" />
            Join The Battle
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative container mx-auto px-4 py-16">
        <h2 className="orbitron text-3xl md:text-4xl font-bold text-center mb-12 text-primary text-glow">
          Launch Features
        </h2>
        <StatsCounter />
      </section>

      {/* Achievement Badges Section */}
      <section className="relative container mx-auto px-4 py-16">
        <h2 className="orbitron text-3xl md:text-4xl font-bold text-center mb-12 text-primary text-glow">
          Unlock Epic Achievements
        </h2>
        <AchievementBadges />
      </section>

      {/* 3D Model Section */}
      <section className="relative container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="orbitron text-3xl md:text-4xl font-bold mb-6 text-primary text-glow">
                Futuristic <br />
                <span className="text-accent">Typing Experience</span>
              </h2>
              <p className="mb-6 text-foreground/80">
                Choose your adventure: battle AI in Combat Mode, find your flow in Zen Mode, or race the clock in Time Attack Mode. Level up your typing skills with every game!
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="px-4 py-2 rounded-full border border-primary/50 bg-background/80 backdrop-blur-sm">
                  <span className="text-primary">Adaptive AI</span>
                </div>
                <div className="px-4 py-2 rounded-full border border-secondary/50 bg-background/80 backdrop-blur-sm">
                  <span className="text-secondary">Flow Mode</span>
                </div>
                <div className="px-4 py-2 rounded-full border border-accent/50 bg-background/80 backdrop-blur-sm">
                  <span className="text-accent">Speed Rush</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  <Diamond className="w-4 h-4 mr-2" />
                  Watch Trailer
                </Button>
                <Button 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => {
                    const featuresSection = document.getElementById('features-section');
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Explore Game Features
                </Button>
              </div>
            </div>
            <div className="lg:mt-0 mt-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-xl opacity-70"></div>
                <div className="relative bg-background/60 backdrop-blur-sm rounded-xl border border-primary/20 overflow-hidden neon-border">
                  <GameModel3D />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative container mx-auto px-4 py-16">
        <h2 className="orbitron text-3xl md:text-4xl font-bold text-center mb-12 text-primary text-glow">
          Powered By
        </h2>
        <TechStack />
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="orbitron text-3xl md:text-4xl font-bold text-center mb-12 text-primary text-glow">
          Game Environments
        </h2>
        <GameGallery />
      </section>

      {/* Features Section */}
      <section id="features-section" className="container mx-auto px-4 py-16">
        <h2 className="orbitron text-3xl md:text-4xl font-bold text-center mb-12 text-primary text-glow">
          Explosive Game Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-6 rounded-lg border border-primary/30 bg-background/60 backdrop-blur-sm neon-border">
            <Brain className="text-primary w-8 h-8 mt-1" />
            <div>
              <div className="font-bold text-lg text-primary">Adaptive AI</div>
              <div className="text-foreground/90">Every match is a new challenge as the game learns and adapts to your typing skills.</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg border border-secondary/30 bg-background/60 backdrop-blur-sm neon-border">
            <Shuffle className="text-secondary w-8 h-8 mt-1" />
            <div>
              <div className="font-bold text-lg text-secondary">Multiple Modes</div>
              <div className="text-foreground/90">Switch between Combat, Zen, and Time Attack for endless variety.</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg border border-accent/30 bg-background/60 backdrop-blur-sm neon-border">
            <Trophy className="text-accent w-8 h-8 mt-1" />
            <div>
              <div className="font-bold text-lg text-accent">Real-Time Leaderboards</div>
              <div className="text-foreground/90">Compete with friends and players worldwide for the top spot.</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg border border-primary/30 bg-background/60 backdrop-blur-sm neon-border">
            <Zap className="text-primary w-8 h-8 mt-1" />
            <div>
              <div className="font-bold text-lg text-primary">Power-Ups</div>
              <div className="text-foreground/90">Unlock and use special abilities to boost your performance and outpace the competition.</div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-lg border border-secondary/30 bg-background/60 backdrop-blur-sm neon-border">
            <Palette className="text-secondary w-8 h-8 mt-1" />
            <div>
              <div className="font-bold text-lg text-secondary">Customization</div>
              <div className="text-foreground/90">Personalize your experience with themes, avatars, and more.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social and Newsletter Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="orbitron text-2xl md:text-3xl font-bold mb-6 text-center text-primary text-glow">
              Share the Adventure
            </h2>
            <SocialShare />
          </div>
          <div>
            <h2 className="orbitron text-2xl md:text-3xl font-bold mb-6 text-center text-primary text-glow">
              Stay Updated
            </h2>
            <Newsletter />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-lg blur opacity-70"></div>
          <div className="relative p-8 rounded-lg border border-primary/30 backdrop-blur-sm neon-border glass-effect">
            <h2 className="orbitron text-2xl md:text-3xl font-bold mb-4 text-primary text-glow">
              Ready to Begin Your Journey?
            </h2>
            <p className="mb-6 text-foreground/80">
              Join the ranks of elite time-traveling typists and defend the timeline with your keyboard skills!
            </p>
            <Button 
              size="lg"
              className="orbitron bg-accent hover:bg-accent/90 text-accent-foreground animate-pulse-glow"
            >
              <span className="mr-2">
                <Star className="w-5 h-5" />
              </span>
              Start Your Adventure
            </Button>
            <div className="mt-6 text-sm text-foreground/60 flex justify-center gap-8">
              <span className="flex items-center gap-1">
                <Diamond className="w-4 h-4 text-primary" />
                Made in India with ❤️ by Harshit
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-primary" />
                Global Leaderboards
              </span>
            </div>
          </div>
        </div>
      </section>

      <RegisterModal open={showRegisterModal} onOpenChange={setShowRegisterModal} />
    </div>
  );
};

export default Index;
