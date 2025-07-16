import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 h-12 w-12 rounded-full clock-glass hover-lift"
    >
      {theme === 'dark' ? (
        <Sun className="h-6 w-6 text-clock-accent" />
      ) : (
        <Moon className="h-6 w-6 text-clock-accent" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}