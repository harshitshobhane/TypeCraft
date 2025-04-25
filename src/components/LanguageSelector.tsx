
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Sparkles } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
];

export const LanguageSelector = () => {
  return (
    <div className="fixed top-4 right-4 z-50 animate-float">
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-lg blur opacity-75"></div>
        <Select defaultValue="en">
          <SelectTrigger className="relative w-[180px] bg-background/95 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-colors">
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/50 to-accent/50"></div>
            <Globe className="w-4 h-4 mr-2 text-primary animate-pulse" />
            <SelectValue placeholder="Select Language" />
            <Sparkles className="w-3 h-3 absolute right-8 top-3 text-primary opacity-75" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-md border-primary/20">
            {languages.map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                className="hover:bg-primary/10 focus:bg-primary/20 transition-colors"
              >
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
