
import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star } from "lucide-react";

const gameScreenshots = [
  {
    id: 1,
    title: "Cybernetic Arena",
    description: "Face off against digital foes in the Cybernetic Arena",
    difficulty: "Medium"
  },
  {
    id: 2,
    title: "Time Warp Challenge",
    description: "Type your way through different time periods",
    difficulty: "Hard"
  },
  {
    id: 3,
    title: "Matrix Training",
    description: "Sharpen your skills in the virtual dojo",
    difficulty: "Easy"
  }
];

export const GameGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative max-w-5xl mx-auto">
      <Carousel
        opts={{
          loop: true,
          align: "center",
        }}
        className="w-full"
        setApi={(api) => {
          api?.on("select", () => {
            setActiveIndex(api.selectedScrollSnap());
          });
        }}
      >
        <CarouselContent>
          {gameScreenshots.map((screenshot, index) => (
            <CarouselItem key={screenshot.id} className="md:basis-3/4">
              <div 
                className={`relative h-[300px] md:h-[400px] rounded-xl overflow-hidden transition-all duration-500 ${
                  activeIndex === index ? 'scale-100 opacity-100' : 'scale-90 opacity-70'
                }`}
              >
                <div className="absolute inset-0 premium-gradient animate-pulse-glow"></div>
                
                <div className="absolute inset-0 animated-bg"></div>
                
                {/* Preview content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 glass-effect">
                  <h3 className="orbitron text-2xl md:text-3xl text-primary font-bold mb-4 text-glow-intense">
                    {screenshot.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy size={20} className="text-primary" />
                    <span className="text-sm font-medium text-white/80">
                      Difficulty: {screenshot.difficulty}
                    </span>
                  </div>
                  <p className="text-white/70 mb-6 max-w-md">
                    {screenshot.description}
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={16} 
                        className={`${star <= 4 ? 'text-primary fill-primary' : 'text-white/30'}`} 
                      />
                    ))}
                  </div>
                </div>
                
                {/* Tech effect */}
                <div className="tech-scanline"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm hover:bg-background border-primary text-primary" />
        <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm hover:bg-background border-primary text-primary" />
      </Carousel>
      
      <div className="flex justify-center mt-6 gap-2">
        {gameScreenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              activeIndex === index ? 'w-8 bg-primary' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
