
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Languages, Sparkles } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
];

export const LanguageSelector = () => {
  const handleLanguageChange = (value: string) => {
    // Here we'll implement language change logic later
    console.log('Language changed to:', value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-lg blur opacity-75 animate-pulse"></div>
        <Select onValueChange={handleLanguageChange} defaultValue="en">
          <SelectTrigger className="relative w-[180px] bg-background/95 backdrop-blur-md border-primary/20 hover:border-primary/40 transition-colors group">
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary/50 to-accent/50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded"></div>
            <Languages className="w-4 h-4 mr-2 text-primary animate-pulse" />
            <SelectValue placeholder="Select Language" />
            <Sparkles className="w-3 h-3 absolute right-8 top-3 text-primary opacity-75" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-md border-primary/20">
            {languages.map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                className="hover:bg-primary/10 focus:bg-primary/20 transition-colors cursor-pointer"
              >
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};
