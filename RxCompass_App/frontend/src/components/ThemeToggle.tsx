import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"neon-dark" | "neon-blue">("neon-dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "neon-dark" | "neon-blue" | null;
    const initialTheme = savedTheme || "neon-dark";
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("neon-blue", initialTheme === "neon-blue");
    document.documentElement.classList.toggle("neon-dark", initialTheme === "neon-dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "neon-dark" ? "neon-blue" : "neon-dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("neon-blue", newTheme === "neon-blue");
    document.documentElement.classList.toggle("neon-dark", newTheme === "neon-dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 hover:from-purple-600/40 hover:to-blue-600/40 hover:border-purple-400/50 transition-all duration-300"
    >
      {theme === "neon-dark" ? (
        <Sparkles className="h-5 w-5 text-purple-400" />
      ) : (
        <Moon className="h-5 w-5 text-blue-400" />
      )}
    </Button>
  );
};
