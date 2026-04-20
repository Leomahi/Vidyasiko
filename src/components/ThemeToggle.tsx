import { Sun, Gamepad2 } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "gaming-dark";
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      className="rounded-full"
      title={isDark ? "Switch to Light theme" : "Switch to Gaming theme"}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Gamepad2 className="w-4 h-4" />}
    </Button>
  );
}
