
import { Button } from "@/components/ui/button";
import { Share, Sparkles, Infinity } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const SocialShare = () => {
  const { toast } = useToast();
  const shareUrl = window.location.href;

  const handleShare = async (platform: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Typing Craft',
          text: 'Master the art of combat through typing in this thrilling time-travel shooter!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "Share the game with your friends!",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Button 
          variant="outline" 
          className="relative bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/10"
          onClick={() => handleShare('general')}
        >
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-md">
            <div className="tech-scanline"></div>
          </div>
          <Share className="w-5 h-5 mr-2 text-primary" />
          <span className="mr-2">Share Game</span>
          <Infinity className="w-4 h-4 text-accent animate-pulse" />
        </Button>
      </div>
    </div>
  );
};
