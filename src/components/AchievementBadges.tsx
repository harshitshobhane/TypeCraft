import { Badge } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const achievements = [
  {
    id: 1,
    name: "Boss Slayer",
    description: "Defeat your first boss enemy.",
    icon: "🐉",
  },
  {
    id: 2,
    name: "Combo Conqueror",
    description: "Achieve a 20x combo streak.",
    icon: "🔥",
  },
  {
    id: 3,
    name: "World Champion",
    description: "Reach the top 10 on the global leaderboard.",
    icon: "🌎",
  },
];

export const AchievementBadges = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {achievements.map((achievement) => (
        <TooltipProvider key={achievement.id}>
          <Tooltip>
            <TooltipTrigger>
              <div className="glass-effect p-4 rounded-xl border border-primary/20 hover:border-primary/40 transition-all cursor-help">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <Badge className="w-5 h-5" />
                  <span className="text-sm font-medium">{achievement.name}</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{achievement.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
