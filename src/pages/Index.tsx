import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/FeatureCard";
import { Timer, Gamepad, Clock, Diamond, Trophy, Star } from "lucide-react";
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
                Navigate through a cybernetic universe where your typing skills determine your survival. Battle against AI adversaries across different time periods with our state-of-the-art typing combat system.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="px-4 py-2 rounded-full border border-primary/50 bg-background/80 backdrop-blur-sm">
                  <span className="text-primary">99.8% Accuracy</span>
                </div>
                <div className="px-4 py-2 rounded-full border border-secondary/50 bg-background/80 backdrop-blur-sm">
                  <span className="text-secondary">120 WPM</span>
                </div>
                <div className="px-4 py-2 rounded-full border border-accent/50 bg-background/80 backdrop-blur-sm">
                  <span className="text-accent">Premium Engine</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  <span className="mr-2">
                    <Diamond className="w-4 h-4" />
                  </span>
                  Watch Trailer
                </Button>
                <Button 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <span className="mr-2">
                    <Star className="w-4 h-4" />
                  </span>
                  Game Features
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
      <section className="container mx-auto px-4 py-16">
        <h2 className="orbitron text-3xl md:text-4xl font-bold text-center mb-12 text-primary text-glow">
          Premium Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Timer className="w-8 h-8" />}
            title="Speed Typing"
            description="Test your typing skills in fast-paced combat scenarios with advanced accuracy tracking and personalized performance metrics."
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8" />}
            title="Time Travel"
            description="Navigate through richly detailed time periods, each with unique challenges, enemies, and historically accurate typing content."
          />
          <FeatureCard
            icon={<Gamepad className="w-8 h-8" />}
            title="Epic Battles"
            description="Face increasingly difficult opponents with adaptive AI that adjusts to your skill level, ensuring a perfectly balanced challenge."
          />
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
